This template includes 3 checklists, only 1 of which is needed for your PR. Please **delete as appropriate** before submitting the PR.

For _Papers of the Month_, there are two types of PR:

1. **Summary PRs:** individual paper summaries on their own branch (`pom-YYYY-MM-<short-name-of-paper>`), to be merged into monthly branch.
2. **Monthly PRs:** a group of paper summaries on a monthly branch (`pom-YYYY-MM`), to be merged into `main`.

---

## Summary PR Checklist

Authors should make an effort to satisfy these criteria, but it is the _editor's job_ to tick them off before accepting the PR (anything that requires the page to be rendered can be left to the editor).

- [ ] Check PR is set to merge into branch `pom-YYYY-MM`, **not** `main`
- [ ] Check paper author names look reasonable
- [ ] Check summary author names
- [ ] Check other frontmatter (content at top of page)
- [ ] Check paper links actually go to paper
- [ ] Check tags are aligned with existing tags at https://graphcore-research.github.io/tags/
- [ ] Check for image alt text
- [ ] Check plots are high-enough resolution
- [ ] Check plots look the right size and scale properly by resizing window; if not, use `![Alt text](my_image.png){:.img-medium}`, or `.img-tiny .img-small .img-large` from `assets/custom.css`, or set a specific size with `{:style="max-width: Xpx;"}`.
- [ ] Review contents of article
- [ ] Spellcheck

---

## Monthly PR Checklist

- [ ] Implement chosen ordering of papers
- [ ] Add title to frontmatter
- [ ] Write intro blurb
- [ ] Quickly double-check Summary PR criteria look like they're still satisfied
- [ ] Make sure it looks ok on a local server with `./dev.sh`
- [ ] Double check nothing sensitive has been mentioned

---

## Blog Post Checklist

- [ ] (Author) make sure it looks ok on a local server with `./dev.sh`
- [ ] Check required frontmatter, including `slug`
- [ ] Check tags are aligned with existing tags at https://graphcore-research.github.io/tags/
- [ ] Check for image alt text
- [ ] Check plots are high-enough resolution, but file size not too large (prefer .jpg and .svg to .png)
- [ ] Check plots look the right size and scale properly by resizing window; if not, use `![Alt text](my_image.png){:.img-medium}`, or `.img-tiny .img-small .img-large` from `assets/custom.css`, or set a specific size with `{:style="max-width: Xpx;"}`.
- [ ] Review the contents
- [ ] Spellcheck
- [ ] Double check nothing sensitive has been mentioned
