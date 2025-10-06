---
title: "Soft Tokens, Hard Truths"
paper_authors: "Natasha Butt et al."
orgs: "Meta FAIR, New York University, University of Amsterdam"
paper_link: "https://arxiv.org/abs/2509.19170"
tags:
    - LLMs
    - reinforcement-learning
    - reasoning
    - fine-tuning  # Use https://graphcore-research.github.io/tags/ as reference
potm_year: 2025
potm_month: 9
paper_order: 1  # Editor will decide
image_dir: "/assets/images/posts/2025-09/potm/soft-tokens-hard-truths/"
review_author:
    name: "Luke Hudlass-Galley"
    link: "https://www.linkedin.com/in/lukehudlassgalley/"
hidden: true
---

[200 words is a rough guide for the length of a summary.
Feel free to go a fair bit over or under if needs be.
The editor will fix any issues with images being rendered too wide/narrow etc.
See README for how to view locally if you wish to (not required. Contact CB if this
is broken for you.)]

### The key idea

Over the course of the last year, a number of works have investigated ``latent reasoning'',
in which reasoning tokens are represented in some continuous latent space, rather than a 
specific token in the language vocabulary. Many of these works require implementation
schemes that are difficult to scale (such as [Coconut](https://arxiv.org/abs/2412.06769))
or are training-free (such as [Soft Thinking](https://arxiv.org/abs/2505.15778) and 
[Mixture of Inputs](https://arxiv.org/abs/2505.14827)). None of these approaches are suited
for training with reinforcement learning approaches such as GRPO, which have become the
leading post-training methods for improving reasoning performance.

In **Soft Tokens, Hard Truths**, the authors propose a simple and scalable method to implement
continuous thoughts which integrates with RL training schemes. They use this to explore
difference configurations of ``soft'' continious tokens and ``hard'' 



A few sentences outlining why the paper is interesting...

Add images where appropriate throughout. This section should always
have at least 1 key figure though.

*Please use high-res images (zoom in for those screenshots!) The editor will *

![A specific and succinct sentence or two describing the figure 1 (alt text). Valuable for seo and accessibility.](example_upload/figure_1.png)
<figcaption>Figure 1a. If the caption isn't included in the image, it should be added like so.</figcaption>

### [optional] Background

If necessary, a short intro to background matierial needed to understand the method

### Their method

Latex can be included in the standard way, either inline: $R=\sum _{t=0}^{\infty }\gamma ^{t}r_{t}$

Or as a block:

$$
Q_{t+1}^{A}(s_{t},a_{t})=Q_{t}^{A}(s_{t},a_{t})+\alpha _{t}(s_{t},a_{t})\left(r_{t}+\gamma Q_{t}^{B}\left(s_{t+1},\mathop {\operatorname {arg~max} } _{a}Q_{t}^{A}(s_{t+1},a)\right)-Q_{t}^{A}(s_{t},a_{t})\right).
$$

Code can also be included in the standard way:

```
import popart

builder = popart.Builder()

# Build a simple graph
i1 = builder.addInputTensor(popart.TensorInfo("FLOAT", [1, 2, 32, 32]))
i2 = builder.addInputTensor(popart.TensorInfo("FLOAT", [1, 2, 32, 32]))

o = builder.aiOnnx.add([i1, i2])
```

### Results

...

### [optional] Takeaways

...