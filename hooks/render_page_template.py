"""MkDocs hooks to render .md.j2 templates with adjacent .data.yml context.

The content of the {name}.data.yml file is available as `data` to the Jinja2 template.

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
        data = {}
        # Load implicit data file if it exists
        data_path = template_path.parent / (
            template_path.name.split(".")[0] + ".data.yml"
        )
        if data_path.exists():
            data.update(yaml.safe_load(data_path.read_text()))

        # Load extra data files specified in frontmatter
        _, frontmatter = mkdocs.utils.meta.get_data(template_path.read_text())
        extra_data_files = frontmatter.get("extra_data", [])
        for extra_file in extra_data_files:
            if extra_file.startswith("/"):
                extra_path = docs_dir / extra_file.lstrip("/")
            else:
                extra_path = template_path.parent / extra_file

            if extra_path.exists():
                data.update(yaml.safe_load(extra_path.read_text()))
            else:
                LOGGER.warning(
                    f"File extra_data = {extra_file} specified in {template_path} was not found."
                )

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
