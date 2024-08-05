---
title: "Scaling Laws with Vocabulary: Larger Models Deserve Larger Vocabularies"
paper_authors: "Chaofan Tao, et al."
orgs: "The University of Hong Kong, Sea AI Lab, Contextual AI and The Ohio State University"
paper_link: "https://arxiv.org/abs/2407.13623v2"
tags:
    - LLMs
    - scaling-laws # Use https://graphcore-research.github.io/tags/ as reference
potm_year: 2024
potm_month: 7
paper_order: 3  # Editor will decide
image_dir: "/assets/images/posts/2024-07/potm/vocab-scaling/"
review_author:
    name: "Sam Hosegood"
    link: "https://uk.linkedin.com/in/sam-hosegood-86769819b"
hidden: true
---

### The key idea

Scaling laws (e.g. Kaplan, Chinchilla) have proved enormously useful in showing how to most efficiently scale LLMs for a given FLOPs budget but these scaling laws have generally only considered non-vocabulary parameters. This paper attempts to address that issue by calculating scaling laws for the vocabulary parameters and finds that many public LLMs are underparameterised for vocabulary. The authors use three complementary approaches to fit a power law: IsoFLOPs analysis, derivative estimation and parametric fit of the loss function. They show empirically that vocabulary parameters should be scaled with model size but at a slower rate than non-vocabulary parameters.

<img src="{{ page.image_dir | append: 'figure_1.png' | relative_url }}" alt="Graph of non-vocab parameters vs vocab parameters with lines showing the scaling predicted by their methods with all three approaches in good agreement. The LLama models are also included on the plot with their vocabulary parameters scaling slower than the optimal rate from this paper.">


### Their method

The authors use three complementary approaches in the paper. Firstly they use an IsoFLOP analysis wherein a series of models with varying vocabulary parameters were trained with fixed FLOPs and fixed non-vocab parameters. Observing the vocab size at minimum loss for each FLOP budget allowed them to fit power laws for vocab size and non-vocab parameters. 

<img src="{{ page.image_dir | append: 'approach_1.png' | relative_url }}" alt="Fitting results from apprach 1. Power laws are fitted for FLOPs vs non-vocab parameters, vocab parameters and training characters respectively.">

The second approach uses a derivative based method wherein a formula is derived for flops based on a derived formula for FLOPs based on both vocabulary and non-vocabulary parameters as well as training tokens. Then by finding the minimum of this function with respect to vocabulary (V), they can estimate the optimal V under the assumption that it can achieve a certain loss. This feels like quite a strong assumption nonetheless the results match closely with those from approaches 1 and 3. 

Finally, a third approach uses a parametric vocabulary dependent loss formula: 

$ L_u = -E + \frac{A_1}{N_{nv}^{\alpha_{1}}}+\frac{A_2}{N_{v}^{\alpha_{2}}}+\frac{B}{D^{\beta}} $

The first term captures the normalised loss for an ideal generative process and the subsequent terms respectively reflect the effect of non-vocab parameters, vocab parameters and the amount of training data on the loss. Using the experiments from the IsoFLOP analysis the authors can learn the optimal parameters for the loss formula and subsequently predict the optimal vocabulary configuration by finding the minimum point of the loss with respect to the vocabulary. 

The authors find that all three approaches agree closely in that non-vocab parameters should be scaled faster than vocabulary parameters. 

<img src="{{ page.image_dir | append: 'table_1.png' | relative_url }}" alt="A table showing the optimal vocabulary size and vocabulary parameters for various model sizes from 3B to 300B as predicted by their approaches.">

### Results

The authors show their predictions in action by training 3B parameter models with their standard 32K vocab size and comparing this with their predicted optimal vocab size of 35K. They show that this leads to improvements on various benchmarks with only a small adjustment to vocab size.

<img src="{{ page.image_dir | append: 'table_2.png' | relative_url }}" alt="A table showing the performance of a 2.87B parameter model on a range of benchmarks. By amending the vocab size to their predicted optimum they show an improvement across all benchmarks shown.">

The overall takeaway is that according to their analysis, most public LLMs are underparameterised for their vocabulary and that when scaling up model size, vocab size ought to be increased too but at a slower rate than the other parameters. 


