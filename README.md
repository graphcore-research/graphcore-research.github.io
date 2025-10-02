# Graphcore Research Blog

Link: [graphcore-research.github.io](https://graphcore-research.github.io/)

## Running locally

This will allow you to view a local version of the site as you edit.

 - (Install Docker)
 - Open the folder inside a devcontainer (in VSCode select "Rebuild and Reopen in Container")
 - Run `bundle install`
 - Run `bundle exec jekyll serve`

## Papers of the Month

All guidance for _Papers of the Month_ authors can be found in the summary template at [paper_summary_template.md](paper_summary_template.md).

## Our Papers

To update the "our papers" list, see [_data/publications.yaml](_data/publications.yaml). To update the layout, see [_pages/publications.md](_pages/publications.md) and [assets/css/main.scss](assets/css/main.scss).

## Editing

This blog is hosted on Github pages. See `settings > pages` for details.

The blog itself is derived from [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes), which is built on [Jekyll](https://jekyllrb.com/).
For guidance on how to edit things on the site, your best bet is the
[Minimal Mistakes Guide](https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/).
More fundamental info may instead be found in the
[Jekyll Docs](https://jekyllrb.com/docs/).

## Deploying

The main repo used for developing content is this "internal" one, [`graphcore-research.github.io-internal`](https://github.com/graphcore-research/graphcore-research.github.io-internal). However the "public" repo which is the one that forms the main site is [`graphcore-research.github.io`](https://github.com/graphcore-research/graphcore-research.github.io).

To "publish" the blog, one must merge a given branch into `main` on this internal repo, then push this main branch to the public repo (this is the only way the public repo should ever be modified, no direct commits).

To deploy from the internal repo to the public one, set up:

```
git remote add public git@github-personal:graphcore-research/graphcore-research.github.io.git
```

then run `git push public main`.

## Preview

The "Running Locally" section above enables a local preview. One can also view a version of the _internal_ repo (as opposed to the public one) on the public internet (though we don't advertise this anywhere). This can be useful as a sanity check before pushing a change to the public site, as described above.

The link to this preview can be found on the page https://github.com/graphcore-research/graphcore-research.github.io-internal/settings/pages. Note that in the "Build and deployment" section the branch used can be changed from main to the user's chosen branch, which can be useful for e.g. sharing a preview of a branch with others.

## Hiring banner

Set `top_notice_text` and `top_notice_label` in ![default.html](_layouts/default.html) to enable the "we're hiring" banner.

## License

Copyright (c) 2024 Graphcore Ltd. Licensed under the MIT License.

The blog is built using [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes)
(MIT) via the
[remote theme starter](https://github.com/mmistakes/mm-github-pages-starter).
Minimal Mistakes itself is built on [Jekyll](https://jekyllrb.com/) (MIT).
