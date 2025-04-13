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
REPO_CONTENT_PATH="${REPO_PATH}/content"
OUTPUT_DIR="${ROOT_DIR}/data/master/languages"

mkdir -p "${OUTPUT_DIR}"

LANGUAGES=("bn" "de" "en" "es" "fr" "hi" "it" "ja" "ko" "pl" "pt-br" "ru" "uk" "vi" "zh-cn")

log_info "Starting to collect files for each language..."

for lang in "${LANGUAGES[@]}"; do
  lang_dir="${REPO_CONTENT_PATH}/${lang}"
  
  if [ ! -d "$lang_dir" ]; then
    log_warn "Directory for language '$lang' not found at $lang_dir. Skipping."
    continue
  fi
  
  lang_output_dir="${OUTPUT_DIR}/${lang}"
  mkdir -p "$lang_output_dir"
  
  log_info "Processing language: $lang"

  cd "${REPO_PATH}"
  
  find "content/${lang}" -type f | sort > "${lang_output_dir}/all_files.csv"
  
  cd - > /dev/null
  
  file_count=$(wc -l < "${lang_output_dir}/all_files.csv")
  log_success "Found $file_count files for $lang"
done

log_success "File collection complete. Results saved to language-specific directories in ${OUTPUT_DIR}"
