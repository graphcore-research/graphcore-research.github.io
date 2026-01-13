---
title: "December Papers: MoE, Fact-storing and Byteifying Language Models"
header:
    teaser: /assets/images/posts/2025-12/potm/twitter_card.png
    image: /assets/images/posts/2025-12/potm/twitter_card.png
    og_image: /assets/images/posts/2025-12/potm/twitter_card.png

date: 2026-01-13T01:00:00-00:00
potm_year: 2025
potm_month: 12

layout: paper-summaries-layout
category: "papers-of-the-month"
toc: true
toc_sticky: true
toc_label: "Papers"
toc_icon: "book"
author.twitter: "GCResearchTeam"
---
Despite the holiday season and the busy NeurIPS period, December closed the year with set of insightful papers. Our team reviewed the following three papers:

<!-- SonicMoE: Accelerating MoE with IO and Tile-aware Optimizations -->
- First up, [SonicMoE](#sonicmoe-accelerating-moe-with-io-and-tile-aware-optimizations) tackles issues of fine-grained and sparse MoEs using hardware-aware optimizations to restore efficiency.

<!-- Constructing Efficient Fact-Storing MLPs for Transformers -->
- Next, [Constructing Efficient Fact-Storing MLPs for Transformers](#constructing-efficient-fact-storing-mlps-for-transformers) shows how MLP layers can be explicitly constructed as key–value stores to achieve high facts-per-parameter efficiency. 

<!-- Bolmo: Byteifying the Next Generation of Language Models -->
- Finally, [Bolmo](#bolmo-byteifying-the-next-generation-of-language-models) presents a method for "byteifying" existing subword-level language models that improves character-level understanding while achieving comparable performance to subword-level models.


*We hope you enjoy this month’s papers as much as we did! If you have thoughts or questions, please reach out to us at [@GCResearchTeam](https://x.com/GCResearchTeam).*  

---

{% include paper-summaries.md %}
