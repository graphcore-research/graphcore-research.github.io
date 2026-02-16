"""MkDocs hooks to render .md.j2 templates, which can import data using `data: path.yml`.

Only render templates from the docs_dir.
"""

import logging
import shutil
import tempfile
from pathlib import Path

import jinja2
import mkdocs
import mkdocs.structure.files as mkfiles
import yaml

LOGGER = logging.getLogger("mkdocs")
TMP_DIR = Path(tempfile.mkdtemp(prefix="mkdocs_render_page_templates_"))


def on_files(files: mkfiles.Files, config: mkdocs.config.Config) -> mkfiles.Files:
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    files = mkfiles.Files(files)

    docs_dir = Path(config["docs_dir"]).resolve()
    env = jinja2.Environment(
        loader=jinja2.FileSystemLoader(str(docs_dir)), autoescape=False
    )
    for file in list(files):
        if not file.src_path.endswith(".md.j2"):
            continue
        if Path(file.src_dir).resolve() != docs_dir:
            continue

        template_path = Path(file.abs_src_path)
        _, frontmatter = mkdocs.utils.meta.get_data(template_path.read_text())
        data_files = frontmatter.get("data")
        if data_files is None:
            data_files = []
        if isinstance(data_files, str):
            data_files = [data_files]

        data = {}
        for data_file in data_files:
            if data_file.startswith("/"):
                data_path = docs_dir / data_file.lstrip("/")
            else:
                data_path = template_path.parent / data_file
            if not data_path.exists():
                LOGGER.warning(
                    f"File `data: {data_file}` specified in {template_path} was not found."
                )
                continue
            data.update(yaml.safe_load(data_path.read_text()))

        rendered = env.get_template(file.src_path).render(data=data)

        output_rel_path = file.src_path.replace(".md.j2", ".md")
        output_path = TMP_DIR / output_rel_path
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(rendered)
        files.remove(file)
        files.append(
            mkfiles.File(
                output_rel_path,
                src_dir=str(TMP_DIR),
                dest_dir=file.dest_dir,
                use_directory_urls=file.use_directory_urls,
            )
        )

    return files


def on_post_build(config: mkdocs.config.Config) -> None:
    if TMP_DIR.exists():
        shutil.rmtree(TMP_DIR)
