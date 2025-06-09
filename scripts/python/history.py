from collections import defaultdict
from typing import NotRequired, TypedDict

from models import GitCommitDict, OperationType


class GitFileRevision(TypedDict):
    """A TypedDict representing a single Git file revision record."""

    hash: str
    date: str
    author: str
    message: str
    path: str
    insertions: int
    deletions: int
    operation: OperationType
    old_path: NotRequired[str]


class GitFileHistoryTracker:
    """A class to track the history of a file in a Git repository.

    It builds a history of file changes from a list of Git commits and allows
    retrieval of file history, rename history, and statistics for a specific file.

    """

    def __init__(
        self,
        commits: list[GitCommitDict],
        current_files: set[str],
    ) -> None:
        """Initialize the GitFileHistoryTracker and build history from commits.

        Args:
        ----
            commits: List of Git commit dictionaries to build history from.
            current_files: Set of file paths that currently exist in the repository.
                          Used to determine deletion operations.

        """
        self.file_changes: dict[str, list[GitFileRevision]] = defaultdict(list)
        self.renamed_from: dict[str, str] = {}  # current_path -> old_path
        self.current_files = current_files
        self._build_from_commits(commits)

    def _build_from_commits(self, commits: list[GitCommitDict]) -> None:  # noqa: C901, PLR0912
        """Build the file history tracker from a list of Git commits.

        Args:
        ----
            commits (list[GitCommitDict]): A list of Git commit dictionaries.

        """
        # Pass 1: リネーム関係構築
        for commit in commits:
            for file_change in commit.get("files", []):
                if "old_path" in file_change:
                    self.renamed_from[file_change["path"]] = file_change["old_path"]

        # Pass 2: operation判定 + 履歴構築
        for commit in commits:
            for file_change in commit.get("files", []):
                path = file_change["path"]
                old_path = file_change.get("old_path")
                file_revision = {
                    "hash": commit["hash"],
                    "date": commit["date"],
                    "author": commit["author"],
                    "message": commit["message"],
                    "path": path,
                    "insertions": file_change["insertions"],
                    "deletions": file_change["deletions"],
                    "operation": "renamed" if old_path else "modified",
                }

                if old_path:
                    file_revision["old_path"] = old_path

                self.file_changes[path].append(file_revision)

        # Pass 3: 各ファイルの最古のコミットをaddedに変更
        for entries in self.file_changes.values():
            if entries:
                oldest_entry = min(entries, key=lambda x: x["date"])
                if oldest_entry["operation"] == "modified":
                    oldest_entry["operation"] = "added"

        # 削除判定 - current_filesに存在しないファイルは削除されたとみなす
        for path in self.file_changes:
            if path not in self.current_files:
                for entry in self.file_changes[path]:
                    if entry["operation"] == "modified":
                        entry["operation"] = "deleted"

    def get_history(self, path: str) -> list[GitFileRevision]:
        """Get the history of a specific file by its path.

        Args:
        ----
            path (str): The path of the file to retrieve history for.

        Returns:
        -------
            list[GitFileRevision]: A list of GitFileRevision for the specified file.

        """
        history = []
        current = path

        while current:
            if current in self.file_changes:
                history.extend(self.file_changes[current])
            current = self.renamed_from.get(current, "")

        history.sort(key=lambda x: x["date"], reverse=True)

        return history

    def get_rename_history(self, path: str) -> list[str]:
        """Get the rename history for a file (newest to oldest).

        Args:
        ----
            path (str): The current path of the file.

        Returns:
        -------
            List of paths from newest to oldest

        """
        history = [path]
        current = path

        while current in self.renamed_from:
            current = self.renamed_from[current]
            history.append(current)

        return history

    def get_file_stats(self, path: str) -> dict[str, int]:
        """Get statistics for a file across its entire history.

        Args:
        ----
            path (str): The path of the file to retrieve statistics for.

        Returns:
        -------
            dict[str, int]: A dictionary containing statistics about the file,
                            including total commits, insertions, deletions,
                            changes, and rename count.

        """
        history = self.get_history(path)

        if not history:
            return {}

        return {
            "total_commits": len(history),
            "total_insertions": sum(revision["insertions"] for revision in history),
            "total_deletions": sum(revision["deletions"] for revision in history),
            "total_changes": sum(
                revision["insertions"] + revision["deletions"] for revision in history
            ),
            "rename_count": len(self.get_rename_history(path)) - 1,
        }

    def get_latest_commit(self, path: str) -> GitFileRevision | None:
        """Get the latest commit for a specific file.

        Args:
        ----
            path (str): The path of the file to retrieve the latest commit for.

        Returns:
        -------
            GitFileRevision | None: The latest commit information for the file,
                               or None if no history exists.

        """
        history = self.get_history(path)

        return history[0] if history else None

    def get_oldest_commit(self, path: str) -> GitFileRevision | None:
        """Get the oldest commit for a specific file.

        Args:
        ----
            path (str): The path of the file to retrieve the oldest commit for.

        Returns:
        -------
            GitFileRevision | None: The oldest commit information for the file,
                               or None if no history exists.

        """
        history = self.get_history(path)

        return history[-1] if history else None

    @property
    def all_paths(self) -> set[str]:
        """Get all file paths in the history.

        Returns
        -------
            set[str]: A set of all file paths tracked in the history.

        """
        return set(self.file_changes.keys())
