## Editor's Guide

The following document is a guide for the editor of a particularl monthly edition.

Their responsibility is to collate, review and edit the authors' work. Once the summaries are ready, they should write the intro paragraph, coordinate the newsletter with marketing and prepare social media content.

## Setup

- [ ] Schedule the monthly meeting to dicsuss papers at least a week before the first of the month.
- [ ] After the meeting, post the list of papers on #research-team-internal and decide on the selection of papers.
- [ ] Contact marketing (Kalina) to give them advance notice of when you expect to have content ready by and when you want it out by.
- [ ] Create a branch named `pom-YYYY-MM` (from the latest `main`) and a file named `_posts/papers-of-the-month/<YYYY-MM>/<YYYY-MM-DD>-title-tbd.md` based on a previous month's file. Then create a `papers/` directory there and run `cp guides/paper_summary_template.md _posts/papers-of-the-month/<YYYY-MM>/papers/<YYYY-MM-DD>-paper_summary_template.md`. Then update everything in the header from `title` down to `potm_month`. An example can be seen from [this commit](https://github.com/graphcore-research/graphcore-research.github.io-internal/commit/2c733f13efeb70eb237b2a1a17ba967785c1700c).
- [ ] Note: for the above, <DD> should be the same in all cases, and no later than the current day. The system can refuse to display things at times if it's not happy with the dates. Be aware of this if pages aren't showing up.
- [ ] Create a PR with the title `pom-YYYY-MM` based on this branch and copy the editor's checklist (see below) into the description.
- [ ] Send _message to authors_ (see below) to each of the month's authors.

## Message to authors

> **Guidance for authors**
>
> To submit your summary, please create a branch off of [`pom-<YYYY-MM>`](https://github.com/graphcore-research/graphcore-research.github.io-internal/compare/pom-<YYYY-MM>) named `pom-<YYYY-MM-short-name-of-paper>` and modify the file `_posts/papers-of-the-month/<YYYY-MM>/papers/<YYYY-MM-DD>-paper_summary_template.md` (rename with `<short-name-of-paper` instead of `<paper_summary_template>`.
>
> All author instructions should be contained within this template file ([master version](https://github.com/graphcore-research/graphcore-research.github.io-internal/blob/main/guides/paper_summary_template.md?plain=1)). Once your summary is ready, please submit a new PR named `pom-<YYYY-MM-short-name-of-paper>` and add me as a reviewer.
>
>  As mentioned previously, we're hoping to get this all ready by the end of \<deadline\>. Please let me know if you think you may not get it done in time. Thanks everyone!


TODO: twitter card


## Editor's checklist

- [ ] Check articles are all sensible length
- [ ] Check paper authors are in the format: "Forename Surname, et al." / "Forename Surname, Forename Surname and Forename Surname." (max 3)
- [ ] Check author names
- [ ] Check other front matter
- [ ] Check paper links actually go to paper
- [ ] Check tags are aligned with existing tags at https://graphcore-research.github.io/tags/
- [ ] Check for image alt text
- [ ] Check date in footer
- [ ] Check plots are high-enough resolution
- [ ] Check plots width-scale properly / general mobile rendering (see `.constrained_img` css class)
- [ ] Review contents of individual articles
- [ ] Write intro blurb
- [ ] Make sure it looks ok on temporary version of public mirror, at https://graphcore-research.github.io/graphcore-research.github.io-internal/
- [ ] Double check nothing sensitive has been mentioned
- [ ] Spellcheck final document (https://www.grammarly.com/spell-checker)
