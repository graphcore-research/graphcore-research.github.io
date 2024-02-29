---
title: "February Papers: Longer RoPEs & Better Quantisation"
header:
    teaser: /assets/images/posts/2024-02/potm/twitter_card.png
    image: /assets/images/posts/2024-02/potm/twitter_card.png
    og_image: /assets/images/posts/2024-02/potm/twitter_card.png

date: 2024-02-29T01:34:30-04:00
potm_year: 2024
potm_month: 2

layout: paper-summaries-layout
category: "papers-of-the-month"
toc: true
toc_sticky: true
toc_label: "Papers"
toc_icon: "book"
author.twitter: "GCResearchTeam"
---

Improving LLM inference is a key research topic at the moment, and something we're particularly interested in at Graphcore because of its hardware implications. February saw several developments in this area, focussing on both the efficiency and capabilities of LLM inference.

Microsoft contributed two of this month's papers, with the first showing a method of extrapolating to long sequences, and the second an approach to storing 6-bit weights. Researchers from Cornell University have gone further and pushed the limits of quantisation to as few as 3 bits for inference. Apple also introduced their new speculative streaming method, which makes efficiency gains by asking the model to predict multiple future tokens, improving over the popular speculative decoding technique.

{% include paper-summaries.md %}
