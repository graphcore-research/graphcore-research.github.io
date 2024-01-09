---
title: "Simplifying Transformer Blocks"
paper_authors: "Bobby He, Thomas Hofmann"
orgs: "ETH Zurich"
paper_link: "https://arxiv.org/abs/2311.01906"
tags:
  - transformers
  - LLMs
  - signal-propagation
potm_year: 2023
potm_month: 12
paper_order: 2
image_dir: "/assets/images/posts/2023-12/potm/simplifying_transformer_blocks/"
review_author: "Luka Ribar"
hidden: true
---

### The key idea

*Are there any parts of the standard transformer architecture that can be simplified without diminishing performance?*

The authors propose several simplifications to the conventional transformer blocks with no loss in training speed, parallelising attention and MLP layers while fully removing skip connections, value and projection parameters, as well as normalisation layers.

![image]({{ page.image_dir | append: "figure_1.png" | relative_url }})

### Their method

The authors utilise signal propagation theory as well as empirical evidence to motivate the proposed architectural changes. Notably, they observed:

* Skip connections can be safely removed from the attention and MLP layers without affecting training performance, as long as they are appropriately compensated by changes to weight initialisations.
* Fixing the skip connection issues allowed the authors to remove the value and projection matmuls from the attention layers altogether without further degradation.
* Normalisation layers implicitly down-weight residual branches: as this is achieved in the first two steps, they can also be removed. However, the authors note that leaving the normalisation layers led to a slight improvement in training loss.

### Results

![image]({{ page.image_dir | append: "figure_5_7.png" | relative_url }})

The authors tested the simplified transformer architecture on both decoder-only model training (Figure 5) and encoder-only training (Figure 7). In both cases, they find that their architecture (SAS/SAS-P) is able to reach baseline performance, while providing ~15% throughput boost.

### Takeaways

The paper gives good insight into why some of the standard architectural choices are needed in transformer models, and how these can be addressed differently through weight reparametrisation/initialisation. The models investigated are relatively small in size (100-300M), so more evidence is needed to show the practicality of the changes at larger model sizes.
