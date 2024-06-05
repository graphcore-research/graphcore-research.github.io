---
title: "May Papers: xLSTM, Schedule-Free Optimizers, and Multi-token prediction"
header:
    teaser: /assets/images/posts/2024-05/potm/twitter_card.png
    image: /assets/images/posts/2024-05/potm/twitter_card.png
    og_image: /assets/images/posts/2024-05/potm/twitter_card.png

date: 2024-05-31T01:00:00-00:00
potm_year: 2024
potm_month: 5

layout: paper-summaries-layout
category: "papers-of-the-month"
toc: true
toc_sticky: true
toc_label: "Papers"
toc_icon: "book"
author.twitter: "GCResearchTeam"
---

May is always a eventful time of year for ML researchers, with final ICML paper decisions and ICLR taking place in early May, and NeurIPS submission deadlines closing the month. This month we take a look at three papers exploring new techniques to challenge the mainstream large-scale pretraining setup: transformers trained with next-token prediction optimized with Adam/AdamW.

The first paper, xLSTM, is a long-awaited deep dive into Sepp Hochreiter's new, improved RNN architecture, nearly 30 years after the original LSTM was published. Drawing inspiration from linear attention, the authors demonstrate scaling comparable to transformers up to 1.3B parameters.

We then take a look at Schedule-Free optimizers from a team at FAIR. The authors propose a new class of optimizers that require no finicky learning rate scheduling. By replacing gradient momentum terms in standard optimizers with parameter averages, the authors show faster convergence than scheduled optimizers on a wide battery of small-scale deep learning tasks.

A further paper from FAIR extends the standard pretraining task for large language models from next token prediction, to multi token prediction. This particularly seems to improve performance for larger models and offers a natural choice of model to use for speculative sampling during inference. 

{% include paper-summaries.md %}
