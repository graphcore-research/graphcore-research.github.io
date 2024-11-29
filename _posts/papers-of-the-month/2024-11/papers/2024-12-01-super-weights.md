---
title: "The Super Weight in Large Language Models"
paper_authors: "Yu et al."
orgs: "Notre Dame, Apple"
paper_link: "https://arxiv.org/abs/2411.07191"
tags:
    - outliers
    - quantisation
    - LLMs
potm_year: 2024
potm_month: 11
paper_order: 2  # Editor will decide
image_dir: "/assets/images/posts/2024-11/potm/super-weights/"
review_author:
    name: "Luke Prince"
    link: "https://www.linkedin.com/in/lyprince/"
hidden: true
---

### The key idea

A small number of MLP down projection weights appear to be critical for enabling an LLM to construct complete sentences by suppressing stop word probabilities (e.g., `the`, `and`, `.`). Quarantining and preserving these weights drastically improves data-free round-to-nearest quantisation. 

<img class="constrained_img_large" src="{{ page.image_dir | append: 'FIG-Schema.png' | relative_url }}" alt="Schema describing the super weight phenomena on stopword probabilities">

### Their method

The authors start by asking the question of how "massive activations" as observed by [Sun2024](https://arxiv.org/abs/2402.17762) (see [our summary in a previous month](https://graphcore-research.github.io/papers-of-the-month/low-rank-galore-and-1_58-bit-weights/#massive-activations-in-large-language-models)), are created. These massive activations appear independent of token position in every layer, and appear regardless of input prompt. 

The authors demonstrate that these activations appear to be created by a multiplication of in most cases a single element in the weight matrix that dominates the dot product, i.e., a massive activation $y_{ij}$ is simply

$y_{ij} = \sum_k x_{ik}w_{jk} \approx x_{im}w_{jm}$

where `m` is the row index of the weight matrix `W` and column index of input activations `X`.

These super weights are not always the largest in the weight matrix. They demonstrate that this super weight can be found simply be feeding in an arbitrary prompt, locating the output massive activation, then iteratively pruning weights until the massive activation is diminished. In most cases only a single weight needs to be removed.

<img class="constrained_img_large" src="{{ page.image_dir | append: 'FIG-Identification.png' | relative_url }}" alt="Method for scanning weights to find the super weight">

The authors provide a super useful table so that you can go and look-up these super weights for yourself.  

<img class="constrained_img_large" src="{{ page.image_dir | append: 'TBL-Directory.png' | relative_url }}" alt="Lookup table for where to find super weights on huggingface">

### Results

The most striking result is that single weights appear to be critical for an LLM to be able to generate coherent sentences. Removing these super weights often reduced QA task performance to near chance level in all open LLMs they tested and severely impact language model perplexity.


<img class="constrained_img_large" src="{{ page.image_dir | append: 'TBL-Importance.png' | relative_url }}" alt="Super weights are critical to LLM function">

They conduct a series of ablations to try to understand the effect of removing super weights. They demonstrate:

1. Restoring super activations despite pruning super weights recovers some loss of performance but not all, indicating super weight has other unknown effects on performance via contributions to other activations.
2. Examining output token probability averaged over 500 input prompts demonstrates that stop-word probability is drastically increased after super weight removal. Sadly, the authors don't unpick this phenomenon.
3. Increasing super-weight magnitude from 1-2x can usually improve model performance on downstream tasks. Outside this range and performance worsens.

<img class="constrained_img_large" src="{{ page.image_dir | append: 'FIG-Ablations.png' | relative_url }}" alt="Super weight removal increases stopword probability and increasing super weight magnitude can improve task performance">

Finally, the authors offer a simple quantisation strategy for preserving super-weights and minimising precision loss of regular weights. They use a simple clipping strategy (requires tuning a hyperparameter) to reduce the effective range for round-to-nearest quantisation, then restore super-weights post-quantisation. 

The authors compare this to naive quantisation (big improvement) and block quantisation (improvement for larger block sizes). Useful as a cheap and easy strategy before trying out methods requiring data for post-training quantisation.

<img class="constrained_img_large" src="{{ page.image_dir | append: 'FIG-BlockQuant.png' | relative_url }}" alt="Handling super weights improve block quantisation for larger block sizes">

### Takeaways

The numerics underlying LLM performance are still something of a mystery. We have a bag of unexplained phenomena, some of which we just try to deal with for a fixed LLM (as in this paper) and some of which we try to deal with for future LLMs, e.g., by creating attention bias terms or stabilising Gated Linear Units. While the authors don't attempt to uncover deep reasons why this might be a useful feature of LLMs that we should capture in a more numerically stable way, the results are striking and the solutions are cheap. 

