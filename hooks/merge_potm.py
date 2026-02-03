"""MkDocs hook to merge paper markdown files into potm.md based on potm_order.

This hook processes Papers of the Month (POTM) directories by:
1. Finding all .md files with `merge_potm: true` in the frontmatter
2. Discovering sibling/child markdown files; they must have `potm_order` in frontmatter
3. Sorting them by potm_order
4. Merging their content into the potm.md file
"""

import logging
import re
import shutil
import tempfile
from dataclasses import dataclass
from pathlib import Path

import mkdocs
import mkdocs.structure.files as mkfiles


LOGGER = logging.getLogger("mkdocs")


@dataclass
class PotmReview:
    file: mkfiles.File
    potm_order: int
    body: str


def find_potm_reviews(files: mkfiles.Files, root_path: str) -> list[PotmReview]:
    """Find all markdown files in the given directory, expecting them to have 'potm_order' in the frontmatter."""
    reviews = []
    root_folder = str(Path(root_path).parent)
    for file in files:
        if not file.src_path.endswith(".md"):
            continue
        if file.src_path == root_path:
            continue
        if not file.src_path.startswith(root_folder):
            continue
        content = Path(file.abs_src_path).read_text(encoding="utf-8")
        body, frontmatter = mkdocs.utils.meta.get_data(content)
        potm_order = frontmatter.pop("potm_order")
        if potm_order is None:
            msg = f"Error: {file.src_path} is missing 'potm_order' in frontmatter."
            LOGGER.error(msg)
            raise mkdocs.exceptions.Abort(msg)
        if frontmatter:
            msg = (
                f"Error: {file.src_path} has unexpected frontmatter fields: {list(frontmatter.keys())}."
                " For potm reviews, only 'potm_order' is allowed."
            )
            LOGGER.error(msg)
            raise mkdocs.exceptions.Abort(msg)
        reviews.append(PotmReview(file=file, potm_order=potm_order, body=body))
    reviews.sort(key=lambda x: x.potm_order)
    return reviews


_MD_LINK_RE = re.compile(r"(!?\[[^\]]*\]\()(\s*<?)([^)\s]+)(>?)([^)]*)\)")


def _should_rewrite_link(dest: str) -> bool:
    if not dest:
        return False
    if dest.startswith("#"):  # Anchor link
        return False
    if dest.startswith("/"):  # Absolute path
        return False
    if re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", dest):  # URL scheme
        return False
    return True


def rebase_links(body: str, from_dir: Path, to_dir: Path) -> str:
    def _replace(match: re.Match) -> str:
        prefix, open_angle, dest, close_angle, tail = match.groups()
        if not _should_rewrite_link(dest):
            return match.group(0)

        # Handle suffixes like ?query= or #anchor
        split_idx = len(dest)
        for sep in ("?", "#"):
            idx = dest.find(sep)
            if idx != -1:
                split_idx = min(split_idx, idx)
        dest_path = dest[:split_idx]
        dest_suffix = dest[split_idx:]
        if not _should_rewrite_link(dest_path):
            return match.group(0)

        dest_path = Path(from_dir / dest_path).relative_to(to_dir)
        dest = f"{dest_path}{dest_suffix}"
        return f"{prefix}{open_angle}{dest}{close_angle}{tail})"

    return _MD_LINK_RE.sub(_replace, body)


TMP_DIR_CONFIG_KEY = "_merge_potm_tmpdir"
TMP_DIR_PREFIX = "mkdocs_merge_potm_"


def on_files(files: mkfiles.Files, config: mkdocs.config.Config) -> mkfiles.Files:
    """Process all potm.md files and merge their associated papers."""
    tmp_dir = Path(tempfile.mkdtemp(prefix=TMP_DIR_PREFIX))
    config[TMP_DIR_CONFIG_KEY] = str(tmp_dir)
    files = mkfiles.Files(files)

    docs_dir = Path(config["docs_dir"]).resolve()
    for file in list(files):
        if not file.src_path.endswith(".md"):
            continue
        if Path(file.src_dir).resolve() != docs_dir:
            continue
        file_path = Path(file.abs_src_path)
        potm_content = file_path.read_text(encoding="utf-8")
        _, frontmatter = mkdocs.utils.meta.get_data(potm_content)
        if frontmatter.get("merge_potm") is True:
            # Find all children with the .md extension in the same directory
            reviews = find_potm_reviews(files, file.src_path)

            # Remove original potm.md and children
            files.remove(file)
            for review in reviews:
                files.remove(review.file)

            # Write merged content to temporary directory
            for review in reviews:
                potm_content += "\n\n" + rebase_links(
                    review.body,
                    from_dir=Path(review.file.src_path).parent,
                    to_dir=Path(file.src_path).parent,
                )
            output_path = tmp_dir / file.src_path
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_text(potm_content, encoding="utf-8")
            files.append(
                mkfiles.File(
                    file.src_path,
                    src_dir=str(tmp_dir),
                    dest_dir=file.dest_dir,
                    use_directory_urls=file.use_directory_urls,
                )
            )

    # Warn on any unmerged potm files
    for file in list(files):
        if (
            Path(file.src_dir).resolve() == docs_dir
            and file.src_path.endswith(".md")
            and "potm" in Path(file.src_path).parts
        ):
            LOGGER.warning(
                f"Warning: {file.src_path} was not merged. "
                "Ensure there's a potm.md in the parent tree, with 'merge_potm: true' in its frontmatter."
            )

    return files


def on_post_build(config: mkdocs.config.Config) -> None:
    """Clean up temporary directory."""
    tmp_dir = config.get(TMP_DIR_CONFIG_KEY)
    if tmp_dir and Path(tmp_dir).exists():
        shutil.rmtree(tmp_dir)
        del config[TMP_DIR_CONFIG_KEY]
