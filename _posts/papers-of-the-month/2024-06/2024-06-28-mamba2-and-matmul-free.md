---
title: "June Papers: Mamba-2 & Matmul-free Models"
header:
    teaser: /assets/images/posts/2024-06/potm/twitter_card.png
    image: /assets/images/posts/2024-06/potm/twitter_card.png
    og_image: /assets/images/posts/2024-06/potm/twitter_card.png

date: 2024-06-28T01:00:00-00:00
potm_year: 2024
potm_month: 6

layout: paper-summaries-layout
category: "papers-of-the-month"
toc: true
toc_sticky: true
toc_label: "Papers"
toc_icon: "book"
author.twitter: "GCResearchTeam"
---

Improving transformers is now not "just one area" of machine learning research. This is illustrated by the breadth of papers we got excited about this month, all of which claim to improve upon some aspect of the transformer, but in very different ways.

First, Mamba-2 explores the connection between structured state space models and attention, resulting in a new architecture, Mamba-2. (The paper isn't short, so you get value-for-money with this one!)

SµPar builds upon the maximal update parameterisation to transfer hyperparameters across different sparsity levels, promising predictable training of sparse models.

CoPE identifies deficiencies in current relative positional encodings, which are critical for turning transformers from set models into sequence models and introduces a new & richer form of encoding.

Finally, "matmul-free LMs" follow the trajectory of BitNet and BitNet b1.58, removing all matrix multiplies from a transformer LM forward pass (in doing so, they make it an RNN), promising compression & compute efficiency.

_I hope you enjoy these as much as we did. If you have thoughts or questions, keep the conversation going [@GCResearchTeam](https://x.com/GCResearchTeam)._

---

{% include paper-summaries.md %}
