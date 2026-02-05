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

**Basics**, [POTM](#potm), [Links](#links), [Hiring Banner](#hiring-banner).

A post is a markdown `.md` file & should be placed in its own folder (follow the pattern of what's there). Every post must have **frontmatter** and **excerpt separator**. Front matter looks like this:

**Frontmatter for an article** (an individual blog post)

```yaml
---
title: "My post title, which is automatically inserted as a top-level heading"
date: YYYY-MM-DD
categories: ["Article"]         # must be in categories_allowed in mkdocs.yml
authors: [alias1, alias2, ...]  # must exist in config/authors.yml
tags: [tag1, tag2, ...]         # see <server>/tags
slug: my-post-slug              # recommended: gives a permalink of <server>/YYYY/MM/DD/my-post-slug
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

Note that child pages don't require an excerpt separator.

### Links

Note that if you wish to link images or javascript files using HTML, e.g. for `pages/posts/2026/02-name/post_custom.js`, you should link it as `src="/2026/02-name/post_custom.js"` in the HTML.

Markdown links such as images `![Alt text](my_image.png)` are automatically updated to use the correct relative path to the markdown file, so these should be preferred.

Note that you can add attributes to markdown images by appending `{}`, e.g. `![Alt text](my_image.png){ style="width:100%" }`.

### Hiring Banner

Edit the config at the top of [templates/hiring_banner.js](templates/hiring_banner.js) to enable/disable/modify the hiring banner.
