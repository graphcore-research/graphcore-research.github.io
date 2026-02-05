"""MkDocs hook to filter posts by the ONLY environment variable.

When the environment variable `ONLY` is set, only files under the `posts/`
tree whose path contains that string are kept. All other files under
`posts/` are removed from the build. When `ONLY` is not set the hook does
nothing.
"""

import logging
import os
from pathlib import Path

import mkdocs
import mkdocs.structure.files as mkfiles

LOGGER = logging.getLogger("mkdocs")


def on_files(files: mkfiles.Files, config: mkdocs.config.Config) -> mkfiles.Files:
    only = os.environ.get("ONLY")
    if not only:
        return files

    files = mkfiles.Files(files)
    matched_posts = False
    for file in list(files):
        if file.src_dir != config["docs_dir"] or not file.src_path.startswith("posts/"):
            pass  # not applicable
        elif only in file.src_path:
            matched_posts = True  # a match
        else:
            files.remove(file)  # filtered out

    if not matched_posts:
        LOGGER.warning(
            f"ONLY={only} didn't match any folders in {config['docs_dir']}/posts/"
            " - no posts will be built."
        )

    return files
