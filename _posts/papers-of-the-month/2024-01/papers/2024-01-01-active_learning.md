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
image_dir: "/assets/images/posts/2024-01/potm/active_learning"
hidden: true
--- 

### The key idea

Co-training a small model with a large model is an efficient strategy for filtering datasets to save on overall training costs.

### Background

During training, it is wasteful to spend time computing low magnitude or high variance gradients that will contribute little to a weight update after averaging and accumulating. How do you go about detecting such examples?

An obvious method for low magnitude gradients would be to compute the loss for all of the elements in your batch and select only the proportion $p$ with the largest values to compute gradients for. For a fixed size dataset we would get a $1-(1+2p)/3$ reduction in FLOPs, e.g., throwing away $1/2$ of your samples results in a $1/3$ decrease in FLOPs. This kind of approach is good at eliminating "easy" examples, it is not so good at eliminating unhelpful noisy examples. 

More sophisticated approaches try to formalise a *learnability* criterion to select examples that are neither too easy nor too hard (noisy) to predict.

![Learnability Criterion]({{page.image_dir | append: "EQN-Learnability.png" | relative_url}})

With the score defining an example as "learnable" if the model being trained has high loss for the example and a "well-trained" reference model has low loss.

When accounting for the cost of training and inference for the reference model, current approaches aren't able to offer a net reduction in training costs.

### Method

![Learnability Criterion]({{page.image_dir | append: "ALG-Policy.png" | relative_url}})

The authors propose using a small model and maintaining two sets of weights for it: reference "well-trained" weights $\theta_r$ and online "co-trained" weights $\theta_o$. The learnability score calculated with these two sets of weights on the full batch is used to select a subset of the batch for training the larger learner model $\theta_l$.

At this point a trade-off emerges. A smaller scoring model eliminates fewer examples, but introduces smaller overheads to training. 

![Amortisation of training costs]({{page.image_dir | append: "FIG-Amortisation.png" | relative_url}})

### Results

