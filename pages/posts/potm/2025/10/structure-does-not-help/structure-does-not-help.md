---
tags:
- GNNs
- LLMs
- graph-learning
potm_order: 4
paper_title: 'When Structure Doesn’t Help: LLMs Do Not Read Text-Attributed Graphs
  as Effectively as We Expected'
paper_authors: Haotian Xu, Yuning You, Tengfei Ma
paper_orgs: Stony Brook University, The Chinese University of Hong Kong
paper_link: https://openreview.net/forum?id=ijQTdlHJze
review_authors:
- kheerann
---

### The key idea

The authors take a systematic study into understanding the effectiveness of strategies to encode text-attributed graphs (TAGs) for using in LLMs. To that end, they compare standard approaches to LLM-based graph learning: they provide as input to the LLM a description of the task and the graph structure, encoded using either a GNN, an MLP or a template-based method. See Figure 1 for an illustration of the pipeline. 

![Figure 1. A high-level overview of LLM-based graph learning. The left shows examples of the graph structures that are represented. The middle illustrates both template-based and generic GNN-based methods. The right outlines the pipeline to align the graph](./figure_3.png)
<figcaption>Figure 1. A high-level overview of LLM-based graph learning. The left shows examples of the graph structures that are represented. The middle illustrates both template-based and generic GNN-based methods. The right outlines the pipeline to align the graph's structure into LLMs.</figcaption>

In particular, the following is an example of a prompt used for the task of node classification on the Cora dataset:

<blockquote>Given a node-centered graph: < graph >, each node represents a paper, we need to
classify the center node into 7 classes: Case Based, Genetic Algorithms, Neural Networks,
Probabilistic Methods, Reinforcement Learning, Rule Learning, Theory, please tell me which
class the center node belongs to?</blockquote>

<!-- ### Background
Graph learning offers methods for modeling relational and structural data 
LLM-based graph learning methods such as LLaGA and GraphToken have recently been developed to tackle the 
Maybe write about LLaGA and GraphToken if time allows... -->

### Their method and results

The authors consider the graph-based tasks of node classification, link prediction and molecular property prediction. While node classification and link prediction on TAGs are often assisted by node descriptions, molecular property predictions rely more on the intrinsic graph structure of the molecular graph.

To evaluate these tasks, the authors consider two key LLM-based graph learning techniques: 
1. generic graph learning with GNNs using the [GraphToken](https://arxiv.org/abs/2402.05862) framework, and 
2. templated graph learning with [LLaGA](https://arxiv.org/abs/2402.08170).

#### Generic graph learning

The authors use the GraphToken framework as the basis for generic structural encoding via GNNs, which follows the pipeline outlined in Figure 1. They consider several GNN backbones with this framework -- the Graph Convolutional Network (GCN), the Graph Attention Network (GAT), and the Graph Isomorphic Network (GIN) -- and compare them to a simple MLP in lieu of the GNN in this framework.
Their results, presented in Table 1, show that for encoding a graph to use in an LLM, the message passing protocols of GNNs do not provide a significant improvement over a simple MLP that only incorporates the graph's node textual descriptions.

![Figure 1. Tables evaluating the effectiveness of message passing in GNNs compared to a simple MLP baseline. GNNs are at best marginally better for node classification, link prediction, and molecular property prediction.](./figure_1.png)
<figcaption>Table 1. These tables evaluate the effectiveness of message passing in GNNs compared to a simple MLP baseline in the LLM-based graph learning pipeline. <bold>Best</bold> results are bolded and <underline>second best</underline> results are underlined.</figcaption>

#### Templated graph learning
The authors use LLaGA's framework as the basis for templated structural encoding via [Laplacian positional embeddings](https://arxiv.org/abs/2012.09699), which also follows the pipeline outlined in Figure 1. They compare LLaGA's Neighborhood Detail (ND) template, which captures the local structure of each node as a sequence of nodes (full structural representation), with two different baselines: (a) Hop Neighbor (HN), which is a random subset of k-hop neighbors from each node to form the sequence of nodes (limited structural representation), and (b) Center Only (CO), which only uses the description of each node (no structural representation). Their results, presented in Table 2, show that the carefully curated sequence of nodes of ND underperforms on both node classification and link prediction (note that the results for molecular property prediction are not given).

![Figure 2. A table evaluating the effectiveness template-based graph learning with full (ND), limited (HN), and no (CO) graph structure representation. Full graph structure underperforms for both node classification and link prediction.](./figure_2.png)
<figcaption>Table 2. This table evaluates the effectiveness of templated graph learning using full (ND), limited (HN), and no (CO) graph structure representation in the LLM-based graph learning pipeline. <bold>Best</bold> results are bolded.</figcaption>

### Conclusion
In this blog post, we have reviewed a subset of results presented by the authors (do check out their paper for other results). These results show that for node classification, link prediction, and molecular property prediction, providing an LLM with the encoding of only the node textual descriptions has comparable results (and better in some cases) to providing it with the encoding of the graph structure using known methods. This highlights the already good performance of LLMs for graph learning tasks on TAGs, but raises the question of the effectiveness of current methods for encoding graph structure for LLM-based graph learning.