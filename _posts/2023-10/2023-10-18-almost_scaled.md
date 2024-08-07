---
title: "Almost-scaled dot-product attention"
date: 2023-10-18T01:00:00-00:00
header:
    teaser: /assets/images/posts/2023-10/almost_scaled/attention_scaling.png
    image: /assets/images/posts/2023-10/almost_scaled/attention_scaling.png
    og_image: /assets/images/posts/2023-10/almost_scaled/attention_scaling.png

layout: single
category: "posts"
tags:
    - unit-scaling
    - training-dynamics
toc: true
toc_sticky: true
toc_label: "Almost-scaled attention"
toc_icon: "book"
image_dir: "/assets/images/posts/2023-10/almost_scaled/"
author: Douglas Orr
---

TL;DR: _Scaled dot product attention isn't properly scaled, and that's a good thing!_

Notebook: _[almost-scaled dot-product attention](https://github.com/graphcore-research/unit-scaling/tree/main/analysis/almost_scaled_dot_product_attention/almost_scaled_dot_product_attention.ipynb)_

---

Transformers seem to be all you need, but we don't fully understand why they work so well. While working on [unit scaling](https://arxiv.org/abs/2303.11257), we noticed something surprising about attention, the heart of the transformer architecture, and how the outputs are scaled.

Many deep learning modules are designed and initialised to roughly preserve variance in the forward and/or backward (gradient) passes. This is a useful property as the behaviour of many modules depends on the scale of their inputs (e.g. saturating nonlinearities). Dot product attention explicitly includes a <span style="color: #008000">scaling factor</span> for this to ensure the variance going into the softmax is stable:

<div>
$$
A^{\prime} = Q K^T \cdot \color{green}{d_{head}^{-1/2}} \\
Z = \mathrm{Softmax}(A^{\prime})\, V
$$
</div>

But this is _insufficient for the attention operation as a whole_. We have derived a <span style="color: #fc4349">post-scaling factor</span> for attention to correct this:

<div>
$$
Z = \mathrm{Softmax}(A^{\prime})\, V \color{red}{\,\cdot\, (d_{seq}/e)^{1/2}}
$$
</div>

Where $d_{seq}$ is the sequence length. For example, this gives the following scaling behaviour:

![attention scaling: regular attention is underscaled to sigma=0.1 when d_seq=256, but scaled to sigma=1.0 when using a sqrt(d_seq/e) multiplier]({{ page.image_dir | append: 'attention_scaling.png' | relative_url }}){:class="constrained_img"}

In this post, we'll look at the variance-scaling behaviour of attention, and explain this scaling factor, before seeing that it makes training dynamics _worse_, not better. The post is a condensed summary of our [almost-scaled dot-product attention notebook](https://github.com/graphcore-research/unit-scaling/tree/main/analysis/almost_scaled_dot_product_attention/almost_scaled_dot_product_attention.ipynb).

## Where does $(d_{seq}/e)^{1/2}$ come from?

Attention contains the expression $Z=\mathrm{Softmax}(A^{\prime})V$. If we modify this slightly to introduce a temperature $t$, $Z=\mathrm{Softmax}(A^{\prime}/t)V$, we can think about three cases (assuming $V \sim N(0, 1)$):

 - $t\to \infty$, the scale of $Z$ is $d_{seq}^{-1/2}$ — the softmax output is flat with all values $= d_{seq}^{-1}$, followed by a sum over $d_{seq}$ uncorrelated values which scales up by $d_{seq}^{1/2}$
 - $t\to 0$, the scale of $Z$ is $1$ and the output is a single unit spike — attention selects a single element of $V$
 - $t \gt 1/2$, the scale of $Z$ is $(e^{t^{-2}}/d_{seq})^{1/2}$ and with some assumptions, the output follows a log-normal distribution — we explain this further in the [companion notebook](https://github.com/graphcore-research/unit-scaling/tree/main/analysis/almost_scaled_dot_product_attention/almost_scaled_dot_product_attention.ipynb)

![effect of softmax temperature, flat when temperature is infinite, a spike when temperature is zero and a bumpy corve when temperature is one]({{ page.image_dir | append: 'softmax_temperature.png' | relative_url }}){:class="constrained_img"}

We find that the log-normal scaling rule works well for temperature near 1, so propose multiplying by the inverse, i.e. scale attention output by $(d_{seq}/e)^{1/2}$.

## Does it work? ...No!

We tested this change, introducing "fully scaled attention" in a full transformer model—a small autoregressive character language model trained on Shakespeare. This is what we saw from a learning rate sweep:

![learning rate sweep for baseline (standard attention) and fully scaled attention. Fully scaled attention behaves worse than the baseline (final training loss 1.2 for baseline, 1.4 for fully scaled)]({{ page.image_dir | append: 'scaled_attention_lr_sweep.png' | relative_url }}){:class="constrained_img"}

This is most unfortunate. It seems that under-scaled tensors coming out of the attention block are important and helpful for transformer training dynamics. It isn't just tiny Shakespare models—we've also seen this effect when training BERT. We don't yet have an explanation for this difference, but find it intriguing that such a (presumed) accident of under-scaling turns out to be helpful for training dynamics!

Unit scaling has a solution for this, allowing unit-scaled tensors while retaining the original training dynamics. The bad training behaviour must come from scale-dependent operations, in particular when attention's residual output is added to the skip connection. So, we found that we can reproduce the same dynamics as the original model by applying a relative weight to the residual vs skip connections.

## Conclusion

It is helpful to think through the scales of tensors in deep learning models. Indeed, careful reasoning about scale is the core principle underpinning unit scaling (which also considers the scale of gradients, not just activations).

In the above example, we saw how to "fix" attention's scaling behaviour, multiplying the outputs by $(d_{seq}/e)^{1/2}$, so that the outputs are unit-variance. However we also saw that this change can make training dynamics worse, not better. Why this happens is, as far as we know, an open question.

If you're interested to find out more, check out our [accompanying notebook](https://github.com/graphcore-research/unit-scaling/tree/main/analysis/almost_scaled_dot_product_attention/almost_scaled_dot_product_attention.ipynb) and [unit scaling](https://arxiv.org/abs/2303.11257) paper.

---

With thanks to Charlie Blake for help & feedback.

— Douglas Orr ([douglaso@graphcore.ai](mailto:douglaso@graphcore.ai)), October 2023
