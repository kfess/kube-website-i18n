#!/bin/bash

set -e

# Script to sort blog posts by date prefix (YYYY-MM-DD) and output sorted JSON

show_usage() {
  echo "Usage: $0 <blog.json> [--inplace]"
  echo "Sort blog posts by date prefix (YYYY-MM-DD) and output sorted JSON"
  echo "  --inplace: Update the original JSON file instead of printing to stdout"
}

show_error() {
  echo "Error: $1" >&2
  exit 1
}

if [ -z "$1" ]; then
  show_usage
  exit 1
fi

JSON_FILE="$1"
INPLACE=false

if [ "$2" = "--inplace" ]; then
  INPLACE=true
fi

if [ ! -f "$JSON_FILE" ]; then
  show_error "File not found: $JSON_FILE"
fi

if ! command -v jq &> /dev/null; then
  show_error "jq not found. Please install jq to run this script.\nInstall with: sudo apt-get install jq or brew install jq"
fi

TMP_FILE=$(mktemp)

jq -r '
  # 各エントリーをオブジェクトに変換して配列に集める
  [to_entries[] | 
    # キーを取得（ファイルパス）
    .key as $path |
    # blog/_postsディレクトリの記事だけをフィルタリング
    select($path | test("/blog/_posts/")) |
    # 日付パターンを抽出
    (
      # 日付パターンを抽出試行
      if ($path | test("/blog/_posts/([0-9]{4}-[0-9]{2}-[0-9]{2})")) then
        ($path | capture("/blog/_posts/([0-9]{4}-[0-9]{2}-[0-9]{2})").captures[0].string)
      else
        "0000-00-00"
      end
    ) as $date |
    # 元のエントリー情報と日付を含むオブジェクトを作成
    {path: $path, date: $date, data: .value}
  ] |
  # 日付でソート（降順）
  sort_by(.date) | reverse |
  # ソートした配列からオブジェクトを再構築
  reduce .[] as $item ({}; . + {($item.path): $item.data})
' "$JSON_FILE" > "$TMP_FILE"

if [ "$INPLACE" = true ]; then
  mv "$TMP_FILE" "$JSON_FILE"
  echo "Original JSON file has been updated with sorted data."
else
  cat "$TMP_FILE"
  rm "$TMP_FILE"
fi