---
title: "September Papers: Proper Conditioning"
header:
    teaser: /assets/images/posts/2024-09/potm/twitter_card.png
    image: /assets/images/posts/2024-09/potm/twitter_card.png
    og_image: /assets/images/posts/2024-09/potm/twitter_card.png

date: 2024-09-30T01:00:00-00:00
potm_year: 2024
potm_month: 9

layout: paper-summaries-layout
category: "papers-of-the-month"
toc: true
toc_sticky: true
toc_label: "Papers"
toc_icon: "book"
author.twitter: "GCResearchTeam"
---

We're pleased to share four papers from different domains: LLM self-correction, FP8 training, generative crystals and optimisation. They are united, somewhat tenuously, by the importance of _proper conditioning_:

1. DeepMind researchers explain how _conditioning on the wrong distribution_ during supervised fine-tuning for self-correction is harmful but can be overcome using RL.
2. A novel Smooth-SwiGLU activation _"conditions" the numerics_ by inserting a scaling factor in just the right place, preventing late-training instability in FP8.
3. The GenMS architecture that generates crystal structures for materials _conditions on high-level textual and low-level structural information_ for high-quality generation.
4. SOAP is an evolution of Shampoo, with conditioners in the name and _preconditioners forming the eigenbasis_ for optimisation.

You can be the judge of how tenuous the connection is, but we'd encourage you to check out the summaries first or despite this.

_I hope you enjoy these as much as we did. Tell us we're wrong; tell us we're right [@GCResearchTeam](https://x.com/GCResearchTeam)._

---

{% include paper-summaries.md %}
