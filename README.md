# Graphcore Research Blog

Link: [graphcore-research.github.io](https://graphcore-research.github.io/)

## Running in a VSCode devcontainer (recommended)

 - (Install Docker.)
 - Open the folder inside a devcontainer "Rebuild and Reopen in Container".
 - Run `bundle install`
 - Run `bundle exec jekyll serve`

## Running locally

To run locally, execute:

```
gem install jekyll bundler
```

(only needed the first time). A local instance of the blog can then be launched via:

```
bundle exec jekyll serve
```

(please contact CB if this doesn't work for you.)

## Editing

This blog is hosted on Github pages. See `settings > pages` for details.

The blog itself is derived from [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes), which is built on [Jekyll](https://jekyllrb.com/).
For guidance on how to edit things on the site, your best bet is the
[Minimal Mistakes Guide](https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/).
More fundamental info may instead be found in the
[Jekyll Docs](https://jekyllrb.com/docs/).

The site is automatically built off of the `main` branch - any merge to `main` should
automatically trigger the site to update.

## Papers of the Month

All guidance for _Papers of the Month_ authors can be found in the summary template at
[for_authors/README.md](guides/paper_summary_template.md).

## Deploying

To deploy from the internal repo to the public one, set up:

```
git remote add public git@github-personal:graphcore-research/graphcore-research.github.io.git
```

then run `git push public main`.

## License

Copyright (c) 2024 Graphcore Ltd. Licensed under the MIT License.

The blog is built using [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes)
(MIT) via the
[remote theme starter](https://github.com/mmistakes/mm-github-pages-starter).
Minimal Mistakes itself is built on [Jekyll](https://jekyllrb.com/) (MIT).
