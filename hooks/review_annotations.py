"""Annotate rendered page HTML with stable-ish review anchors."""

from __future__ import annotations

from bs4 import BeautifulSoup, Tag


REVIEWABLE_TAGS = {
    "p",
    "li",
    "blockquote",
    "pre",
    "figure",
    "table",
    "details",
    "summary",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
}

REVIEWABLE_SELECTORS = (
    "div.arithmatex",
    "div.katex-display",
    "mjx-container[display='true']",
    "img",
)
def _review_key(element: Tag, index: int) -> str:
    existing_id = element.get("id")
    if isinstance(existing_id, str) and existing_id:
        return existing_id
    return f"{element.name}-{index:03d}"


def on_page_content(html: str, page, config, files) -> str:
    soup = BeautifulSoup(html, "html.parser")

    wrapper = soup.new_tag("div")
    wrapper["class"] = "review-annotated-content"
    wrapper["data-review-page-src"] = page.file.src_path
    wrapper["data-review-page-url"] = page.url
    wrapper["data-review-page-title"] = page.title

    children = list(soup.contents)
    for child in children:
        wrapper.append(child.extract())
    soup.append(wrapper)

    review_index = 1
    def mark_review_anchor(element: Tag, review_index: int) -> int:
        if element.find_parent(class_="review-anchor") is not None:
            return review_index
        text = element.get_text(" ", strip=True)
        alt_text = element.get("alt", "") if element.name == "img" else ""
        if not text and not alt_text:
            return review_index
        element["class"] = [*element.get("class", []), "review-anchor"]
        element["data-review-anchor"] = _review_key(element, review_index)
        element["data-review-index"] = str(review_index)
        return review_index + 1

    for element in wrapper.find_all(list(REVIEWABLE_TAGS)):
        if not isinstance(element, Tag):
            continue
        review_index = mark_review_anchor(element, review_index)

    for selector in REVIEWABLE_SELECTORS:
        for element in wrapper.select(selector):
            if not isinstance(element, Tag):
                continue
            review_index = mark_review_anchor(element, review_index)

    return str(soup)
