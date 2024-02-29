---
title: "February Papers: Longer RoPEs & Better Quantisation"
header.teaser  : /assets/images/posts/2024-02/potm/longrope/figure_2_trimmed.png
header.image   : /assets/images/posts/2024-02/potm/longrope/figure_2_trimmed.png
header.og_image: /assets/images/posts/2024-02/potm/longrope/figure_2_trimmed.png
header.teaser  : /assets/images/posts/2024-02/potm/longrope/figure_2_trimmed.png

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

Improving LLM inference is a key research topic at the moment and something we're particularly interested in at Graphcore because of its implications for hardware. February saw several developments in this area, focussing on both the efficiency and capabilities of LLM inference.

Microsoft contributed two of this month's papers, with the first showing a method of extrapolating to long sequences, and the second an approach to storing 6-bit weights. In this vein, researchers from Cornell go further and push the limits of quantisation to as few as 3 bits for inference.

Researchers from Apple instead find efficiency gains by accessing full model weights less often, through their new speculative streaming method — an improvement over the popular speculative decoding technique.

{% include paper-summaries.md %}
