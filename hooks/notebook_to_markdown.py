"""MkDocs hooks to convert `.ipynb` => `.md`."""

import os
import shutil
import tempfile
from pathlib import Path

import mkdocs
import mkdocs.structure.files as mkfiles
import nbconvert
import nbconvert.preprocessors


class RemoveCodeInputUnlessTagged(nbconvert.preprocessors.Preprocessor):
    """Remove code input unless marked with SHOW_INPUT or show_input tag."""

    def preprocess_cell(self, cell, resources, index):
        if cell.cell_type == "code":
            tags = cell.metadata.setdefault("tags", [])
            lines = cell.source.split("\n")
            if lines and lines[0].endswith("SHOW_INPUT"):
                cell.source = "\n".join(lines[1:])
            elif "show_input" in tags:
                pass
            else:
                tags.append("remove_input")
        return cell, resources


def notebook_to_markdown(
    notebook: Path, output_dir: Path, template_dir: Path
) -> list[Path]:
    """Convert a notebook to markdown & output files."""
    output_dir.mkdir(parents=True, exist_ok=True)

    # Convert notebook to markdown
    exporter = nbconvert.MarkdownExporter(
        template_name="custom_notebook",
        extra_template_basedirs=[str(template_dir.resolve())],
    )
    exporter.register_preprocessor(RemoveCodeInputUnlessTagged, enabled=True)
    exporter.register_preprocessor(
        nbconvert.preprocessors.TagRemovePreprocessor(
            remove_input_tags=["remove_input"]
        ),
        enabled=True,
    )
    markdown_text, resources = exporter.from_filename(notebook)

    # Write markdown file
    markdown_path = output_dir / notebook.with_suffix(".md").name
    markdown_path.write_text(markdown_text, encoding="utf-8")
    outputs = [markdown_path]

    # Write resources (images, etc.)
    for name, data in resources.get("outputs", {}).items():
        path = output_dir / name
        if isinstance(data, bytes):
            path.write_bytes(data)
        else:
            path.write_text(data, encoding="utf-8")
        outputs.append(path)

    return outputs


TMP_DIR_CONFIG_KEY = "_notebook_to_markdown_tmpdir"
TMP_DIR_PREFIX = "mkdocs_notebook_to_markdown_"


def on_files(files: mkfiles.Files, config: mkdocs.config.Config) -> mkfiles.Files:
    tmp_dir = Path(tempfile.mkdtemp(prefix=TMP_DIR_PREFIX))
    config[TMP_DIR_CONFIG_KEY] = str(tmp_dir)
    files = mkfiles.Files(files)

    for file in list(files):
        if not file.src_path.endswith(".ipynb"):
            continue

        outputs = notebook_to_markdown(
            Path(file.src_dir) / file.src_path,
            Path(tmp_dir) / Path(file.src_path).parent,
            Path(config.theme.dirs[0]),  # Configured as: "theme.custom_dir"
        )
        files.remove(file)
        for output in outputs:
            files.append(
                mkfiles.File(
                    str(output.relative_to(tmp_dir)),
                    src_dir=tmp_dir,
                    dest_dir=file.dest_dir,
                    use_directory_urls=file.use_directory_urls,
                )
            )
    return files


def on_post_build(config: mkdocs.config.Config) -> None:
    tmp_dir = config.get(TMP_DIR_CONFIG_KEY)
    if tmp_dir and os.path.exists(tmp_dir):
        shutil.rmtree(tmp_dir)
        del config[TMP_DIR_CONFIG_KEY]
