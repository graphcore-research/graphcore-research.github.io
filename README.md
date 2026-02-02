# Graphcore Research Blog

**https://graphcore-research.github.io/**

## Development

```sh
uv sync --extra dev
source .venv/bin/activate

# start dev server with autoreload
mkdocs serve --livereload --watch templates

# build static site
mkdocs build
```

## Help

Note that if you wish to link images or javascript files using HTML, e.g. if `post_custom.js` is located next to the post `pages/posts/2026/02-name/post.md`, you should refer it as `src="/2026/02-name/post_custom.js"` in the HTML.

Prefer using markdown syntax where possible (note that you can add attributes by appending `{}`, e.g. `{ style="width:100%" }`), in which case plain relative links will work.
