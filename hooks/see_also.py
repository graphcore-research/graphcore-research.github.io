"""MkDocs hook to inject a list of "see also" links into the page `links`.

Collect recent pages (posts) which have a `date` in front-matter, sort newest-first,
and inject into other pages with a `date` in front-matter as `links`.
"""

import datetime
from dataclasses import dataclass

from mkdocs.config import Config
from mkdocs.structure.files import Files
from mkdocs.structure.nav import Link, Navigation
from mkdocs.structure.pages import Page
from mkdocs.utils.templates import TemplateContext


N_RECENT = 3


@dataclass
class Post:
    title: str
    url: str
    date: datetime.datetime


_POSTS_LIST: list[Post] = []


def on_pre_build(config: Config) -> None:
    _POSTS_LIST.clear()


def on_page_content(html: str, page: Page, config: Config, files: Files) -> str | None:
    if "date" in page.meta:
        _POSTS_LIST.append(Post(title=page.title, url=page.url, date=page.meta["date"]))


def on_page_context(
    context: TemplateContext, page: Page, config: Config, nav: Navigation
) -> TemplateContext:
    if "date" in page.meta:
        links = context["page"].config.links
        if links is None:
            links = context["page"].config.links = Navigation([], [])

        for post in sorted(_POSTS_LIST, key=lambda p: p.date, reverse=True):
            if len(links.items) >= N_RECENT:
                break
            if post.url != page.url:
                links.items.append(Link(title=post.title, url=post.url))
    return context
