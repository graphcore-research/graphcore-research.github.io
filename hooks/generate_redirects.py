"""Generate redirect HTML files based on .redirects.json, using templates/redirect.html.j2."""

import json
import shutil
import tempfile
from pathlib import Path

import jinja2
import mkdocs
import mkdocs.structure.files as mkfiles

TMP_DIR_CONFIG_KEY = "_generate_redirects_tmpdir"
TMP_DIR_PREFIX = "mkdocs_redirects_"


def on_files(files: mkfiles.Files, config: mkdocs.config.Config) -> mkfiles.Files:
    tmp_dir = Path(tempfile.mkdtemp(prefix=TMP_DIR_PREFIX))
    config[TMP_DIR_CONFIG_KEY] = str(tmp_dir)
    files = mkfiles.Files(files)

    redirects_file = Path(config["docs_dir"]) / ".redirects.json"
    if not redirects_file.exists():
        return files
    redirects = json.loads(redirects_file.read_text())
    template_path = Path(config.theme.dirs[0]) / "redirect.html.j2"
    template = jinja2.Template(template_path.read_text())

    for source, target in redirects.items():
        # Ensure target is an absolute directory-style URL
        if not target.endswith("/"):
            target = target + "/"
        if not target.startswith("/"):
            target = "/" + target
        source = Path(source) / "index.html"

        redirect_path = tmp_dir / source
        redirect_path.parent.mkdir(parents=True, exist_ok=True)
        redirect_path.write_text(template.render(target=target))
        files.append(
            mkfiles.File(
                str(source),
                src_dir=str(tmp_dir),
                dest_dir=config["site_dir"],
                use_directory_urls=False,
            )
        )

    return files


def on_post_build(config):
    """Clean up temp directory after build"""
    tmp_dir = config.get(TMP_DIR_CONFIG_KEY)
    if tmp_dir and Path(tmp_dir).exists():
        shutil.rmtree(tmp_dir)
        del config[TMP_DIR_CONFIG_KEY]
