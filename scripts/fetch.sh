#!/bin/bash

# プロジェクトのルートディレクトリ（このスクリプトが置かれている場所を基準）
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 設定
REPO_PATH="${ROOT_DIR}/k8s-repo/website"
OUTPUT_DIR="${ROOT_DIR}/data/master"
OUTPUT_FILE="${OUTPUT_DIR}/translation_history.csv"
CACHE_DIR="${ROOT_DIR}/data/cache"
LAST_COMMIT_FILE="${CACHE_DIR}/last_commit.txt"

# 出力ディレクトリとキャッシュディレクトリが存在しなければ作成
mkdir -p "${OUTPUT_DIR}"
mkdir -p "${CACHE_DIR}"

# 翻訳履歴を取得する関数
fetch_history() {
  local start_commit=$1
  local end_commit=$2
  local output_file=$3
  local append=$4

  # ヘッダーを書き込むか追記するか
  if [ "$append" != "true" ]; then
    echo "hash,author,email,date,message,filepath" > "$output_file"
  fi

  # コミット範囲の指定
  local commit_range=""
  if [ -n "$start_commit" ] && [ -n "$end_commit" ]; then
    commit_range="${start_commit}..${end_commit}"
  fi

  # 翻訳履歴の取得
  git log --pretty=format:'%H,%an,%ae,%ad,"%s"' --name-only $commit_range -- content/ | \
  awk 'BEGIN {RS=""; FS="\n"} { 
    commit=$1; 
    for(i=2; i<=NF; i++) {
      if($i ~ /^content/) {
        print commit","$i
      }
    }
  }' >> "$output_file"
}

# リポジトリが存在しなければクローン
if [ ! -d "$REPO_PATH" ]; then
  echo "Kubernetesリポジトリをクローンしています..."
  mkdir -p "$(dirname "$REPO_PATH")"
  git clone -b main --single-branch https://github.com/kubernetes/website.git "$REPO_PATH"
fi

# リポジトリに移動
cd "$REPO_PATH"

# リポジトリを最新の状態に更新
echo "リポジトリを最新の状態に更新しています..."
git pull origin main

# 現在のHEADコミットハッシュを取得
CURRENT_HEAD=$(git rev-parse HEAD)

# 前回処理したコミットハッシュを取得
if [ -f "$LAST_COMMIT_FILE" ]; then
  LAST_COMMIT=$(cat "$LAST_COMMIT_FILE")
  echo "前回の処理から新しいコミットを取得します: ${LAST_COMMIT} → ${CURRENT_HEAD}"
  
  # 新しいコミットがあるか確認
  if git merge-base --is-ancestor "$LAST_COMMIT" "$CURRENT_HEAD"; then
    # 最後のコミットから現在までの変更履歴を取得
    fetch_history "$LAST_COMMIT" "$CURRENT_HEAD" "$OUTPUT_FILE" "true"
  else
    echo "前回のコミットがHISTORYに存在しません。完全な履歴を再取得します。"
    # 全履歴を取得
    fetch_history "" "" "$OUTPUT_FILE" "false"
  fi
else
  echo "初回実行、または前回のコミット情報がありません。全履歴を取得します。"
  # 全履歴を取得
  fetch_history "" "" "$OUTPUT_FILE" "false"
fi

# 現在のコミットハッシュを保存
echo "$CURRENT_HEAD" > "$LAST_COMMIT_FILE"

echo "CSV file created/updated: $OUTPUT_FILE"
echo "最後に処理したコミットハッシュ: $CURRENT_HEAD"