---
title: "<Full Paper Title>"
paper_authors: "<Forename Surname, et al.' or 'Forename Surname, Forename Surname and Forename Surname.' (max 3 unless >3 first authors)>"
orgs: "<name of org>"
paper_link: "https://arxiv.org/abs/<...>"
tags:
    - efficient-inference
    - quantisation  # Use https://graphcore-research.github.io/tags/ as reference
potm_year: 2024
potm_month: 8
paper_order: 1  # Editor will decide
image_dir: "/assets/images/posts/<YYYY-MM>/potm/<short_paper_name>/"
review_author:
    name: "<Your Name>"
    link: "<e.g. twitter or linkedin url>"
hidden: true
---

[200 words is a rough guide for the length of a summary.
Feel free to go a fair bit over or under if needs be.
The editor will fix any issues with images being rendered too wide/narrow etc.
See README for how to view locally if you wish to (not required. Contact CB if this
is broken for you.)]

### The key idea

A few sentences outlining why the paper is interesting...

Add images where appropriate throughout. This section should always
have at least 1 key figure though.

*Please use high-res images (zoom in for those screenshots!)*

<img src="{{ page.image_dir | append: 'figure_1.png' | relative_url }}" alt="A specific and succinct sentence or two describing the figure (alt text). Valuable for seo and accessibility.">
<figcaption>Figure 1a. If the caption isn't included in the image, it should be added like so.</figcaption>

### [optional] Background

If necessary, a short intro to background matierial needed to understand the method

### Their method

Latex can be included in the standard way, either inline: $R=\sum _{t=0}^{\infty }\gamma ^{t}r_{t}$

Or as a block:

<div>
$$
Q_{t+1}^{A}(s_{t},a_{t})=Q_{t}^{A}(s_{t},a_{t})+\alpha _{t}(s_{t},a_{t})\left(r_{t}+\gamma Q_{t}^{B}\left(s_{t+1},\mathop {\operatorname {arg~max} } _{a}Q_{t}^{A}(s_{t+1},a)\right)-Q_{t}^{A}(s_{t},a_{t})\right).
$$
</div>

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
