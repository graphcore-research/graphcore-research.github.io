## Editor's Guide

The following document is a guide for the editor of a particular monthly edition.

Your responsibility is to collate, review and edit the authors' work. Once the summaries are ready, you should write the intro paragraph, coordinate the newsletter with marketing, prepare and release social media content.

## Setup

- [ ] After the monthly meeting, post the list of papers on #research-team-internal and solicit scores (see previous posts for examples).
- [ ] Contact marketing (Kalina) to give them advance notice of when you expect to have content ready by and when you want it out by.
- [ ] Create a branch named `pom-YYYY-MM` (from the latest `main`) and a file named `_posts/papers-of-the-month/<YYYY-MM>/<YYYY-MM-DD>-title-tbd.md` based on a previous month's file. Then create a `papers/` directory there and run `cp guides/paper_summary_template.md _posts/papers-of-the-month/<YYYY-MM>/papers/<YYYY-MM-DD>-paper_summary_template.md`. Then update everything in the header from `title` down to `potm_month`. An example can be seen from [this commit](https://github.com/graphcore-research/graphcore-research.github.io-internal/commit/2c733f13efeb70eb237b2a1a17ba967785c1700c).
- [ ] Note: for the above, `<DD>` should be the same in all cases, and no later than the current day. The system can refuse to display things at times if it's not happy with the dates. Be aware of this if pages aren't showing up.
- [ ] Create a PR with the title `pom-YYYY-MM` based on this branch.
- [ ] Create a slack group containing this month's authors and post _message to authors_ (see below).

## Message to authors

Before sending this out, replace `YYY-MM[-DD]` and `[deadline]` with relevant values. Note: when you paste into slack you should accept the "apply formatting" pop-up.

The message is as follows:

---

Thanks for agreeing to write a summary for this month! Please follow these instructions:

**Guidance for authors**

To submit your summary, please do the following:
1. Create a branch off of [pom-YYYY-MM](https://github.com/graphcore-research/graphcore-research.github.io-internal/compare/pom-YYYY-MM) named `pom-YYYY-MM-short-name-of-paper`
2. Rename the file `_posts/papers-of-the-month/YYYY-MM/papers/YYYY-MM-DD-paper_summary_template.md` to `.../short-name-of-paper.md`
3. All other instructions should be contained within that template file. You should write your review in this file.
4. Once your summary is ready, please submit a new PR named `pom-YYYY-MM-short-name-of-paper` (same an branch name) and add me as a reviewer.

As mentioned previously, we're hoping to get this all ready by the end of [deadline]. Please let me know if you think you may not get it done in time.

---

## Editing articles

When authors create a PR, it should auto-populate the description with a checklist from [pull_request_template.md](https://github.com/graphcore-research/graphcore-research.github.io-internal/blob/main/pull_request_template.md). The job of the editor is to make sure this is satisfied.

In doing this, the editor will need to render the site locally. Instructions for this can be found in `README.md` (see `## Running in a VSCode devcontainer`).

Similarly, when merging the monthly PR into main this template also contains a checklist which must be satisfied.

## Publishing

Once the primary `pom-YYYY-MM` branch is ready and checklist completed, merge it into `main`. Then follow the instructions in the deployment section of `README.md` (see `## Deployment`) to make this public. Editors are advised to preview the internal version of the site as described in `README.md` (`## Preview`) before pushing to public main.
