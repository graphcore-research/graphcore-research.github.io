---
title: "November: Elastic Inference and Shrinking Formats"
date: 2023-11-01T15:34:30-04:00
categories:
  - papers-of-the-month
tags:
  - inference
  - number-formats
---

November saw several interesting papers on the use of low-precision number formats for
machine learning. Most notable is the publication of a paper by the Open Compute Project
(OCP) on Microsoft's set of MX formats — perhaps the next-big-thing in numerics after
FP8. We've also seen papers on end-to-end 4-bit inference, 1-bit inference, and even
sub-1-bit inference for MoE models (the devil is in the deail here).

Beyond low-precision, we've also seen additional progress made in the space of efficient
inference for LLMs (a key research area in making models easier and cheaper to serve).
Nested Transformers are now able to trade-off inference speed and performance, and
hyperattention is able to facilitate long-context attention in near-linear time.

Here's our summary of the key papers this month:

{% assign image_dir = site.url | append: site.baseurl | append: "/assets/images/posts/2023-11/potm/" %}

## [BitNet: Scaling 1-bit Transformers for LLMs](https://arxiv.org/abs/2310.11453){:target="_blank"}

_Hongyu Wang, Shuming Ma, et al. (Microsoft Research, University of Chinese Academy of Sciences, Tsinghua University)_

{% include_relative bitnet.md %}

## [Tensor Programs VI: Feature Learning in Infinite-Depth Neural Networks](https://arxiv.org/abs/2310.02244v5){:target="_blank"}

_Greg Yang, Dingli Yu, et al. (xAI, Princeton Language and Intelligence, Nvidia, Simons Institute UC Berkeley)_

{% include_relative tensor_programs_vi.md %}