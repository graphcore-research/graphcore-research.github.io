---
title: "December Papers: Spend Your FLOPs Wisely"
header:
    teaser: /assets/images/posts/2024-12/potm/twitter_card.png
    image: /assets/images/posts/2024-12/potm/twitter_card.png
    og_image: /assets/images/posts/2024-12/potm/twitter_card.png

date: 2024-12-30T01:00:00-00:00
potm_year: 2024
potm_month: 12

layout: paper-summaries-layout
category: "papers-of-the-month"
toc: true
toc_sticky: true
toc_label: "Papers"
toc_icon: "book"
author.twitter: "GCResearchTeam"
---

Welcome to Papers of the Month — Graphcore Research's effort to bring you our pick of the most interesting ML papers.
In December we noted a collection of papers which took innovative approaches to allocating compute (FLOPs) to input data.

We start with the Byte Latent Transformer. This modifies the standard transformer to operate on _patches_, which comprise a variable number of input bytes, as determined by a entropy metric. The consequence of this is that compute is dynamically allocated towards "harder input data".

The Memory Layers architecture allows extra parameters to be added to a model without increasing FLOPs. Decoupling these resources gives model designers more control (e.g. for co-design, to fit their hardware resources) and potentially facilitates more effective models in general.

In the Phi-4 paper we cover a rather different FLOPs angle: spending compute in the data-generation process to create higher quality data, leading to "student" models that (in some domains) out-perform their "teachers".

*We hope you enjoy these month's papers as much as we did! If you have thoughts or questions, please reach out to us at [@GCResearchTeam](https://x.com/GCResearchTeam).*

---

{% include paper-summaries.md %}
