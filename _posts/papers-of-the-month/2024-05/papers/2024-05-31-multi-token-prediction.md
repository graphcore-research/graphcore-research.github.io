---
title: "Better & Faster Large Language Models via Multi-token Prediction"
paper_authors: "Fabian Gloeckle, et al"
orgs: "FAIR at Meta"
paper_link: "https://arxiv.org/abs/2404.19737"
tags:
    - LLMs
    - training-efficiency
potm_year: 2024
potm_month: 5
paper_order: 3  # Editor will decide
image_dir: "/assets/images/posts/2024-05/potm/multi-token-prediction/"
review_author:
    name: "Luka Ribar"
    link: "https://x.com/luka_ribar"
hidden: true
---

### The key idea

Large language models are usually trained using the next-token prediction loss. The authors propose training the model to predict *multiple* tokens at a time instead, while still generating a single token at a time at inference as usual. By training models up to 13B parameter in size, they show that this can lead to models with better performance, particularly at coding tasks.


<img src="{{ page.image_dir | append: 'figure_1.png' | relative_url }}" alt="Overview of multi-token prediction.">
<figcaption>Multi-token prediction: Each output head predicts a token (4-token prediction shown), while only the first head is employed during inference. The training scheme improves performance on MBPP coding task as models get larger.</figcaption>


### Their method

In order to enable multi-token prediction, the authors propose a simple modification to the standard transformer architecture. The final output embedding is fed into $n$ parallel output heads, each a single standard transformer layer. This effectively means that the final transformer layer is replaced by $n$ parallel transformer layers. The outputs of each head are then passed through a shared unembedding projection, generating a probability distribution over the whole vocabulary for each head. During training, each head is then trained to predict one of the next $n$ tokens for each training example. In order to minimise maximum memory usage during training, the forward/backward passes on each head are performed sequentially (Figure 2).

<img src="{{ page.image_dir | append: 'figure_2.png' | relative_url }}" alt="Forward/backward pass for multi-token prediction.">

During inference, all but the output of the first head are discarded, and tokens are generated one-by-one as with the standard transformer architecture. However, multiple-token prediction can be used to speed-up inference using *self-speculative decoding*, i.e. by using the $n$ generated tokens as an initial sequence draft, and validating the sequence with just the next-token head in parallel.

### Results

* Improvement was only observed *at scale* - improvements were strongest for the largest models.
* Observed 3x speedup using speculative decoding with 7B 4-token prediction model.
* Optimal $n$ was empirically found to be 4 for token-based models, and 8 for byte-based models.
* Unlike coding tasks, on natural language tasks the performance does degrade compared to the next-token baseline.

### Takeaways

The results of the paper are promising, as they show multi-token prediction can indeed lead to improved performance at scale, particularly at coding tasks, while at the same time providing a more suitable drafting model for speculative-sampling inference. The results hint at the possible benefits of teaching the model to "plan ahead" compared to the standard next-token prediction, and may lead to exciting alternatives to the widely-adopted token-by-token generation.
