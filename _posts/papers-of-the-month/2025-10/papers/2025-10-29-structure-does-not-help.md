---
title: "When Structure Doesn’t Help: LLMs Do Not Read Text-Attributed Graphs as Effectively as We Expected"
paper_authors: "Haotian Xu, Yuning You, Tengfei Ma"
orgs: "Stony Brook University, The Chinese University of Hong Kong"
paper_link: "https://openreview.net/forum?id=ijQTdlHJze"
tags:
    - GNNs
    - LLMs
    - graph-learning
potm_year: 2025
potm_month: 10
paper_order: 1  # Editor will decide
image_dir: "/assets/images/posts/2025-10/potm/structure-does-not-help/"
review_author:
    name: "Kheeran K. Naidu"
    link: "https://kheerannaidu.com/"
hidden: true
---

### The key idea

The authors take a systematic study into understanding the effectiveness of LLM-based graph learning on text-attributed graphs (TAGs). They show that for node classification, link prediction, and molecular property prediction, a simple MLP using only the node descriptions has comparable results (and better in the case of node classification) to using GNNs for graph representation -- see Figure 1. Furthermore, for node classification and link prediction in a templated graph learning setting, carefully representing graph structure does not provide gains over limited or even no representation -- see Figure 2.

<img src="{{ page.image_dir | append: 'figure_1.png' | relative_url }}" alt="Figure 1. Tables evaluating the effectiveness of message passing in GNNs compared to a simple MLP baseline. GNNs are at best marginally better for node classification, link prediction, and molecular property prediction.">
<figcaption>Figure 1. These tables evaluate the effectiveness of message passing in GNNs compared to a simple MLP baseline. <bold>Best</bold> results are bolded and <underline>second best</underline> results are underlined.</figcaption>
<img src="{{ page.image_dir | append: 'figure_2.png' | relative_url }}" alt="Figure 2. A table evaluating the effectiveness template-based graph learning with full (ND), limited (HN), and no (CO) graph structure representation. Full graph structure underperforms for both node classification and link prediction.">
<figcaption>Figure 2. This table evaluates the effectiveness template-based graph learning using full (ND), limited (HN), and no (CO) graph structure representation. <bold>Best</bold> results are bolded.</figcaption>
<!-- ### [optional] Background
Maybe write about LLaGA and GraphToken if time allows... -->

### Their method and results

The authors consider the graph-based tasks of node classification, link prediction and molecular property prediction. Although node classification and link prediction are natural tasks on graphs, these tasks on TAGs are often correlated with node descriptions. Therefore, they also include molecular property prediction which is known to rely more on the intrinsic graph structure of the molecule.

To evaluate these tasks, the authors consider two key LLM-based graph learning techniques: (1) generic graph learning with GNNs using the [GraphToken](https://arxiv.org/abs/2402.05862) framework, and (2) templated graph learning with [LLaGA](https://arxiv.org/abs/2402.08170). See Figure 3 for an overview.

<img src="{{ page.image_dir | append: 'figure_3.png' | relative_url }}" alt="Figure 3. A high-level overview of LLM-based graph learning. The left shows examples of the graph structures that are represented. The middle illustrates both template-based and generic GNN-based methods. The right outlines the pipeline to align the graph's structure into LLMs.">
<figcaption>Figure 3. A high-level overview of LLM-based graph learning. The left shows examples of the graph structures that are represented. The middle illustrates both template-based and generic GNN-based methods. The right outlines the pipeline to align the graph's structure into LLMs.</figcaption>

#### Generic graph learning

The authors use the GraphToken framework as the basis for generic structural encoding via GNNs. They consider several GNN backbones with this framework -- a Graph Convolutional Network (GCN), a Graph Attention Network (GAT), and a Graph Isomorphic Network (GIN) -- and compare them to a simple MLP in lieu of a GNN in this framework.
Their results, presented in Figure 1, show that the message passing protocols of GNNs do not provide a significant improvement over a simple MLP that does not incorporate the graph's structural information.

#### Templated graph learning
The authors use LLaGA's framework as the basis for templated structural encoding via [Laplacian positional embeddings](https://arxiv.org/abs/2012.09699). They compare LLaGA's Neighborhood Detail (ND) template, which captures the local structure of each node as a sequence of nodes (full structural representation), with two different baselines: (a) Hop Neighbor (HN), which is a random subset of k-hop neighbors from each node to form the sequence of nodes (limited structural representation), and (b) Center Only (CO), which only uses the description of each node (no structural representation). Their results, presented in Figure 2, show that the carefully curated sequence of nodes of ND underperforms on both node classification and link prediction (note that the results for molecular property prediction are not given).

### Conclusion
In this blog post, we have reviewed a subset of results presented by the authors (do check out their paper for other results). These results highlight the increasing strength of LLMs for graph learning tasks on TAGs. It shows that incorporating only the node textual descriptions achieves good performance, and that structural encodings offer marginal gains at best. This raises the question of whether the added complexity required to incorporate graph structure into LLMs is worth it.