---
tags:
- efficient-training
- sparsity
- transformers
potm_order: 3
paper_title: Memory Layers at Scale
paper_authors: Vincent-Pierre Berges, Barlas Oğuz, et al.
paper_orgs: Meta FAIR
paper_link: https://arxiv.org/abs/2412.09764
review_authors:
- douglaso
---

### The key idea

When scaling up LLMs, we usually increase the number of trainable parameters and the amount of training/inference compute together. This is what happens if you increase transformer width or depth since each parameter is used once per input token. In contrast to this, _memory layers_ add a large but sparsely accessed "memory" parameter, allowing a vast increase in trainable parameters with a minimal increase in training and inference compute. This paper adapts previous ideas for memory layers to produce a model architecture that works at scale and compares favourably to the dense Llama 2 and Llama 3 families.

![On the left, two sets of boxes labelled k00 to k04 and k10 to k14, then two topk operations, indexing a grid of v00 to v44 (25 boxes). On the right: s11+s00, s11+s03, s14+s00, s14+s03 (all sums of selected scores), then top-k, softmax, and mixing with v40 and v43 (selected by top-k) to produce the output.](./memory-layers-diagram.png){:class="constrained_img_large"}
<figcaption>An illustration of a product key memory. A query is compared against two sets of keys, $K_1$ and $K_2$, yielding score vectors $s_0$ and $s_1$. The Cartesian product of the top-k indices of these $s_0$ and $s_1$ gives a set of $k^2$ values to consider. A final top-k of the sum of each pair of scores selects the values to mix, weighted by a softmax of their scores. This example uses $N=5^2, k=2$ and shows a single query head. (Diagram by reviewer.)</figcaption>

### Background - memory layers

A memory layer resembles sparse multi-head attention, except that the keys and values are directly trainable parameters, rather than projections of an input activation. The process follows:

1. Derive a _query_ from the input via a small query MLP.
2. For each head, compute _scores_ via dot product of query with every key.
3. _Select_ the top-k scores.
4. Softmax selected scores to get _weights_.
5. Compute the weighted sum of selected _values_ as the output.

Unfortunately, this design has a high compute cost as the memory size is increased, since the query-key dot product is exhaustive. This is remedied using _product keys_, which compute similarity against two distinct sets of keys $K_1$ and $K_2$ to give score vectors $s_1$ and $s_2$, then the score for a given value $V_{ij}$ is $s_{1i} + s_{2j}$. This means the amount of compute scales as $\sqrt{N}$ for memory size $N$. The process is illustrated in the figure above.

### Their technique

This work makes a few architectural modifications to the product key memory layer to produce a `Memory+` layer and trains it at scale in a modern Llama transformer architecture. The changes are:

- Wrap multi-head product key memory **within a swiglu-gated MLP**. The memory layer replaces the linear up-projection.
- **Replace 3 MLP layers**, equally spaced in the transformer stack, with memory layers, which have distinct query MLPs and keys, but **shared memory values**.
- Use a **small key dimension**. For hidden size $H$, the value dimension is set to $H$, while each product key is size $H/4$.

For example, the largest model they train is based on Llama 3, replacing 3 MLPs with product key memories with $2 \times 4096$ keys, so the number of memory items (shared between all memory layers) is $4096^2 = 16\textrm{M}$. Each value is a vector of size $4096$, so the number of memory parameters (which is dominated by values) is $4096^3 = 64\textrm{B}$.

### Results

To test their architecture, the authors train autoregressive language models and evaluate multiple downstream tasks. They show improvements with training FLOP parity across models from 134M to 8B parameters, compared against mixture-of-expert models as well as dense models and vanilla product key memory layers.

Their headline result shows task performance improvement as the memory layer is scaled, allowing a 1.3B model with `Memory+` layers to approach the performance of a 7B model without memory layers (dashed line).

![](./figure-1.png)

Their largest model (8B) follows the Llama 3 architecture, and generally outperforms the dense baseline after 1T training tokens, although not consistently across all downstream tasks.

![](./table-2.png)

### Takeaways

The work shows promise for product key memory layers at scale. As the authors note, gains are more pronounced in early training, so it will be important to confirm the benefit for inference-optimised overtrained LLMs. They also highlight the challenge of optimising and co-evolving sparse techniques such as this with ML hardware.
