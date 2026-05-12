...

---

_Note: after opening the PR, comment `/preview` to publish a public preview and `/unpreview` to remove it. The workflow will reply with the preview URL. Please check for secrets before publishing a preview._

## Blog Post Checklist (delete if not required)

- [ ] Make sure it looks ok on a local server with `./dev.sh` OR preview with `/preview` and check the URL in the PR comment; remember to `/unpreview` when done
- [ ] Check required frontmatter, including `slug`
- [ ] Check tags are aligned with existing tags at https://graphcore-research.github.io/tags/
- [ ] Check for image alt text
- [ ] Check plots are high-enough resolution, but file size not too large (prefer .jpg and .svg to .png)
- [ ] Check plots look the right size and scale properly by resizing window; if not, use `![Alt text](my_image.png){:.img-medium}`, or `.img-tiny .img-small .img-large` from `assets/custom.css`, or set a specific size with `{:style="max-width: Xpx;"}`.
- [ ] Review the contents
- [ ] Spellcheck
- [ ] Double check nothing sensitive has been mentioned
