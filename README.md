# Graphcore Research Blog

**https://graphcore-research.github.io/**

## Setup

This site is built using [MkDocs](https://www.mkdocs.org/) with the [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) theme & blog engine, and we recommend [uv](https://docs.astral.sh/uv) to manage the Python environment (dependencies in [pyproject.toml](pyproject.toml)).

```sh
uv sync
source .venv/bin/activate

# Start a dev server with autoreload, filtered to a specific post
# (omit folder-name to build everything, with slower reloads)
./dev.sh folder-name

# Equivalent
env ONLY=folder-name mkdocs serve --livereload --watch templates

# Build and test the full static site
mkdocs build --strict
python -m http.server -d site
```

## Guide

**Basics**, [POTM](#potm), [Links](#links), [Notebooks as posts](#notebooks-as-posts), [Our Papers](#our-papers) [Hiring Banner](#hiring-banner).

A post is a markdown `.md` file in `pages/posts` and should be placed in its own folder (follow the pattern of what's there). Every post must have **frontmatter** and **excerpt separator**. Front matter looks like this:

**Frontmatter for an article** (an individual blog post)

```yaml
---
title: "My post title, which is automatically inserted as a top-level heading"
date: YYYY-MM-DD
categories: ["Article"]         # must be in categories_allowed in mkdocs.yml
authors: [alias1, alias2, ...]  # must exist in config/authors.yml
tags: [tag1, tag2, ...]         # see <server>/tags
slug: my-post-slug              # recommended: gives a permalink of /YYYY/MM/DD/my-post-slug
---
```

The **excerpt separator** `<!-- more -->` must be included, typically after the first paragraph, although it can be placed after the leading image. This is required to generate the blog index page correctly.

### POTM

Papers-of-the-month are special, consisting of a **root** page at `pages/posts/potm/YYYY/MM/potm.md`, and multiple **child** pages at `pages/posts/potm/YYYY/MM/paper-slug/paper-slug.md`. They should have specific frontmatter:

**Frontmatter for a POTM root page**

```yaml
---
title: "Papers of the Month - Month YYYY"
date: YYYY-MM-DD
merge_potm: true
---
```

**Frontmatter for a POTM child page**

```yaml
---
paper_title: "Paper Title"
paper_authors: "FirstName SecondName, et al."
paper_orgs: "This University, University of That"
paper_link: "https://arxiv.org/abs/DDDD.DDDDD"
review_authors: [alias]
tags: [tag1, tag2, ...]
potm_order: 1
---
```

There's no need for a `<!-- more -->` excerpt separator in the child pages, as their content is automatically merged into the root. The excerpt separator is optional in the root page; if not included, the entire root page will be used as the excerpt.

### Links

To link images or javascript files _using HTML not Markdown_, e.g. for `pages/posts/2026/02-name/post_custom.js`, you should link it as `src="/2026/02-name/post_custom.js"` in the HTML.

Markdown links such as images `![Alt text](my_image.png)` are automatically updated to use the _relative path_ to the image from the markdown file, so life is easier if you use markdown not HTML.

Note that you can add attributes to markdown images by appending `{}`, e.g. `![Alt text](my_image.png){ :style="width:100%" }`.

### Notebooks as posts

You can write a post as a notebook. It will not be executed by the build process, so you should run the cells to generate output before saving. Note:

 - Frontmatter must be included as described above (inside a top markdown cell starting `---`).
 - The excerpt separator `<!-- more -->` must be included in a markdown cell near the top.
 - All markdown features should work as they do for posts (e.g. relative links to images).
 - By default **code cell content is not rendered**, only the outputs. There are two ways to render an individual cell's code: (a) use the "Add Tag" feature to add the cell tag "show_input" or (b) write `# SHOW_INPUT` on the first line (which will be stripped for display).
 - If using exotic output formats, you may need to update the hook in [hooks/notebook_to_markdown.py](hooks/notebook_to_markdown.py).

### Our Papers

To add a paper to the "Our Papers" page, add it to [pages/publications.data.yml](pages/publications.data.yml), as described in the file.

### Hiring Banner

See the config at the top of [templates/hiring_banner.js](templates/hiring_banner.js) to enable/disable/modify the hiring banner.
