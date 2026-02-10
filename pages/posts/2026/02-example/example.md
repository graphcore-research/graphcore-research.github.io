---
title: "Example post"
date: 2026-02-01
categories: ["Articles"]
authors: [douglaso]
tags:
  - example
slug: example-post
---

Demonstrate/test various formatting features including [images](#images).

<!-- more -->

 - [images](#images)
 - [tables](#tables)
 - [code blocks](#code)
 - [latex equations](#latex)
 - [inline HTML](#inline-html)

## Images

![Alt text](block_absmax.svg)

![Alt text](block_absmax.svg){ style="width:100%" }

## Tables

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| R1C1 | R1C2 | R1C3 |
| R2C1 | R2C2 | R2C3 |

## Code

Inline `rmsnorm(x)` and block:

```python
import torch
from torch import nn, Tensor

def rms_norm(x: Tensor, eps: float = 1e-8) -> Tensor:
    return x / x.pow(2).mean(dim=-1, keepdim=True).add(eps).sqrt()
```

!!! note "Big claim"

    This house believes that Markdown is better than RST, in all cases, for all purposes, and that anyone who disagrees is wrong.

    !!! warning "Disclaimer"

        I haven't used RST.

## Latex

Inline $\boldsymbol{y} = \mathrm{rmsnorm}(\boldsymbol{x})$ and block:

$$
\mathrm{rmsnorm}(\boldsymbol{x}) = \frac{\boldsymbol{x}}{\sqrt{\frac{1}{d}\sum_{i=1}^d x_i^2 + \epsilon}}
$$

## Inline HTML

To use markdown within HTML elements, use `<tag markdown>...</tag>`, e.g.,

<p markdown>Foo is **barred**.</p>

If multi-level (e.g. details/summary), use `markdown` on all levels, e.g.,

<details markdown>
  <summary>Juicy details</summary>
  <p markdown>Inline HTML. Markdown too - I feel **bold** and $\sqrt{-1}$ is _hungry_.</p>
</details>
