# Graphcore Research Blog

**https://graphcore-research.github.io/**

## Setup

This site is built using [MkDocs](https://www.mkdocs.org/) with the [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) theme & blog engine, and we recommend [uv](https://docs.astral.sh/uv) to manage the Python environment (or use another tool to install dependencies from `pyproject.toml`).

```sh
uv sync
source .venv/bin/activate

# Start a dev server with autoreload, filtered to a specific post
# - omit folder-name to build everything, with slower reloads
# - it's sugar for $ env ONLY=folder-name mkdocs serve --livereload --watch assets
./dev.sh folder-name

# Build and test the full static site (optional)
# - preview with $ python -m http.server -d site
mkdocs build --strict
```

### Your first post

Create a markdown file: `pages/posts/YYYY/MM-my-blog-post/post.md`, and copy the following content:

```md
---
title: "Post Title"
date: YYYY-MM-DD
categories: [Articles]
authors: [myalias]
tags: [example]
slug: my-blog-post
---

This is my first post! Intro paragraph (included in excerpt).

<!-- more -->

More content here!
```

_Note that the "identity" of the post is the tuple `(date, slug)` from the YAML "frontmatter" - this determines the URL. File paths are free-form, but we use the pattern described above to keep things tidy._

Check your alias is in `pages/.authors.yml`.

Now build (just your page, for speed):

```sh
./dev.sh MM-my-blog-post
```

You should be able to open http://localhost:8000/, and your post should be at http://localhost:8000/YYYY-MM-DD-my-blog-post/. If you edit your markdown file, the page should automatically reload with your changes.

That's it & you're all set! You can probably get where you need to yourself from here, but see the [guide](#guide) below for some tips, gotchas and how to write a post as a notebook.


## Guide

**Basics**, [POTM](#potm), [Links](#links), [Notebooks as posts](#notebooks-as-posts), [Our Papers](#our-papers) [Hiring Banner](#hiring-banner).

A post is a markdown `.md` file in `pages/posts` and should be placed in its own folder (follow the pattern of what's there). Every post must have **frontmatter** and **excerpt separator**. Front matter looks like this:

**Frontmatter for an article** (an individual blog post)

```yaml
---
title: "My post title, which is automatically inserted as a top-level heading"
date: YYYY-MM-DD
categories: [Articles]          # must be in categories_allowed in mkdocs.yml
authors: [alias1, alias2, ...]  # must exist in config/authors.yml
tags: [tag1, tag2, ...]         # see <server>/tags
slug: my-post-slug              # recommended: gives a permalink of /YYYY-MM-DD-my-post-slug
---
```

The **excerpt separator** `<!-- more -->` must be included, typically after the first paragraph, although it can be placed after the leading image. This is required to generate the blog index correctly.

**Images** should be placed in the same folder as the markdown file, and linked using markdown syntax, e.g. `![Alt text](my_image.png)`. By default, images are scaled to min(original size, text width), but this can look too large for high-res square images. In this case, use the classes `.img-tiny`, `.img-small`, `.img-medium` or `.img-large` to limit the maximum size, e.g. `![Alt text](my_image.png){:.img-small}`.

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

There's no need for a `<!-- more -->` excerpt separator, as this will be appended to the root page automatically (although it may be added if the excerpt would otherwise be too long).

### Links

To link images or javascript files _using HTML not Markdown_, e.g. for `pages/posts/2026/02-name/post_custom.js`, you should link it as `src="/2026/02-name/post_custom.js"` in the HTML.

Markdown links such as images `![Alt text](my_image.png)` are automatically updated to use the _relative path_ to the image from the markdown file, so life is easier if you use markdown not HTML.

Note that you can add attributes to markdown images using [attribute lists](https://python-markdown.github.io/extensions/attr_list/), appending `{:}`, e.g. `![Alt text](my_image.png){:.img-small style="padding: 10px;"}`.

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

See the config at the top of [assets/hiring_banner.js](assets/hiring_banner.js) to enable/disable/modify the hiring banner.

## Development

MkDocs is a static site generator, which transforms and maps the markdown files, images, templates, css, js to a single folder containing the site. MkDocs is designed as a documentation generation system, but Material for MkDocs adds a blog system, and many convenient plugins that extend the core functionality. We configure and customise it using the `mkdocs.yml` file and add custom hooks in the `hooks/` folder (hooks are a simpler form of plugin).

File/folder structure:

```
├── pyproject.toml              # Dependencies only
├── mkdocs.yml                  # Main configuration file
├── assets/                     # Static assets for direct-copy (e.g. images, js) and templates
    ├── papers/                 # Non-arXiv paper hosting
├── hooks/                      # Our custom hooks for notebooks, POTM, etc.
├── pages/                      # Main content: posts, POTM.
    ├── posts/                  # Blog posts
    ├── posts/potm/             # Papers of the month, with special handling ([hooks/merge_potm.py](hooks/merge_potm.py)) to merge children into root
    ├── .authors.yml            # Author information, required for every author alias
    ├── .redirects.json         # Generate redirects to keep old links working (by [hooks/generate_redirects.py](hooks/generate_redirects.py))
    ├── publications.md.j2      # "Our Papers" page template, rendered by [hooks/render_page_templates.py](hooks/render_page_templates.py)
    ├── publications.data.yml   # "Our Papers" data
    ├── *.md                    # Other standalone pages
├── site/                       # Generated static site (after `mkdocs build`)
```
