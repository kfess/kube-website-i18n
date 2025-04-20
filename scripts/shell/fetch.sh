#!/bin/bash

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color（リセット）

log_info() {
  echo -e "${BLUE}[INFO]${NC} $*" >&2
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $*" >&2
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $*" >&2
}

log_success() {
  echo -e "${GREEN}[OK]${NC} $*" >&2
}

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
REPO_PATH="${ROOT_DIR}/k8s-repo/website"
OUTPUT_DIR="${ROOT_DIR}/data/master"
OUTPUT_FILE="${OUTPUT_DIR}/git_history.csv"
CACHE_DIR="${ROOT_DIR}/data/cache"
LAST_COMMIT_FILE="${CACHE_DIR}/last_commit.txt"

mkdir -p "${OUTPUT_DIR}"
mkdir -p "${CACHE_DIR}"

fetch_history() {
  local start_commit=$1
  local end_commit=$2
  local output_file=$3
  local append=$4

  if [ "$append" != "true" ]; then
    echo "hash,author,date,message,filepath" > "$output_file"
  fi

  local commit_range=""
  if [ -n "$start_commit" ] && [ -n "$end_commit" ]; then
    commit_range="${start_commit}..${end_commit}"
  fi

  git log --pretty=format:'%H%x1F%an%x1F%ad%x1F%s' --name-only "${commit_range}" -- content/ | \
  awk '
    BEGIN { RS=""; FS="\n" }
    {
      split($1, meta, "\x1F")
      # エスケープ処理
      for (i = 1; i <= 4; i++) {
        gsub(/"/, "\"\"", meta[i])
        gsub(/\r/, "", meta[i])
        gsub(/\n/, "", meta[i])
      }

      for (i = 2; i <= NF; i++) {
        if ($i ~ /^content/) {
          # すべての列を "..." で囲む
          print "\"" meta[1] "\",\"" meta[2] "\",\"" meta[3] "\",\"" meta[4] "\",\"" $i "\""
        }
      }
    }
  ' >> "$output_file"
}

if [ ! -d "$REPO_PATH" ]; then
  log_info "Clone the Kubernetes repository..."
  mkdir -p "$(dirname "$REPO_PATH")"
  git clone -b main --single-branch https://github.com/kubernetes/website.git "$REPO_PATH"
fi

cd "$REPO_PATH"

# echo "Updating the repository to the latest version..."
log_info "Updating the repository to the latest version..."
git pull origin main

CURRENT_HEAD=$(git rev-parse HEAD)

if [ -f "$LAST_COMMIT_FILE" ]; then
  LAST_COMMIT=$(cat "$LAST_COMMIT_FILE")
  log_info "Fetching new commits since last processed commit: ${LAST_COMMIT} → ${CURRENT_HEAD}"

  if git merge-base --is-ancestor "$LAST_COMMIT" "$CURRENT_HEAD"; then
    fetch_history "$LAST_COMMIT" "$CURRENT_HEAD" "$OUTPUT_FILE" "true"
  else
    log_warn "Previous commit not found in history. Fetching full history."
    fetch_history "" "" "$OUTPUT_FILE" "false"
  fi
else
  log_info "First run or no previous commit information. Fetching full history."
  fetch_history "" "" "$OUTPUT_FILE" "false"
fi

echo "$CURRENT_HEAD" > "$LAST_COMMIT_FILE"
log_success "CSV file created/updated: $OUTPUT_FILE"
log_success "Last processed commit hash: $CURRENT_HEAD"
