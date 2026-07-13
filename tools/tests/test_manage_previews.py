import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

from tools.manage_previews import deploy_preview, prune_previews


class ManagePreviewsTest(unittest.TestCase):
    def test_deploy_rewrites_urls_and_refreshes_timestamp(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            site = root / "site"
            site.mkdir()
            (site / "index.html").write_text(
                '<a href="/about/">About</a>'
                '<a href="/pr-preview/pr-42/already/">Already prefixed</a>'
                '<img src="//cdn.example/image.png">'
                '<img srcset="/small.png 1x, /large.png 2x">'
                '<meta http-equiv="refresh" content="0; url=/new/">'
                '<script>const target = "/new/"; fetch("/data.json")</script>'
            )
            (site / "style.css").write_text("body { background: url('/img/bg.png') }")
            (site / "app.js").write_text(
                'fetch("/api/data.json"); new Worker("/worker.js");'
            )
            (site / "unchanged.js").write_text('const separator = "/";')

            now = datetime(2026, 7, 13, tzinfo=timezone.utc)
            deploy_preview(
                root / "previews",
                "42",
                site,
                "/pr-preview/pr-42",
                30,
                now,
            )

            preview = root / "previews" / "pr-42"
            html = (preview / "index.html").read_text()
            self.assertIn('href="/pr-preview/pr-42/about/"', html)
            self.assertIn(
                'href="/pr-preview/pr-42/already/">Already prefixed', html
            )
            self.assertIn('src="//cdn.example/image.png"', html)
            self.assertIn(
                'srcset="/pr-preview/pr-42/small.png 1x, '
                '/pr-preview/pr-42/large.png 2x"',
                html,
            )
            self.assertIn("url=/pr-preview/pr-42/new/", html)
            self.assertIn('target = "/pr-preview/pr-42/new/"', html)
            self.assertIn('fetch("/pr-preview/pr-42/data.json")', html)
            self.assertIn(
                "url('/pr-preview/pr-42/img/bg.png')",
                (preview / "style.css").read_text(),
            )
            self.assertIn(
                'fetch("/pr-preview/pr-42/api/data.json")',
                (preview / "app.js").read_text(),
            )
            self.assertIn(
                'Worker("/pr-preview/pr-42/worker.js")',
                (preview / "app.js").read_text(),
            )
            self.assertEqual(
                (preview / "unchanged.js").read_text(), 'const separator = "/";'
            )
            self.assertEqual(
                (preview / ".deployed-at").read_text(), now.isoformat()
            )

    def test_prune_removes_expired_and_unmarked_previews(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            now = datetime(2026, 7, 13, tzinfo=timezone.utc)
            for number, deployed_at in {
                "1": now - timedelta(days=31),
                "2": now - timedelta(days=30),
                "3": now - timedelta(days=1),
            }.items():
                preview = root / f"pr-{number}"
                preview.mkdir()
                (preview / ".deployed-at").write_text(deployed_at.isoformat())
            (root / "pr-4").mkdir()

            prune_previews(root, 30, now)

            self.assertFalse((root / "pr-1").exists())
            self.assertTrue((root / "pr-2").exists())
            self.assertTrue((root / "pr-3").exists())
            self.assertFalse((root / "pr-4").exists())


if __name__ == "__main__":
    unittest.main()
