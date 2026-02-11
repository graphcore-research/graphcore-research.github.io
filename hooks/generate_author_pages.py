"""Generate author page headers (an article feed is auto-appended by Material)."""

import logging
import shutil
import tempfile
from pathlib import Path

import jinja2
import mkdocs
import mkdocs.structure.files as mkfiles
import yaml

LOGGER = logging.getLogger("mkdocs.hooks.generate_authors")
TMP_DIR = Path(tempfile.mkdtemp(prefix="mkdocs_gen_authors_"))


def on_files(files: mkfiles.Files, config: mkdocs.config.Config) -> mkfiles.Files:
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    docs_dir = Path(config["docs_dir"])
    (TMP_DIR / "author").mkdir(parents=True, exist_ok=True)

    authors = yaml.safe_load((docs_dir / ".authors.yml").read_text())["authors"]
    env = jinja2.Environment(
        loader=jinja2.FileSystemLoader(config.theme.dirs[0]), autoescape=False
    )
    template = env.get_template("author.md.j2")

    for author_id, author_info in authors.items():
        content = template.render(author=dict(id=author_id, **author_info))
        file_name = f"author/{author_id}.md"
        (TMP_DIR / file_name).write_text(content, encoding="utf-8")
        files.append(
            mkfiles.File(
                path=file_name,
                src_dir=str(TMP_DIR),
                dest_dir=config["site_dir"],
                use_directory_urls=config["use_directory_urls"],
            )
        )

    return files


def on_post_build(config: mkdocs.config.Config) -> None:
    """Clean up temp directory after build"""
    if TMP_DIR.exists():
        shutil.rmtree(TMP_DIR)
