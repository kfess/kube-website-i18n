#!/bin/bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUTPUT_DIR="${ROOT_DIR}/data/master"
OUTPUT_FILE="${OUTPUT_DIR}/pull_requests.json"

REPOSITORY="kubernetes/website"
UPPER_LIMIT=${1:-30}

mkdir -p "${OUTPUT_DIR}"

echo "Fetching PRs for repository: $REPOSITORY (max: $UPPER_LIMIT)"

tmp_file=$(mktemp)

prs=$(gh pr list -R "${REPOSITORY}" --state open --json number,title --limit "${UPPER_LIMIT}")

echo "[" > "${tmp_file}"
first=true

echo "$prs" | jq -c '.[]' | while read -r pr; do
  pr_number=$(echo "${pr}" | jq -r '.number')
  pr_title=$(echo "${pr}" | jq -r '.title')

  echo "Processing PR #${pr_number}: ${pr_title}"

  files=$(gh pr view "${pr_number}" -R "${REPOSITORY}" --json files --jq '[.files[].path]')

  if [ "$first" = true ]; then
    first=false
  else
    echo "," >> "${tmp_file}"
  fi

  jq -n \
    --arg num "$pr_number" \
    --arg title "$pr_title" \
    --argjson files "$files" \
    '{pr_number: $num|tonumber, pr_title: $title, files: $files}' >> "${tmp_file}"
done

echo "]" >> "${tmp_file}"

jq '.' "${tmp_file}" > "${OUTPUT_FILE}"

echo "PR data saved to: ${OUTPUT_FILE}"
echo "Total PRs processed: $(jq '. | length' "${OUTPUT_FILE}")"
echo "Completed at: $(date)"

rm "${tmp_file}"