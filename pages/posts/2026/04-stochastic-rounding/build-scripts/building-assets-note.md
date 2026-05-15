# Regenerating assets

This directory has a couple of generated assets alongside the hand-written post:

- `img/sr-rbits-floor-r5.png`
- `img/sr-rbits-floor-r4.png`
- `img/sr-rbits-floor-r2.png`
- `img/sr-rbits-centered-r5.png`
- `img/sr-rbits-centered-r4.png`
- `img/sr-rbits-centered-r2.png`
- `img/sr-r2-floor-vs-centered.png`
- `sr_mlp_lp_rtn_sr_curves.plotly.json`

## Regenerating the SR snapshots

The floor-mode images

- `img/sr-rbits-floor-r5.png`
- `img/sr-rbits-floor-r4.png`
- `img/sr-rbits-floor-r2.png`

are generated from the real scalar SR JavaScript demo using Playwright + Chromium.

Inputs:

- `scripts/sr_rounding_snapshot.html`
- `sr-rosenbrock.css`
- `sr-rosenbrock.js`

Generator:

- `scripts/generate_sr_snapshot_playwright.py`

Run from the repo root:

```bash
uv run python pages/posts/2026/04-stochastic-rounding/scripts/generate_sr_snapshot_playwright.py
```

That overwrites:

```text
img/sr-rbits-floor-r5.png
img/sr-rbits-floor-r4.png
img/sr-rbits-floor-r2.png
img/sr-rbits-5-4-2-floor.png
```

### One-time setup for the snapshot generator

If Playwright is not installed in the project environment yet:

```bash
uv pip install playwright
uv run playwright install chromium
```

## Notes

- The snapshot generator fast-forwards the live JS demo to a large sample count and captures three panels for each mode, with `R=5`, `R=4`, and `R=2`.
- It also adds a boxed zoom inset around the `x \in [3.0, 3.5]` region of each panel.
- `uv run python pages/posts/2026/04-stochastic-rounding/scripts/generate_sr_snapshot_playwright.py --mode centered` similarly writes:
  - `img/sr-rbits-centered-r5.png`
  - `img/sr-rbits-centered-r4.png`
  - `img/sr-rbits-centered-r2.png`
  - `img/sr-rbits-5-4-2-centered.png`
- If the scalar demo styling or DOM ids change, update `scripts/sr_rounding_snapshot.html` and possibly `scripts/generate_sr_snapshot_playwright.py`.
