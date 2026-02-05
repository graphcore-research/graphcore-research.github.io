"""MkDocs hook to merge paper markdown files into potm.md based on potm_order.

This hook processes Papers of the Month (POTM) directories by:
1. Finding all .md files with `merge_potm: true` in the frontmatter
2. Discovering sibling/child markdown files
3. Sorting them by potm_order
4. Formatting according to templates/potm_review.md.j2
5. Merging their content into the potm.md file
"""

import dataclasses
import logging
import re
import shutil
import tempfile
from dataclasses import dataclass
from pathlib import Path

import jinja2
import mkdocs
import mkdocs.structure.files as mkfiles
import yaml

LOGGER = logging.getLogger("mkdocs")


@dataclass
class PotmReview:
    file: mkfiles.File
    body: str
    paper_title: str
    paper_authors: str
    paper_orgs: str
    paper_link: str
    review_authors: list[str]
    tags: list[str]
    potm_order: int


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
        meta = {}
        expected_fields = [
            f.name
            for f in dataclasses.fields(PotmReview)
            if f.name not in ("file", "body")
        ]
        for field in expected_fields:
            if field not in frontmatter:
                msg = f"Error: {file.src_path} is missing '{field}' in frontmatter."
                LOGGER.error(msg)
                raise mkdocs.exceptions.Abort(msg)
            meta[field] = frontmatter.pop(field)
        if frontmatter:
            msg = (
                f"Error: {file.src_path} has unexpected frontmatter fields: {list(frontmatter.keys())}."
                f" For potm reviews, only {expected_fields} are allowed."
            )
            LOGGER.error(msg)
            raise mkdocs.exceptions.Abort(msg)
        reviews.append(PotmReview(file=file, body=body, **meta))
    reviews.sort(key=lambda x: x.potm_order)
    return reviews


_MD_LINK_RE = re.compile(r"(!?\[(?:[^\]\\]|\\.)*\]\()(\s*<?)([^)\s]+)(>?)([^)]*)\)")


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


TMP_DIR = Path(tempfile.mkdtemp(prefix="mkdocs_merge_potm_"))


def on_files(files: mkfiles.Files, config: mkdocs.config.Config) -> mkfiles.Files:
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    files = mkfiles.Files(files)

    docs_dir = Path(config["docs_dir"]).resolve()
    template_path = Path(config.theme.dirs[0]) / "potm_review.md.j2"
    template = jinja2.Template(template_path.read_text())
    for file in list(files):
        if not file.src_path.endswith(".md"):
            continue
        if Path(file.src_dir).resolve() != docs_dir:
            continue
        file_path = Path(file.abs_src_path)
        potm_content = file_path.read_text(encoding="utf-8")
        potm_body, frontmatter = mkdocs.utils.meta.get_data(potm_content)
        if frontmatter.get("merge_potm") is True:
            frontmatter.setdefault("slug", "potm")
            frontmatter.setdefault("categories", ["Papers of the Month"])

            # Find all children with the .md extension in the same directory
            reviews = find_potm_reviews(files, file.src_path)

            # Remove original potm.md and children
            files.remove(file)
            for review in reviews:
                files.remove(review.file)

            # Write merged content to temporary directory
            frontmatter.setdefault("authors", [])
            frontmatter.setdefault("tags", [])
            for review in reviews:
                review_body = rebase_links(
                    review.body,
                    from_dir=Path(review.file.src_path).parent,
                    to_dir=Path(file.src_path).parent,
                )
                potm_body += (
                    template.render(
                        **{
                            k: v
                            for k, v in review.__dict__.items()
                            if k not in ("file", "body")
                        },
                        body=review_body,
                    )
                    + "\n\n"
                )
                for author in review.review_authors:
                    if author not in frontmatter["authors"]:
                        frontmatter["authors"].append(author)
                for tag in review.tags:
                    if tag not in frontmatter["tags"]:
                        frontmatter["tags"].append(tag)

            output_path = TMP_DIR / file.src_path
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_text(f"---\n{yaml.dump(frontmatter)}\n---\n{potm_body}")
            files.append(
                mkfiles.File(
                    file.src_path,
                    src_dir=str(TMP_DIR),
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
    if TMP_DIR.exists():
        shutil.rmtree(TMP_DIR)
