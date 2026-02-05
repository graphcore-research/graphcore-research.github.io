"""MkDocs hooks to render .md.j2 templates with adjacent .data.yml context.

The content of the {name}.data.yml file is available as `data` to the Jinja2 template.

Only render templates from the docs_dir.
"""

import shutil
import tempfile
from pathlib import Path

import jinja2
import mkdocs
import mkdocs.structure.files as mkfiles
import yaml


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
        data_path = template_path.parent / (
            template_path.name.split(".")[0] + ".data.yml"
        )
        if data_path.exists():
            data = yaml.safe_load(data_path.read_text(encoding="utf-8"))
        rendered = env.get_template(file.src_path).render(data=data)

        output_rel_path = file.src_path.replace(".md.j2", ".md")
        output_path = TMP_DIR / output_rel_path
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(rendered, encoding="utf-8")
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
