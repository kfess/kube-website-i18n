import json
import re
from pathlib import Path

import pandas as pd


LANGUAGE_CODES = [
    "bn",
    "de",
    "en",
    "es",
    "fr",
    "hi",
    "id",
    "it",
    "ja",
    "ko",
    "pl",
    "pt-br",
    "ru",
    "uk",
    "vi",
    "zh-cn",
]

DEPRECATED_LANGUAGE_CODES = [
    "cn",  # Chinese
    "zh",  # Chinese
    "pt",  # Portuguese
    "no",  # Norwegian
]

ALL_LANGUAGE_CODES = LANGUAGE_CODES + DEPRECATED_LANGUAGE_CODES


ALLOWED_FILE_EXTENSIONS = ["md", "html"]


def extract_extension(filepath: str) -> str:
    """Extract the file extension from a given filepath."""
    return filepath.split(".")[-1] if "." in filepath else None


def extract_lang_code(path: str) -> str | None:
    """Extract the language code from a given file path.

    Args:
    ----
        path (str): The file path from which to extract the language code.

    Returns:
    -------
        str | None: The extracted language code if found, otherwise None.

    """
    for lang in ALL_LANGUAGE_CODES:
        if f"content/{lang}/" in path:
            return lang

    return None


def normalize_path(path: str) -> str:
    """Normalize the file path to English path.

    Args:
    ----
        path (str): The file path to normalize.

    Returns:
    -------
        str: The normalized English path.

    """
    for lang in ALL_LANGUAGE_CODES:
        if f"content/{lang}/" in path:
            return path.replace(f"content/{lang}/", "content/en/")

    return path


def extract_content_type(en_path: str) -> str | None:
    """Extract the content type from the path.

    Args:
    ----
        en_path (str): The file path.

    Returns:
    -------
        str | None: The extracted content type if found, otherwise None.

    """
    match = re.search(rf"content/({'|'.join(ALL_LANGUAGE_CODES)})/([^/]+)/", en_path)
    return match.group(2) if match else None


def get_all_existing_paths() -> set:
    """Get all existing paths from the language directories.

    Returns
    -------
        set[str]: A set of all existing file paths.

    """
    all_paths = set()

    target_dir = Path("../../data/master/languages")
    for lang in ALL_LANGUAGE_CODES:
        target_path = target_dir / lang / "all_files.csv"
        if target_path.exists():
            all_paths.update(
                pd.read_csv(target_path, encoding="utf-8", header=None)[0].tolist()
            )

    return all_paths


def extract_blog_date_from_en_path(en_path: str) -> str:
    """Extract date from blog post path.

    Args:
    ----
        en_path (str): The English file path.

    Returns:
    -------
        str: The extracted date in YYYY-MM-DD format.

    Example:
    -------
        content/en/blog/_posts/2024-10-02-xxxx.md -> 2024-10-02
        content/ja/blog/_posts/2025-03-26.md -> 2025-03-26

    """
    match = re.search(r"content/en/blog/_posts/(\d{4}-\d{2}-\d{2})", en_path)
    if match:
        return match.group(1)
    return "0000-00-00"


def extract_docs_sub_content_type(en_path: str) -> str | None:
    """Extract the sub-content type from the path.

    Args:
    ----
        en_path (str): The file path.

    Returns:
    -------
        str | None: The extracted sub-content type if found, otherwise None.

    """
    match = re.search(r"content/en/docs/([^/]+)/", en_path)
    return match.group(1) if match else None


def format_df(df: pd.DataFrame, all_existing_paths: set[str]) -> pd.DataFrame:
    """Format the DataFrame by extracting extensions and language codes.

    Args:
    ----
        df (pd.DataFrame): The DataFrame containing file paths.
        all_existing_paths (set[str]): A set of all existing file paths.

    Returns:
    -------
        pd.DataFrame: The formatted DataFrame
        with new columns for extension, language, and normalized path.

    """
    df["extension"] = df["filepath"].apply(extract_extension)
    df["language"] = df["filepath"].apply(extract_lang_code)
    df["english_path"] = df["filepath"].apply(normalize_path)
    df["content_type"] = df["english_path"].apply(extract_content_type)

    mask = (
        ~df["language"].isin(DEPRECATED_LANGUAGE_CODES)
        & df["extension"].isin(ALLOWED_FILE_EXTENSIONS)
        & df["content_type"].notna()
        & df["english_path"].isin(all_existing_paths)
    )

    return df[mask]


