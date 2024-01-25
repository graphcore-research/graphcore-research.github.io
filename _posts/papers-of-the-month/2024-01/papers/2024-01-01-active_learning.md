---
title: "Bad Students Make Great Teachers: Active Learning Accelerates Large-Scale Visual Understanding"
paper_authors: "Talfan Evans, Shreya Pathak, Hamza Merzic, et al."
orgs: "Google DeepMind"
paper_link: "https://arxiv.org/abs/2312.05328"
tags:
    - active-learning
    - multi-modal
    - efficient-training
potm_year: 2024
potm_month: 1
paper_order: 1
image_dir: "/assets/images/posts/2023-01/potm/active_learning
hidden: true
--- 

### The key idea

A small model co-trained with a large model can estimate example difficulty when filtering datasets for training sufficiently well to save on overall training costs.

### Background

During training, it is pretty wasteful to spend time computing gradients for examples that are so small they will contribute little to a weight update after averaging and accumulating. So how do you go about filtering out examples that produce small gradient signals?

An obvious method would be to compute the loss for all of the elements in your batch and select only the proportion $p$ with the largest values to compute gradients for. For a fixed size dataset we would get a $1-(1+2p)/3$ reduction in FLOPs, e.g., throwing away $1/2$ of your samples results in a $1/3$ decrease in FLOPs. 

However, this is only worthwhile if you can achieve the same task performance without needing to increase dataset size. Up until now, nobody has found a strategy with a real perf/FLOP gain.

### Method


### Results

