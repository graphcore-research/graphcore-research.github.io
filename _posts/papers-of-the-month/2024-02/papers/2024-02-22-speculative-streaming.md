---
title: "Speculative Streaming: Fast LLM Inference without Auxiliary Models"
paper_authors: "Nikhil Bhendawade et al."
orgs: "Apple"
paper_link: "https://arxiv.org/abs/2402.11131"
tags:
  - speculative-decoding
  - inference
  - LLMs
potm_year: 2024
potm_month: 2
paper_order: 1
image_dir: "/assets/images/posts/2024-02/potm/speculative_streaming/"
review_author:
  name: "Charlie Blake"
  link: "https://twitter.com/thecharlieblake"
hidden: true
---

### The key idea

Speculative decoding is great for speeding up LLM inference, but has the downside of requiring a well-aligned external draft model. Speculative streaming addresses this by fine-tuning a model to produce its own tree of draft tokens in one parallel inference step.

<img class="constrained_img_large" src="{{ page.image_dir | append: 'figure_1.png' | relative_url }}" alt="Figure showing the standard operation of speculative decoding (left) and speculative streaming (right). Speculative decoding uses a separate draft model, whereas speculative decoding uses stream insertion to generate an internal set of draft tokens.">

### Background

Over the last year a method known as _speculative decoding_ (or _speculative sampling_) has become popular for LLM inference. This works by using a smaller _draft_ model alongside the main _target_ model, whose job it is to generate a sequence of draft tokens at each step. The target model then verifies those proposed tokens (checking to see if they are sufficiently aligned with it's own probability model) and accepts them up to some point in the draft sequence. Accepted tokens become part of the "true" output of the model and rejected ones are disposed of.

This process has two crucial properties that make it appealing:

1. The target model can verify draft tokens in parallel. This makes it more efficient than typical token-by-token generation.
2. Due to some neat maths, the accept/reject process means that the distribution of the tokens is exactly that of the target model. I.e. there is no degradation when using speculative decoding!

However speculative decoding can be painful in practice. Off-the-shelf draft models can give quite different predictions to the target model so often need fine-tuning for alignment, and running two models simultaneously can be tricky, both in terms of implementation complexity and memory overhead.

### Their method

The authors address this by adapting existing models and fine-tuning, such that the model can generate its own draft tokens while it does a standard speculative decoding inference step with the previous draft tokens.

<img src="{{ page.image_dir | append: 'figure_2.png' | relative_url }}" alt="Figure showing the insertion of stream embeddings, tree pruning and tree drafting in the speculative streaming process.">

This is done via a process of _parallel pruning, speculation and verification_. This can be a little tricky to understand, as each inference step is now doing three things: verifying the previous draft tokens, generating a new token after the draft sequence, generating the next draft tokens. It works as follows:

Each iteration takes as input the generated sequence so far, along with a (flattened) tree of draft tokens. After a certain number of regular layers a special pruning layer is reached, which uses the final embedding layer to generate an early prediction of which trees look promising, dropping low-probability branches. This is followed by a stream embedding layer, which uses the regular tokens' hidden state to generate a set of hidden states for a tree of "new" draft tokens — one each of the "input" draft tokens we started with.

These new draft tokens are processed in the usual way until the end of the network, where the model uses the standard speculative decoding accept/reject sampling to decide which "input" draft tokens to accept. We then take the "new" draft tokens generated for that branch as the "input" draft tokens for the next iteration.

Unlike hidden states of regular tokens, stream tokens can't know exactly which other stream tokens precede them as they're generated in parallel. This makes the prediction task harder but also more efficient, which is the right trade-off for a draft model.

### Results

Speculative streaming is substantially faster than regular auto-regressive inference, and is marginally faster than the competing Medusa method (which also adapts a single model to produce a draft) but uses many fewer additional parameters.

Compared with two-model speculative decoding the comparison is harder. Their empirical results show a 2x speedup, but clearly depend on various practical considerations and hyperparameters. More useful is their theoretical analysis showing the regimes in which speculative streaming should give a speedup. This heavily depends on the quality of the respective draft models:

<img class="constrained_img_large" src="{{ page.image_dir | append: 'figure_4.png' | relative_url }}" alt="Figure showing the speculative streaming speedup over draft-based speculative decoding for different ratios of draft to speculative acceptance. Speculative streaming is consistently faster while this ratio is <=1, and otherwise only at low target/draft latency ratios.">

### Takeaways

This is a really neat paper, even if it feels like a bit of a "hack" in the context of auto-regressive LLMs. Predicting multiple tokens in parallel is not really something that LLMs should excel at, and they only get away with it here because of the speculative setting. But because it allows a single model to do both draft and target modelling in a single step, it appears to be worthwhile.

Given all that, their execution of the idea is great. The authors are clearly concerned with making this work in practical settings, which is reflected by their addition of tricks like tree pruning. The results look promising, though it remains to be seen in which areas of their speedup-modelling practical use-cases fall, which will ultimately determine how widely speculative streaming is used.
