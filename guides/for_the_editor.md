## Editor's Guide

The following document is a guide for the editor of a particularl monthly edition.

Their responsibility is to collate, review and edit the authors' work. Once the summaries are ready, they should write the intro paragraph, coordinate the newsletter with marketing and prepare social media content.

## Setup

- [ ] Schedule the monthly meeting to dicsuss papers at least a week before the first of the month.
- [ ] After the meeting, post the list of papers on #research-team-internal and decide on the selection of papers.
- [ ] Contact marketing (Kalina) to give them advance notice of when you expect to have content ready by and when you want it out by.
- [ ] Create a branch named `pom-YYYY-MM` (from the latest `main`) and a file named `_posts/papers-of-the-month/YYYY-MM/YYYY-MM-DD-title-tbd.md` based on a previous month's file. An example can be seen from [this commit](https://github.com/graphcore-research/graphcore-research.github.io-internal/compare/main...pom-2024-03).
- [ ] 


TODO: twitter card, weird date thing


check-list for editors to go through before publishing the public version of the blog. This checklist should be copied into each PR and each item ticked-off.

---

Editor's checklist:

- [ ] Check articles are all sensible length
- [ ] Review intro blurb
- [ ] Review individual articles
- [ ] Check paper authors are in the format: "Forename Surname, et al." / "Forename Surname, Forename Surname and Forename Surname." (max 3)
- [ ] Check author names
- [ ] Check other front matter
- [ ] Check paper links actually go to paper
- [ ] Check tags are aligned with existing tags at https://graphcore-research.github.io/tags/
- [ ] Check for image alt text
- [ ] Check date in footer
- [ ] Check plots are high-enough resolution
- [ ] Check plots width-scale properly / general mobile rendering (see `.constrained_img` css class)
- [ ] Make sure it looks ok on temporary version of public mirror, at https://graphcore-research.github.io/graphcore-research.github.io-internal/
- [ ] Double check nothing sensitive has been mentioned
- [ ] Spellcheck final document (https://www.grammarly.com/spell-checker)
