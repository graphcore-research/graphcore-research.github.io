---
date: 2024-03-30
categories:
- Papers of the Month
title: 'March Papers: Low-Rank Galore & 1.58-Bit Weights'
merge_potm: true
---

March was a fruitful month for AI research, with plenty of papers for us to choose from. A trend in the work we've selected is the pushing of previously published methods to their limits, in new creative ways.

We start with GaLore, similar to the popular [LoRA](https://arxiv.org/abs/2106.09685) method for cheap fine-tuning, but introducing a low-rank approximation to the _gradients_ instead of weights. It turns out this is particularly effective for pre-training.

Our second paper declares "The Era of 1-bit LLMs", showing that the previously published BitNet model can be tweaked for LLM training, such that weights can be rounded to either -1, 0 or 1. This is much stronger quantisation than most people thought possible. We also cover the DiPaCo paper, which demonstrates a method for scaling distributed MoE training, potentially to systems of such scale that they have to be distributed across datacentres.

Investigating a phenomenon that occurs as LLMs get larger, the Massive Activations paper brings valuable insight into why the numerics of LLMs tend to explode for certain tokens/hidden dimensions. We conclude with the G-Retriever paper, which provides a method for applying [retrieval augmented generation (RAG)](https://arxiv.org/abs/2005.11401) to textual graphs — something valuable in real-world applications where graph structures are commonplace.

