---
title: "Beyond Chinchilla-Optimal: Accounting for Inference in Language Model Scaling Laws"
paper_authors: "Nikhil Sardana and Jonathan Frankle"
orgs: "MosaicML"
paper_link: "https://arxiv.org/abs/2401.00448"
tags:
  - scaling-laws
  - inference
potm_year: 2024
potm_month: 1
paper_order: 1
image_dir: "/assets/images/posts/2024-01/potm/beyond_chinchilla/"
review_author: "Charlie Blake"
hidden: true
---

### The key idea

A few sentences outlining why the paper is interesting...

Add images where appropriate throughout. This section should always
have at least 1 key figure though.

![A process diagram showing GNNs employed to select candidates for DFT, and results fed back to the GNN]({{ page.image_dir | append: "figure_1b.png" | relative_url }})
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