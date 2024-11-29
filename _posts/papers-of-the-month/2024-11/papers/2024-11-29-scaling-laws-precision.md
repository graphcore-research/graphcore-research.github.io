---
title: "Scaling Laws for Precision"
paper_authors: "Tanishq Kumar, et al."
orgs: "Harvard University"
paper_link: "https://arxiv.org/abs/2411.04330"
tags:
    - efficient-inference
    - efficient-training
    - training-dynamics
    - quantisation
    - number-formats
potm_year: 2024
potm_month: 11
paper_order: 1  # Editor will decide
image_dir: "/assets/images/posts/2024-11/potm/scaling-laws-precision/"
review_author:
    name: "Sylvain Viguier"
    link: "https://www.linkedin.com/in/sylvainviguier/"
hidden: true
---

### The key idea

The paper “Scaling Laws for Precision” augments current scaling laws, which primarily focus on tradeoffs between model size, data, and compute, by incorporating the effects of reduced precision on training and inference in language models. It introduces precision-aware scaling laws to better balance performance and computational efficiency. While reduced precision can lower costs, it risks degrading model quality. The authors focus on two scenarios: (1) low-precision training, where weights, activations, and attention are quantized, and (2) post-training quantization, where only weights are typically quantized for inference.

<img src="{{ page.image_dir | append: 'figure_1.png' | relative_url }}" alt="The mathematical scaling law for precision that is presented">
<figcaption>Equation 1.</figcaption>

### Their method

To establish these scaling laws, the authors conducted 465 training runs using floating-point (FP) precision for practical relevance, and subsequently derived scaling laws based on integer (INT) quantization to avoid dealing with mantissa vs. exponent considerations which they leave to further research.

### Results

There are two main findings in this paper:

1.	Optimal precision balance: The optimal precision for training using floating-point format lies around 7-8 bits, challenging current practices of 16-bit training and the push toward ultra-low precision like 4-bit. More generally, training larger models in lower precision can be compute-optimal.

<img src="{{ page.image_dir | append: 'figure_2.png' | relative_url }}" alt="Final validation loss vs. Training precision and Model Size">
<figcaption>Figure 1: Schematic of key findings</figcaption>

2.	Post-training quantization risks for overtrained models: More pretraining data makes models increasingly sensitive to post-training quantization.

<img src="{{ page.image_dir | append: 'figure_3.png' | relative_url }}" alt="Post-Quantizaton validation loss vs. Token/Parameter ratio">
<figcaption>Figure 1: Schematic of key findings</figcaption>

### Takeaways

invites further empirical validation to confirm these laws under broader setups. Additionally, new precision formats like micro-exponent floating-point (MXFP) or logarithmic compression (NF) are not yet included. Lastly, the experimentation only considers loss value and not downstream evaluations results.

In conclusion, this study offers strong guidelines for optimizing model precision across training and inference. However, the laws are somewhat generic and will require adaptation to specific architectures, tasks, or hardware to fully capture their practical implications.