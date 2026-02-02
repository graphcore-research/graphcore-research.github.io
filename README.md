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

## Howto

Every post must have a few things. First, at the top of the file, the front matter:

```yaml
---
date: YYYY-MM-DD
categories: ["Article"] or ["Papers of the Month"]
tags:
    - tag1
---
```

Second, every post must include an excerpt separator `<!-- more -->`, after the first paragraph. This is required to generate the blog index page correctly.

### Linking images/other assets using HTML

Note that if you wish to link images or javascript files using HTML, e.g. if `post_custom.js` is located next to the post `pages/posts/2026/02-name/post.md`, you should refer it as `src="/2026/02-name/post_custom.js"` in the HTML.

Prefer using markdown syntax where possible (note that you can add attributes by appending `{}`, e.g. `{ style="width:100%" }`), in which case plain relative links will work.
