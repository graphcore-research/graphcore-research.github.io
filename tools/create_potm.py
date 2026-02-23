"""Create POTM scaffolding files.

Usage:

    python tools/create_potm.py --month 2026-02

        .. to create the root page for February 2026.

    python tools/create_potm.py --paper muon

        .. to create an empty paper review in the most recent POTM month.
"""

import argparse
import datetime as dt
import logging
import re
from pathlib import Path

ROOT_TEMPLATE = """
---
date: {date}
title: '{month_name} Papers: TODO Title'
merge_potm: true
---

... POTM intro paragraph / meta-review of this month's papers.
"""

REVIEW_TEMPLATE = """
---
paper_title: "<Full Paper Title>"
paper_authors: "<Forename Surname, et al.' or 'Forename Surname, Forename Surname and Forename Surname.' (max 3 unless more than 3 first authors)>"
paper_orgs: "<name of org>"
paper_link: "https://arxiv.org/abs/<paper_id>"
tags:  # see https://graphcore-research.github.io/tags/
- efficient-inference
potm_order: 1  # editor to decide
review_authors: []  # "<alias>"
---

200 words is a rough guide for the length of a summary. Feel free to go a fair bit over or under if needs be. See [README](/README.md) for a guide to formatting & previewing.

### The key idea

... a few sentences outlining why the paper is interesting

### [optional] Background

... if necessary, a short intro to background matierial needed to understand the method

### Their method

...

### Results

...

### [optional] Takeaways

...
"""

ROOT = Path(__file__).resolve().parents[1]
POTM_DIR = ROOT / "pages" / "posts" / "potm"
LOGGER = logging.getLogger(__name__)


def parse_month(month: str) -> tuple[int, int]:
    m = re.fullmatch(r"(\d{4})-(\d{2})", month)
    if not m:
        raise ValueError(f"Invalid --month '{month}', expected YYYY-MM")
    year = int(m.group(1))
    mon = int(m.group(2))
    if not 1 <= mon <= 12:
        raise ValueError(f"Invalid month in --month '{month}'")
    return year, mon


def find_latest_potm_month() -> tuple[int, int] | None:
    latest: tuple[int, int] | None = None
    if POTM_DIR.exists():
        for year_dir in POTM_DIR.iterdir():
            if not year_dir.is_dir() or not year_dir.name.isdigit():
                continue
            year_val = int(year_dir.name)
            for month_dir in year_dir.iterdir():
                if not month_dir.is_dir() or not re.fullmatch(r"\d{2}", month_dir.name):
                    continue
                month_val = int(month_dir.name)
                if not 1 <= month_val <= 12:
                    continue
                value = (year_val, month_val)
                if latest is None or value > latest:
                    latest = value
    return latest


def create_root(month_dir: Path, year: int, month: int) -> None:
    potm_root = month_dir / "potm.md"
    if potm_root.exists():
        LOGGER.warning(f"Already exists: {potm_root.relative_to(ROOT)}")
        return

    potm_root.parent.mkdir(parents=True, exist_ok=True)
    potm_root.write_text(
        ROOT_TEMPLATE.strip().format(
            date=dt.date.today().isoformat(),
            month_name=dt.date(year, month, 1).strftime("%B"),
        )
        + "\n",
        encoding="utf-8",
    )
    LOGGER.info(f"Created: {potm_root.relative_to(ROOT)}")


def create_paper_review(month_dir: Path, paper_slug: str) -> None:
    out_path = month_dir / paper_slug / f"{paper_slug}.md"
    if out_path.exists():
        LOGGER.warning(f"Already exists: {out_path.relative_to(ROOT)}")
        return

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(REVIEW_TEMPLATE.strip() + "\n", encoding="utf-8")
    LOGGER.info(f"Created: {out_path.relative_to(ROOT)}")


def main() -> int:
    logging.basicConfig(format="%(name)s:%(levelname)s: %(message)s")
    LOGGER.setLevel(logging.INFO)
    parser = argparse.ArgumentParser(description="Create POTM scaffolding pages")
    parser.add_argument(
        "--month",
        type=parse_month,
        help="YYYY-MM format specifying the month (default for `--paper` is the most recent month).",
    )
    parser.add_argument(
        "--paper",
        type=str,
        help="Paper short name (e.g. 'muon') to scaffold a POTM child page.",
    )
    parser.usage = """%(prog)s --month YYYY-MM                        (to create a new root page)
       %(prog)s --paper paper-slug [--month YYYY-MM]   (to create a paper review in most recent [or specified] month)
"""
    args = parser.parse_args()

    if not (args.month or args.paper):
        parser.error("Must specify --month and/or --paper")

    year, month = args.month or find_latest_potm_month()
    potm_dir = POTM_DIR / f"{year:04d}" / f"{month:02d}"

    if args.paper:
        if not re.fullmatch(r"[a-zA-Z0-9-]+", args.paper):
            parser.error(
                f"Invalid slug --paper '{args.paper}'. Use letters, digits and '-'."
            )
        create_paper_review(potm_dir, args.paper)
    else:
        create_root(potm_dir, year, month)


if __name__ == "__main__":
    main()
