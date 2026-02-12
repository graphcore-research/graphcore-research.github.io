---
date: 2024-04-30
categories:
- Papers of the Month
title: 'April Papers: TriForce, QuaRot & Mixture-of-Depths'
merge_potm: true
---

For our April selection of AI research papers, there is a clear common thread: efficient LLM inference. But as it happens, ML researchers are showing there are many creative ways to make our LLMs run faster.

The first paper, TriForce, looks at efficient LLM inference from the angle of combining *speculative decoding* and *sparse KV techniques* (which could be for instance our recent Graphcore [SparQ method](https://arxiv.org/abs/2312.04985)), showing that a combined hierarchical approach speeds up inference compared to standard LLM speculative sampling.

The second highlighted work, QuaRot, is taking a more classic, but loved by Graphcore Research team, quantisation route. It elegantly demonstrates how to use Hadamard transforms to solve the outlier problem in the distribution of LLM activations, opening the door to full (i.e. weights, activations and KV cache) LLM 4-bit quantisation with minimal accuracy loss.

Finally, the last paper, Mixture-of-Depths, presents how LLMs can learn to dynamically and independently allocate FLOPs to tokens, achieving better accuracy for the same compute budget. This research work leverages the routing idea from Mixture-of-Experts (MoE) transformers by allowing the model to decide for each layer which tokens should take a standard route (with the FLOPs cost associated with the layer) or a zero FLOPs skip connection.

