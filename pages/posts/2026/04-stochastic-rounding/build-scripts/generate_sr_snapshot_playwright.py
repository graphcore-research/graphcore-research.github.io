from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright


SCRIPTS_DIR = Path(__file__).resolve().parent
POST_DIR = SCRIPTS_DIR.parent
ROOT = POST_DIR.parents[3]
HTML = SCRIPTS_DIR / "sr_rounding_snapshot.html"
TMP = ROOT / "tmp"


@dataclass(frozen=True)
class PanelSpec:
    title: str
    r_bits: int
    centered: bool = False
    min_samples: int = 200000


def panel_specs(mode: str) -> list[PanelSpec]:
    if mode == "floor":
        return [
            PanelSpec("Floor SR, R = 5", r_bits=5, centered=False),
            PanelSpec("Floor SR, R = 4", r_bits=4, centered=False),
            PanelSpec("Floor SR, R = 2", r_bits=2, centered=False),
        ]
    if mode == "centered":
        return [
            PanelSpec("Centered SR, R = 5", r_bits=5, centered=True),
            PanelSpec("Centered SR, R = 4", r_bits=4, centered=True),
            PanelSpec("Centered SR, R = 2", r_bits=2, centered=True),
        ]
    raise ValueError(f"unknown mode: {mode}")


def get_font(size: int, bold: bool = False):
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        if bold
        else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf"
        if bold
        else "/usr/share/fonts/dejavu/DejaVuSans.ttf",
    ]
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


BG = (255, 254, 250)
INK = (35, 38, 41)
BOX = (80, 88, 98)
BOX_FILL = (255, 254, 250)
GAP = 28
PAD_X = 24
PAD_Y = 18
X_MIN = 2.9
X_MAX = 7.0
Y_MIN = 2.4
Y_MAX = 7.6
ZOOM_X0 = 3.7
ZOOM_X1 = 4.7
ZOOM_Y0 = 3.7
ZOOM_Y1 = 4.7


def wait_for_samples(page, threshold: int):
    page.wait_for_function(
        """threshold => {
            const el = document.getElementById("sr-rounding-seed");
            if (!el) return false;
            const m = /Samples:\\s*([0-9]+)/.exec(el.textContent || "");
            return m && Number(m[1]) >= threshold;
        }""",
        arg=threshold,
        timeout=20000,
    )


def capture_panel(page, spec: PanelSpec, out_path: Path):
    page.get_by_role("button", name="Reset").click()
    if spec.centered:
        page.locator("#sr-rounding-mode-centered").check()
    else:
        page.locator("#sr-rounding-mode-floor").check()
    page.locator("#sr-rounding-demo").evaluate(
        "(el, label) => { el.dataset.meanLegendLabel = label; }",
        f"SR, {'Centered' if spec.centered else 'Floor'}, R = {spec.r_bits}",
    )
    r_input = page.locator("#sr-rounding-rbits")
    r_input.fill(str(spec.r_bits))
    r_input.blur()
    page.get_by_role("button", name="Ffwd").click()
    wait_for_samples(page, spec.min_samples)
    page.get_by_role("button", name="Pause").click()
    page.locator(".sr-rounding-canvas-wrap").screenshot(path=str(out_path))


def sx(image_width: int, x: float) -> float:
    left = 58
    right = 20
    plot_width = image_width - left - right
    return left + (x - X_MIN) / (X_MAX - X_MIN) * plot_width


def sy(image_height: int, y: float) -> float:
    top = 22
    bottom = 58
    plot_height = image_height - top - bottom
    return top + (1.0 - (y - Y_MIN) / (Y_MAX - Y_MIN)) * plot_height


def add_zoom_inset(panel: Image.Image) -> Image.Image:
    panel = panel.copy()
    draw = ImageDraw.Draw(panel)
    x0 = sx(panel.width, ZOOM_X0)
    x1 = sx(panel.width, ZOOM_X1)
    y0 = sy(panel.height, ZOOM_Y1)
    y1 = sy(panel.height, ZOOM_Y0)
    crop_box = (
        int(round(x0)),
        int(round(y0)),
        int(round(x1)),
        int(round(y1)),
    )
    draw.rectangle(crop_box, outline=BOX, width=3)

    crop = panel.crop(crop_box)
    inset_w = int(panel.width * 0.44)
    inset_h = int(inset_w * crop.height / crop.width)
    inset = crop.resize((inset_w, inset_h), Image.Resampling.BICUBIC)
    inset_box = (
        panel.width - inset_w - 92,
        panel.height - inset_h - 220,
    )
    outer_box = [
        inset_box[0],
        inset_box[1],
        inset_box[0] + inset_w,
        inset_box[1] + inset_h,
    ]
    panel.paste(inset, inset_box)
    draw.rectangle(outer_box, outline=BOX, width=3)
    src_tl = (crop_box[0], crop_box[1])
    src_bl = (crop_box[0], crop_box[3])
    inset_tl = (outer_box[0], outer_box[1])
    inset_bl = (outer_box[0], outer_box[3])
    draw.line([src_tl, inset_tl], fill=BOX, width=3)
    draw.line([src_bl, inset_bl], fill=BOX, width=3)
    return panel


def panel_output_path(mode: str, r_bits: int) -> Path:
    return POST_DIR / "img" / f"sr-rbits-{mode}-r{r_bits}.png"


def main():
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", choices=["floor", "centered"], default="floor")
    args = parser.parse_args()

    panels_spec = panel_specs(args.mode)
    out_path = POST_DIR / "img" / f"sr-rbits-5-4-2-{args.mode}.png"

    TMP.mkdir(parents=True, exist_ok=True)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    shot_paths = [
        TMP / f"sr-snapshot-{args.mode}-{i}.png" for i in range(len(panels_spec))
    ]

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(
            viewport={"width": 1040, "height": 980}, device_scale_factor=2
        )
        page.goto(HTML.resolve().as_uri())
        page.wait_for_selector("#sr-rounding-demo.js-ready", timeout=10000)
        for spec, path in zip(panels_spec, shot_paths):
            capture_panel(page, spec, path)
        browser.close()

    panels = [add_zoom_inset(Image.open(path).convert("RGB")) for path in shot_paths]
    for panel, spec in zip(panels, panels_spec):
        panel.save(panel_output_path(args.mode, spec.r_bits), "PNG")
    width = PAD_X * 2 + sum(panel.width for panel in panels) + GAP * (len(panels) - 1)
    height = PAD_Y * 2 + max(panel.height for panel in panels)
    canvas = Image.new("RGB", (width, height), BG)

    x = PAD_X
    top_y = PAD_Y
    for panel in panels:
        canvas.paste(panel, (x, top_y))
        x += panel.width + GAP
    canvas.save(out_path, "PNG")

    for panel in panels:
        panel.close()
    for path in shot_paths:
        path.unlink(missing_ok=True)

    print(out_path)


if __name__ == "__main__":
    main()
