import re
import shutil
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path


def rewrite_preview_urls(site_dir: Path, preview_prefix: str) -> None:
    path_pattern = rf"/(?!/)(?!{re.escape(preview_prefix.lstrip('/'))}(?:/|[\"']))"

    for path in site_dir.rglob("*"):
        if not path.is_file() or path.suffix not in {".html", ".css", ".js"}:
            continue

        content = path.read_text()
        rewritten = content

        if path.suffix == ".html":
            rewritten = re.sub(
                rf"(\b(?:href|src|poster|action|data-src)\s*=\s*[\"']){path_pattern}",
                rf"\1{preview_prefix}/",
                rewritten,
                flags=re.IGNORECASE,
            )
            rewritten = re.sub(
                rf"(\bcontent\s*=\s*[\"'][^\"']*?\burl\s*=\s*){path_pattern}",
                rf"\1{preview_prefix}/",
                rewritten,
                flags=re.IGNORECASE,
            )

            def rewrite_srcset(match: re.Match[str]) -> str:
                value = re.sub(
                    rf"(^|,\s*){path_pattern}",
                    rf"\1{preview_prefix}/",
                    match.group("value"),
                )
                return f'{match.group("start")}{value}{match.group("quote")}'

            rewritten = re.sub(
                r"(?P<start>\bsrcset\s*=\s*(?P<quote>[\"']))"
                r"(?P<value>.*?)(?P=quote)",
                rewrite_srcset,
                rewritten,
                flags=re.IGNORECASE,
            )

        if path.suffix in {".html", ".css"}:
            rewritten = re.sub(
                rf"(\burl\(\s*[\"']?){path_pattern}",
                rf"\1{preview_prefix}/",
                rewritten,
                flags=re.IGNORECASE,
            )

        if path.suffix in {".html", ".js"}:
            rewritten = re.sub(
                rf"(\b(?:fetch|importScripts|URL|Worker|SharedWorker)"
                rf"\s*\(\s*[\"']){path_pattern}",
                rf"\1{preview_prefix}/",
                rewritten,
            )
            rewritten = re.sub(
                rf"(\b(?:const|let|var)\s+(?:target|DATA_URL)"
                rf"\s*=\s*[\"']){path_pattern}",
                rf"\1{preview_prefix}/",
                rewritten,
            )

        if rewritten != content:
            path.write_text(rewritten)


def prune_previews(
    preview_root: Path, max_age_days: int, now: datetime
) -> None:
    preview_root.mkdir(parents=True, exist_ok=True)
    cutoff = now - timedelta(days=max_age_days)
    for preview_dir in preview_root.glob("pr-*"):
        if not preview_dir.is_dir():
            continue
        timestamp_path = preview_dir / ".deployed-at"
        if not timestamp_path.exists() or datetime.fromisoformat(
            timestamp_path.read_text().strip()
        ) < cutoff:
            shutil.rmtree(preview_dir)


def deploy_preview(
    preview_root: Path,
    pr_number: str,
    site_dir: Path,
    preview_prefix: str,
    max_age_days: int,
    now: datetime,
) -> None:
    preview_root.mkdir(parents=True, exist_ok=True)
    preview_dir = preview_root / f"pr-{pr_number}"
    if preview_dir.exists():
        shutil.rmtree(preview_dir)
    shutil.copytree(site_dir, preview_dir)
    rewrite_preview_urls(preview_dir, preview_prefix)
    (preview_dir / ".deployed-at").write_text(now.isoformat())
    prune_previews(preview_root, max_age_days, now)


if __name__ == "__main__":
    now = datetime.now(timezone.utc)
    match sys.argv[1:]:
        case ["deploy", preview_root, pr_number, site_dir, preview_prefix, max_age_days]:
            deploy_preview(
                Path(preview_root),
                pr_number,
                Path(site_dir),
                preview_prefix,
                int(max_age_days),
                now,
            )
        case ["prune", preview_root, max_age_days]:
            prune_previews(Path(preview_root), int(max_age_days), now)
        case _:
            raise SystemExit(
                "usage: manage_previews.py deploy ROOT PR SITE PREFIX DAYS | "
                "prune ROOT DAYS"
            )
