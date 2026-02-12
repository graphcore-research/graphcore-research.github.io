---
tags:
- LLMs
- test-time-compute
- reasoning
- efficient-inference
potm_order: 3
paper_title: 'Soft Thinking: Unlocking the Reasoning Potential of LLMs in Continuous
  Concept Space'
paper_authors: Zhen Zhang et al.
paper_orgs: University of California, Purdue University, LMSYS Org, Microsoft
paper_link: https://arxiv.org/abs/2505.15778
review_authors:
- lukehg
---

### The key idea

Conventional reasoning models generate long reasoning traces, which are typically constrained to the expressivity of the model's vocabulary. The discretisation of reasoning makes it hard to explore multiple paths or ideas, and limits the model's ability to  "think" about abstract concepts, as it is always forced to express its thoughts in natural language.

Recent works have looked into *latent* thoughts, such as [Coconut](https://arxiv.org/abs/2412.06769) and [Latent Reasoning](https://arxiv.org/abs/2502.05171), in which the thoughts are not necessarily discretised tokens, but rather continuous tokens in some latent space. However, training these methods is non-trivial and scaling model size can be very challenging.

In *Soft Thinking*, the authors propose a training-free approach to latent reasoning, in which the "concept tokens" are a probability-weighted mixture of the token embeddings.

![Visualisation of the Soft Thinking method.](./soft-thinking-schematic.png)
<figcaption>Figure 2: Soft Thinking replaces discrete tokens with soft, abstract concept tokens, enabling reasoning in continuous concept space.</figcaption>


### Their method

Typically, reasoning models employ standard LLM inference techniques for generating their reasoning traces: each forward pass $i$ generates a probability distribution over the vocabulary, from which a token $t_i$ is sampled from. This token is then embedded using the embedding matrix $\mathbf{E}$ and injected into the model's input. 

Mathematically, this can be expressed as
<div>
$$
e_{i+1} = \mathbf{E}[t_i]
$$
</div>
such that
<div>
$$
t_i \sim p_i = \mathrm{LLM}(e_1, \cdots,  e_{i-1})
$$
</div>
where $p_i$ is the probability distribution for the $i$th forward pass, and $\mathrm{LLM}$ is the model.

The sampling operation of LLM inference discretises the model's output, limiting its expressivity. In contrast, Soft Thinking proposes taking a probability-weighted mixture of the input token embeddings, making a so-called *concept token*. This means the next input token can be expressed as
<div>
$$
e_{i+1} = \sum_{k=1}^{|V|}p_i[k] \cdot E[k]
$$
</div>

This approach means that the input embedding layer and output head do not need to be weight-tied, which can cause issues for other continuous reasoning approaches such as [Coconut](https://arxiv.org/abs/2412.06769).

As the model no longer injects conventional tokens into the model as part of its reasoning trace, over time the model will be in an out-of-distribution regime. To mitigate this, the authors suggest a cold stop mechanism, which measures the entropy of the concept token, and if it falls below a threshold $\tau$ for some number of consecutive iterations, then a `</think>` token is injected into the sequence to terminate the reasoning trace and commence answer generation. This prevents the model from becoming overconfident, and provides a simple stopping condition for the model to exit latent-thought generation.

### Results
The authors examine Soft Thinking over a number of mathematical and coding tasks, on three different models: QwQ-32B, DeepSeek-R1-DistillQwen-32B, and DeepSeek-R1-Distill-Llama-70B. They find that across all models and tasks, they see an improvement in task performance, and very often a reduction in sequence length, indicating that Soft Thinking enables richer concepts for a given token.

![Results table 1.](./results-table-1.png)
<figcaption>Table 1: Comparison of Soft Thinking and various baseline methods on accuracy and generation length across mathematical datasets. Best results are highlighted in bold.</figcaption>

![Results table 2.](./results-table-2.png)
<figcaption>Table 2: Comparison of Soft Thinking and various baseline methods on accuracy and generation length across coding datasets. Best results are highlighted in bold.</figcaption>

One concern surrounding latent reasoning is difficulty in interpeting the reasoning trace. While [another recent paper](https://arxiv.org/abs/2505.13775) questions the validity of traces to the actual reasoning itself, the Soft Thinking authors are still able to generate legible reasoning traces, simply by examining the highest-probability (discrete) token after each forward pass.

![Probability distribution over a complete reasoning trace.](./probability-distribution.png)
<figcaption>Figure 4: An example illustrating the probability distribution of our proposed Soft Thinking method. At each step, top-$k$ token candidates and their probabilities are shown. Red boxes indicate the selected tokens that form the final generated sequence for readability and interpretability.</figcaption>


### Takeaways

Soft Thinking offers a viable way to imbue pre-trained reasoning models with latent reasoning capabilities which permit abstract concepts in a continuous space, without requiring any additional fine-tuning. As their results demonstrate, this offers the opportunity for greater task performance with shorter sequence lengths. While this work doesn't investigate how we can train models to best use the concept space, it does indicate that research in this direction is likely to bear promising results.
