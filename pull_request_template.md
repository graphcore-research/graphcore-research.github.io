For _Papers of the Month_ summaries, there are two types of PR:

1. **Summary PRs:** individual paper summaries on their own branch (`pom-YYYY-MM-<short-name-of-paper>`), to be merged into monthly branch.
2. **Monthly PRs:** a group of paper summaries on a monthly branch (`pom-YYYY-MM`), to be merged into `main`.

Each has its own checklist, which must be met before merging.

Author's should make an effort to satisfy these criteria (though anything that requires the page to be rendered can be left to the editor), but it is the _editor's job_ to tick them off before accepting the PR:

## Summary PR Checklist

- [ ] Check PR is set to merge into branch `pom-YYYY-MM`, **not** `main`
- [ ] Check paper authors are in the format: "Forename Surname, et al." / "Forename Surname, Forename Surname and Forename Surname." (max 3)
- [ ] Check author names
- [ ] Check other front matter
- [ ] Check paper links actually go to paper
- [ ] Check tags are aligned with existing tags at https://graphcore-research.github.io/tags/
- [ ] Check for image alt text
- [ ] Check plots are high-enough resolution
- [ ] Check plots width-scale properly / general mobile rendering (see `.constrained_img` css class)
- [ ] Review contents of article
- [ ] Spellcheck (https://www.grammarly.com/spell-checker)

## Monthly PR Checklist

- [ ] Implement chosen ordering of papers
- [ ] Add title do front matter & file name
- [ ] Write intro blurb
- [ ] Add twitter card image to `/assets/images/posts/YYYY-MM/potm/twitter_card.png`
- [ ] Quickly double-check Summary PR criteria look like they're still satisfied
- [ ] Check date in footer
- [ ] Make sure it looks ok on temporary version of public mirror, at https://graphcore-research.github.io/graphcore-research.github.io-internal/
- [ ] Double check nothing sensitive has been mentioned
