---
title: "January Papers: Great Teachers & Beyond Chinchilla"
header.teaser: /assets/images/posts/2024-01/potm/beyond_chinchilla/figure_1b.png

date: 2024-01-29T01:34:30-04:00
potm_year: 2024
potm_month: 1

layout: paper-summaries-layout
category: "papers-of-the-month"
toc: true
toc_sticky: true
toc_label: "Papers"
toc_icon: "book"
---

For the research community, 2023 was dominated by large transformers and the associated challenges with training, tuning and deploying them.
This trend has continued into 2024, with January seeing some particularly useful developments in the area of efficient training.

Google DeepMind's work on active learning and MosaicML's work on updated scaling laws, stood out to us as particularly noteworthy.
The latter paper updates the influential [Chinchilla scaling laws](https://arxiv.org/abs/2203.15556) to account for the additional cost of inference — a key practical consideration that has influenced models like [Llama](https://ai.meta.com/llama/) & [Mistral](https://huggingface.co/docs/transformers/main/en/model_doc/mistral).

While scaling laws assume a fixed architecture, there are also benefits to be gained by tweaking model design. Nvidia demonstrate this in their paper on diffusion models training dynamics, where they make various stability-inducing changes (we did something similar in our [unit scaling paper](https://arxiv.org/abs/2303.11257)). Finally, we note a remarkable application of LLMs to the problem of geometry solving, which had previously appeared too data-constrained and reasoning-dependent for current AI to solve.

{% include paper-summaries.md %}