def map_translations(df: pd.DataFrame) -> dict:
    """Generate a nested dictionary for translations grouped by English path.

    Args:
    ----
        df (pd.DataFrame): Processed DataFrame with translations

    Returns:
    -------
        Dict: Nested dictionary of translations per English path and language

    """
    grouped = {}

    for english_path in df["english_path"].unique():
        path_df = df[df["english_path"] == english_path]
        grouped[english_path] = {}

        for lang in path_df["language"].unique():
            lang_rows = path_df[path_df["language"] == lang]
            grouped[english_path][lang] = {
                "path": lang_rows["filepath"].iloc[0],
                "commits": lang_rows.apply(
                    lambda row: {
                        "hash": row["hash"],
                        "date": row["date"],
                        "message": row["message"],
                        "author": row["author"],
                    },
                    axis=1,
                ).tolist(),
            }

    return grouped


def process_blog_data(df: pd.DataFrame) -> pd.DataFrame:
    """Process blog data, adding post_date and sorting.

    Args:
    ----
        df (pd.DataFrame): DataFrame containing blog data

    Returns:
    -------
        pd.DataFrame: Processed DataFrame with post_date and sorted

    """
    df = df.copy()
    df["post_date"] = df["english_path"].apply(extract_blog_date_from_en_path)

    return df.sort_values(by=["post_date", "english_path"], ascending=[False, True])


def process_docs_data(df: pd.DataFrame) -> dict:
    """Process docs data, grouping by sub_content_type.

    Args:
    ----
        df (pd.DataFrame): DataFrame containing docs data

    Returns:
    -------
        dict: Dictionary mapping sub_content_type to associated DataFrame

    """
    df = df.copy()
    df["sub_content_type"] = df["english_path"].apply(extract_docs_sub_content_type)

    result = {}
    for sub_type in df["sub_content_type"].unique():
        if sub_type is not None:
            result[sub_type] = df[df["sub_content_type"] == sub_type]

    return result


def process_content_by_type(df: pd.DataFrame) -> dict:
    """Process content by type, preparing for saving.

    Args:
    ----
        df (pd.DataFrame): DataFrame to process

    Returns:
    -------
        dict: Dictionary with content_type keys and value tuples
              (filepath, translations dict)

    """
    result = {}

    all_content_types = df["content_type"].unique()
    for content_type in all_content_types:
        content_type_df = df[df["content_type"] == content_type]

        match content_type:
            case "blog":
                processed_df = process_blog_data(content_type_df)
                translations = map_translations(processed_df)
                result[content_type] = [(f"{content_type}.json", translations)]
            case "docs":
                docs_by_sub_type = process_docs_data(content_type_df)
                result[content_type] = [
                    (f"{content_type}/{sub_type}.json", map_translations(sub_df))
                    for sub_type, sub_df in docs_by_sub_type.items()
                ]
            case _:
                translations = map_translations(content_type_df)
                result[content_type] = [(f"{content_type}.json", translations)]

    return result


def save_as_json(file_data: tuple, output_dir: Path) -> None:
    """Save translations to a JSON file.

    Args:
    ----
        file_data (tuple): Tuple containing (filename, data)
        output_dir (Path): Directory to save JSON file

    Returns:
    -------
        None

    """
    filename, data = file_data
    output_file = output_dir / filename

    # Create parent directories if needed (for nested paths like docs/reference.json)
    output_file.parent.mkdir(parents=True, exist_ok=True)

    output_file.write_text(
        json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"Generated {output_file} with {len(data)} entries")


def main() -> None:
    """Process and save git history data as JSON files."""
    input_file = Path("../../data/master/git_history.csv")
    all_existing_paths = get_all_existing_paths()

    git_df = pd.read_csv(input_file, encoding="utf-8")
    git_df = format_df(git_df, all_existing_paths)

    output_dir = Path("../../data/output/content_type/")
    output_dir.mkdir(parents=True, exist_ok=True)

    processed_content = process_content_by_type(git_df)
    for file_data_list in processed_content.values():
        for file_data in file_data_list:
            save_as_json(file_data, output_dir)


if __name__ == "__main__":
    main()
