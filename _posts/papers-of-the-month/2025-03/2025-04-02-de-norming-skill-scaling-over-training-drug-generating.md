---
title: "March Papers: De-Norming, Skill-Scaling, Over-Training and Drug-Generating"
header:
    teaser: /assets/images/posts/2025-03/potm/twitter_card.png
    image: /assets/images/posts/2025-03/potm/twitter_card.png
    og_image: /assets/images/posts/2025-03/potm/twitter_card.png

date: 2025-04-06T01:00:00-00:00
potm_year: 2025
potm_month: 3

layout: paper-summaries-layout
category: "papers-of-the-month"
toc: true
toc_sticky: true
toc_label: "Papers"
toc_icon: "book"
author.twitter: "GCResearchTeam"
---

We've enjoyed March, bringing improving weather and many excellent ML papers to keep us busy. As usual, we're here to share summaries of four of our favourites.

First, Meta share their work that successfully removes the need for `LayerNorm` in transformers, replacing them with a reduction-free $\tanh$ ([de-norming](#transformers-without-normalisation)). This is followed by two papers on scaling - studying the different scaling laws for skill-based vs knowledge-based downstream tasks ([skill-scaling](#compute-optimal-scaling-of-skills-knowledge-vs-reasoning)), and whether pretraining can go on too long, making downstream performance worse ([over-training](#overtrained-language-models-are-harder-to-fine-tune)). Finally, EPFL share a flow-matching GNN model for generating small molecules for drug design ([drug-generating](#multi-domain-distribution-learning-for-de-novo-drug-design)).

*We hope you enjoy this month's papers as much as we did! If you have thoughts or questions, please reach out to us at [@GCResearchTeam](https://x.com/GCResearchTeam).*

---

{% include paper-summaries.md %}