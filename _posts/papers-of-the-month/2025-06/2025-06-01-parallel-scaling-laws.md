---
title: "Parallel Scaling Laws for Language Models"
paper_authors: "Mouxiang Chen et al."
orgs: "Zhejiang University, Qwen Team, Alibaba Group"
paper_link: "https://arxiv.org/abs/2505.10475"
tags:
potm_year: 2025
potm_month: 6
paper_order: 1 # Editor will decide
image_dir: "/assets/images/posts/2025-06/potm/parallel-scaling-laws/"
review_author:
  name: "Tom Pollak"
  link: "https://www.linkedin.com/in/tompollak/"
hidden: false
---

### The key idea

Researches at Qwen introduce a new dimension of scaling: parallel forward passes. Their method, PARSCALE, runs $P$ parallel copies of a model, each with a different learned prefix. They find that running $P$ parallel passes is equivalent to scaling the model parameters by $O(\log P)$.

<br>
<img class="constrained_img" src="{{ page.image_dir | append: 'three-scaling-approaches.png' | relative_url }}">
<figcaption>Three parallel scaling approaches: Parameter, Inference time, and Parallel computation.</figcaption>

### Background

The approach comes from a practical inference bottleneck: for large models, single batch inference can be memory-bound, especially on resource constrained edge devices. Rather than increasing model size or generating more reasoning steps PARSCALE aims to scale a new axis, parallel computation, to keep model size approximately constant.

Inspired by techniques like Classifier-Free Guidance (CFG), PARSCALE hypothesizes:

> Scaling parallel computation (while maintaining the nearly constant parameters) enhances the model’s capability, with similar effects as scaling parameters.

### Methodology

PARSCALE executes $P$ forward passes in parallel, each conditioned with a unique learned prefix. Outputs of the different streams are combined using a learned aggregation MLP. Conceptually this is similar to ensembling, but with almost complete parameter sharing between the members (~0.2% extra per stream).

Unlike inference-time tricks (e.g. beam search), the diversity between streams in PARSCALE is learned during training and used at inference, enabling more effective use of parallelism.

The method was tested both in pre-training (up to 1T tokens) and in post-training (LoRA-style) settings.

### Results

<img class="constrained_img" src="{{ page.image_dir | append: 'parscale-loss-contours.png' | relative_url }}">
<figcaption>PARSCALE results: Parameter, Inference time, and Parallel computation.</figcaption>

#### Coding Tasks (Stack-V2-Python)

| Model Params | P  | HumanEval+ (%) |
|--------------|----|----------------|
| 1.6B         | 1  | 33.9           |
| 1.6B         | 8  | 39.1           |
| 4.4B         | 1  | 39.2           |

#### General Tasks (Pile)

| Model Params | P  | Avg Score (%) |
|--------------|----|---------------|
| 1.6B         | 1  | 53.1          |
| 1.6B         | 8  | 55.7          |
| 2.8B         | 1  | 55.2          |


For a 1.6B model, scaling to $P=8$ parallel streams achieves performance comparable with a 4.4B model on coding tasks. This uses 22x less memory and 6x the latency compared to parameter scaling.

### Takeaways

PARSCALE provides a new axis in which to boost model capability, particuarly in resource constrained single batch inference. However KV cache grows linearly with the number of parallel streams ($P$) so less useful on long-context tasks. The paper is limited to a small number of streams, so it is an open question as to whether $O(\log P)$ scaling holds for $P \lt \lt 8$
