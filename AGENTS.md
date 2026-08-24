# Research blog agent instructions

- Run uv commands with `UV_CACHE_DIR=.cache/uv uv ...`

## Dependency updates

Render `mkdocs build --strict` to separate temporary directories before and
after `uv lock --upgrade`, then compare the outputs and report substantive
changes. Also report package version updates.
