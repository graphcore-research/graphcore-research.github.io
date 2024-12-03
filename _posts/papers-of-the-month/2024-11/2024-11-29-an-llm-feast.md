---
title: "November Papers: An LLM Feast"
header:
    teaser: /assets/images/posts/2024-11/potm/twitter_card.png
    image: /assets/images/posts/2024-11/potm/twitter_card.png
    og_image: /assets/images/posts/2024-11/potm/twitter_card.png

date: 2024-12-03T01:00:00-00:00
potm_year: 2024
potm_month: 11

layout: paper-summaries-layout
category: "papers-of-the-month"
toc: true
toc_sticky: true
toc_label: "Papers"
toc_icon: "book"
author.twitter: "GCResearchTeam"
---

This month we've got an all-LLM menu of papers for you, with summaries of four great works exploring many different aspects of crafting systems for LLM training and inference.

We start with the surprising result that removing a single weight out of billions can completely ruin a model's ability to generate coherent text. Dubbed "super weights", preserving these weights is essential when quantising models to lower precision.

Also, we discuss how researchers at Meta explored using _context parallelism_, where the hidden states of the tokens are split across multiple processors and attention is computed using collective operations. They experiment with multiple strategies and find that different strategies should be used during different phases of inference.

Next, we cover an extension of scaling laws to account for numerical precision. The authors find, among other things, that neither 16-bit precision (as in current practice) nor very narrow bit widths (e.g. 4-bit precision) seem to be optimal.

Finally, we have a paper about the _critical batch size_ in LLM training, the point at which increasing the global batch size is no longer helpful. The authors investigate how this value scales with the size of the model and the amount of training data, finding that the amount of training data has a much bigger effect.

*We hope you enjoy these month's papers as much as we did! If you have thoughts or questions, please reach out to us at [@GCResearchTeam](https://x.com/GCResearchTeam).*

---

{% include paper-summaries.md %}
