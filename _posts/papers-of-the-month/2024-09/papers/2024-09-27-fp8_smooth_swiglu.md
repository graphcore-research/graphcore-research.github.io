---
title: "Scaling FP8 training to trillion-token LLMs"
paper_authors: "<Forename Surname, et al.' or 'Forename Surname, Forename Surname and Forename Surname.' (max 3 unless >3 first authors)>"
orgs: "Habana Labs, Technion"
paper_link: "https://arxiv.org/abs/2409.12517"
tags:
    - efficient-inference
    - quantisation
potm_year: 2024
potm_month: 9
paper_order: 1
image_dir: "/assets/images/posts/2024-09/potm/fp8_smooth_swiglu/"
review_author:
    name: "Paul Balanca"
    link: "https://www.linkedin.com/in/paulbalanca"
hidden: true
---


### The key idea

Building upon a recent literature on low-precision FP8 training, the authors investigates the FP8 training 
stability of trillion-token LLMs (~20 fold increase over previous published work). Uncovering a new form of 
critical instability, they present an improved *Smooth-SwiGLU* activation function which prevents activation 
spikes (i.e. outliers) of diverging training of LLMs. 


<img src="{{ page.image_dir | append: 'fp8-training-instable.png' | relative_url }}" alt="Training instability in FP8 due to SwiGLU.">
<figcaption>Training instability in FP8 due to SwiGLU activation function.</figcaption>


### Background

Machine learning researchers, especially in AI hardware companies, have been investigating for the last couple of years which
8-bit floating formats are suitable for neural networks training and inference. The literature on the subject converges towards 
the definition of two formats: **E4M3** and **E5M2**. The former being used to represent weights and activations, while the latter
is used for gradients, which requires a higher dynamic range.

Due to the much smaller dynamic range compared to BF16 (which is commonly used in training of LLMs), FP8 LLM training requires ad-hoc
per tensor scaling using data statistics (usually the absolute-max) in order to keep training stable. 

Most of the FP8 literature has focused on small to mid scale experiments (at most 100B tokens training), and presented in this work, 
late stage LLMs training also presents numerical stability challenges, with large outliers appearing in the transformer feed-forward layer.

### Their method

As presented the figure above, instabilities appear in late FP8 training of large LLMs. In this work, the authors narrow down the issue
to the quadratic form of the *SwiGLU* activation function when combined with weight alignement. Experimental training data shows that
large outliers are appearing more often during late training due to the correlation between `w1` and `w2` SwiGLU weights (which are uncorrelated initially).

<img src="{{ page.image_dir | append: 'fp8-swiglu-hist.png' | relative_url }}" alt="SwiGLU weights correlation and outliers.">
<figcaption>SwiGLU weights correlation and outliers.</figcaption>

These outliers will lead to underflow or overflow during FP8 quantization when combined with delayed scaling, as the latter technique relies on 
the previous batch statistics for optimal hardware usage. In order to circumvent this issue, the authors introduce a new *smooth SwiGLU* activation
function which incorporates channel scaling correction prior to FP8 casting, i.e.:

<img src="{{ page.image_dir | append: 'fp8-smooth-swiglu.png' | relative_url }}" alt="Smooth-SwiGLU channel scaling.">

As presented by the authors, channel max-scaling is well suited to hardware accelerator as each chunk of data can be treated in parallel, and the resulting
rescaling can be fused into the FP8 quantization of input activations $x$ and weights $w3$ (third MLP layer):

<img src="{{ page.image_dir | append: 'fp8-smooth-swiglu2.png' | relative_url }}" alt="Smooth-SwiGLU definition.">
<figcaption>Smooth-SwiGLU definition.</figcaption>

We note that the introduction of the *smooth-SwiGLU* activation preserves the overall FFN definition (from a mathematical point of view): additional channel scaling factors are compensated later in the network in the third MLP layer. Interestingly, Graphcore Research has also adopted a similar approach in our recent [Scalify](https://github.com/graphcore-research/jax-scalify/) work: incorporating additional scaling in neural network to improve numerical stability while keeping the same model definition.  

### Results

Training experiments on a 7B Llama2 model show the improved stability of FP8 LLM training when using the activation *smooth-SwiGLU*: training loss as well as zero shot downstream tasks match the BF16 baseline. The use of *smooth-SwiGLU* only leads to a small drop of FP8 training acceleration, from 37% to 34%, due to the additional channel rescaling.

<img src="{{ page.image_dir | append: 'fp8-smooth-swiglu-training.png' | relative_url }}" alt="FP8 LLM training with Smooth-SwiGLU.">
<figcaption>FP8 LLM training with Smooth-SwiGLU.</figcaption>

Additionally, the authors also demonstrate that the FP8 E5M2 format can be used for storing Adam optimizer second moment (as presented in previous works, the first moment can be represented using E4M3). 
