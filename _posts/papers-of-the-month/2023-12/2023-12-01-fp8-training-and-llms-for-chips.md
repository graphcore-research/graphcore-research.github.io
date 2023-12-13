---
title: "December Papers: FP8 Training & LLMs for Chips"
date: 2023-12-01T01:34:30-04:00
category: "papers-of-the-month"
tags:
  - fp8
  - number-formats
  - hardware
  - transformers
  - gnns
header:
  teaser: /assets/images/posts/2023-12/potm/chipnemo/fig1.png
toc: true
toc_label: "Papers"
toc_icon: "book"
---

The last month saw impressive developments in the space of efficient transformers
and applied ML, from chip design to materials discovery.

Researchers at Microsoft showed that FP8 could be used in parts of the LLM training
process that until now had been kept in higher-precision, and work from ETH Zurich
suggested a simplified way of designing transformer-like models.

In terms of applications, Nvidia have trained up an impressive model to assist their
engineers on chip design. This is a neat feedback loop: their chip-design has been
making LLMs better for years, and now their LLMs are making chip-design better. DeepMind
also have impressive results showing that GNNs can be used in the discovery of new
inorganic crystals — a key building block of many modern technologies.

Here's a summary of some of our favourite papers over the last month:

{% assign image_dir = site.baseurl | append: "/assets/images/posts/2023-12/potm" %}

## [FP8-LM: Training FP8 Large Language Models](https://arxiv.org/abs/2310.18313){:target="_blank"}

_Houwen Peng, Kan Wu, Yixuan Wei, et al. (Microsoft Azure and Microsoft Research)_

{% include_relative fp8_lm.md %}

**Full paper:** [FP8-LM: Training FP8 Large Language Models](https://arxiv.org/abs/2310.18313){:target="_blank"}

## [ChipNeMo: Domain-Adapted LLMs for Chip Design](https://arxiv.org/abs/2311.00176){:target="_blank"}

_Mingjie Liu, Teodor-Dumitru Ene, Robert Kirby, Chris Cheng, Nathaniel Pinckney, Rongjian Liang, et al. (Nvidia)_

{% include_relative chipnemo.md %}

**Full paper:** [ChipNeMo: Domain-Adapted LLMs for Chip Design](https://arxiv.org/abs/2311.00176){:target="_blank"}

## [Simplifying Transformer Blocks](https://arxiv.org/abs/2311.01906){:target="_blank"}

_Bobby He, Thomas Hofmann (ETH Zurich)_

{% include_relative simplifying_transformer_blocks.md %}

**Full paper:** [Simplifying Transformer Blocks](https://arxiv.org/abs/2311.01906){:target="_blank"}

## [Scaling Deep Learning for Materials Discovery](https://www.nature.com/articles/s41586-023-06735-9){:target="_blank"}

_Amil Merchant, Simon Batzner, Samuel S. Schoenholz, Muratahan Aykol, Gowoon Cheon & Ekin Dogus Cubuk_ (Google DeepMind)

{% include_relative materials_discovery.md %}

**Full paper:** [Scaling Deep Learning for Materials Discovery](https://www.nature.com/articles/s41586-023-06735-9){:target="_blank"}

---

_**Summaries by:** Charlie Blake, Douglas Orr, Luka Ribar and Josef Dean_