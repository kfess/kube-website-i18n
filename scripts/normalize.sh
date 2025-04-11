#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
INPUT_FILE="$1"
if [ -z "$INPUT_FILE" ]; then
    INPUT_FILE="$PROJECT_ROOT/data/master/translation_history.csv"
fi

if [[ ! "$INPUT_FILE" = /* ]]; then
    INPUT_FILE="$SCRIPT_DIR/$INPUT_FILE"
fi

OUTPUT_DIR="$PROJECT_ROOT/data/processed/languages"

mkdir -p "$OUTPUT_DIR"

if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: No input file found: $INPUT_FILE"
    echo "Usage: ./normalize.sh [csv file path]"
    exit 1
fi

LANGUAGE_CODES=("bn" "de" "es" "fr" "hi" "id" "ja" "ko" "pl" "pt-br" "ru" "uk" "zh-cn")

TEMP_DATA="$PROJECT_ROOT/data/temp/parsed_data.txt"
TEMP_DIR="$(dirname "$TEMP_DATA")"
mkdir -p "$TEMP_DIR"

> "$TEMP_DATA"

line_count=0

# skip the header line
tail -n +2 "$INPUT_FILE" | while IFS=, read -r hash author _email date message filepath; do
    line_count=$((line_count + 1))
    if [ $((line_count % 100)) -eq 0 ]; then
        echo "Finished processing $line_count lines..."
    fi

    if [ -z "$hash" ] || [ -z "$filepath" ] || [ "$hash" = "hash" ]; then
        continue
    fi

    # filepathをクリーンアップ（改行や引用符を削除）
    filepath=$(echo "$filepath" | tr -d '\r\n' | tr -d '"')

    language="unknown"
    for lang in "${LANGUAGE_CODES[@]}"; do
        if [[ "$filepath" == content/$lang/* ]]; then
            language="$lang"
            break
        fi
    done

    if [ "$language" = "unknown" ]; then
        continue
    fi

    # Extract content type from the filepath (e.g., docs, blog)
    if [[ "$filepath" =~ content/$language/([^/]+)/ ]]; then
        content_type="${BASH_REMATCH[1]}"
    else
        continue
    fi

    # 翻訳ファイルを英語パスに正規化
    english_path="$filepath"
    if [ "$language" != "en" ]; then
        english_path="${filepath/content\/$language\//content\/}"
    fi

    echo "${content_type}|${english_path}|${language}|${hash}|${author}|${date}|${message}|${filepath}" >> "$TEMP_DATA"
done

echo "Extracted content types:"
mapfile -t content_types < <(cut -d'|' -f1 "$TEMP_DATA" | sort | uniq)
for type in "${content_types[@]}"; do
    count=$(grep -c "^${type}|" "$TEMP_DATA")
    echo "  - $type ($count 件)"
done

echo "Start generating JSON files for each content type..."
for content_type in "${content_types[@]}"; do
    echo "Generating JSON for content type: $content_type"

    output_file="$OUTPUT_DIR/${content_type}.json"
    type_data="$TEMP_DIR/${content_type}_data.txt"
    grep "^${content_type}|" "$TEMP_DATA" > "$type_data"

    mapfile -t english_paths < <(cut -d'|' -f2 "$type_data" | sort | uniq)

    # Indicate the start of the JSON object
    echo "{" > "$output_file"

    # 英語パスの数を取得
    path_count=${#english_paths[@]}
    current_path=0

    # 各英語パスに対してJSONオブジェクトを生成
    for english_path in "${english_paths[@]}"; do
        current_path=$((current_path + 1))

        # エスケープ処理
        escaped_path=$(echo "$english_path" | sed 's/"/\\"/g')

        # JSONのパスキーを出力
        echo "  \"$escaped_path\": {" >> "$output_file"
        echo "    \"translations\": {" >> "$output_file"

        # 各言語ごとの翻訳情報を生成
        lang_count=0

        for lang in "${LANGUAGE_CODES[@]}"; do
            lang_count=$((lang_count + 1))

            # 言語ブロックの開始
            echo "      \"$lang\": {" >> "$output_file"

            # 翻訳が存在するかチェック
            lang_data=$(grep "^${content_type}|${english_path}|${lang}|" "$type_data" || true)

            if [ -n "$lang_data" ]; then
                # 翻訳が存在する場合
                lang_path="${english_path/content\//content\/$lang\/}"

                echo "        \"exists\": true," >> "$output_file"
                echo "        \"path\": \"$lang_path\"," >> "$output_file"
                echo "        \"commits\": [" >> "$output_file"

                # ========== ここが変更部分 ==========
                # コミット数を先に計算
                commit_lines=$(echo "$lang_data" | wc -l)
                current_commit=0

                # 一時ファイルを使わずに処理
                while IFS='|' read -r ct ep l h a d m fp; do
                    current_commit=$((current_commit + 1))

                    # メッセージの引用符をエスケープ
                    m=$(echo "$m" | sed 's/"/\\"/g')

                    echo "          {" >> "$output_file"
                    echo "            \"hash\": \"$h\"," >> "$output_file"
                    echo "            \"date\": \"$d\"," >> "$output_file"
                    echo "            \"message\": \"$m\"," >> "$output_file"
                    echo "            \"author\": \"$a\"" >> "$output_file"

                    # 最後のコミット以外にカンマを追加
                    if [ $current_commit -lt $commit_lines ]; then
                        echo "          }," >> "$output_file"
                    else
                        echo "          }" >> "$output_file"
                    fi
                done <<< "$lang_data"
                # ====================================

                echo "        ]" >> "$output_file"
            else
                # 翻訳が存在しない場合
                echo "        \"exists\": false" >> "$output_file"
            fi

            # 言語ブロックの終了（カンマ追加）
            if [ $lang_count -lt ${#LANGUAGE_CODES[@]} ]; then
                echo "      }," >> "$output_file"
            else
                echo "      }" >> "$output_file"
            fi
        done

        echo "    }" >> "$output_file"

        # パスブロックの終了（カンマ追加）
        if [ $current_path -lt $path_count ]; then
            echo "  }," >> "$output_file"
        else
            echo "  }" >> "$output_file"
        fi
    done

    # End of the JSON object
    echo "}" >> "$output_file"

    echo "Generated file '$output_file' ($(wc -l < "$output_file") lines)"
done

echo "Finished processing all files!"
echo "JSON files are located in '$OUTPUT_DIR/' directory"
ls -la "$OUTPUT_DIR/"
