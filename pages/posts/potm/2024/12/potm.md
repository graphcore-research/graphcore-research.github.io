---
date: 2024-12-30
categories:
- Papers of the Month
title: 'December Papers: Spend Your FLOPs Wisely'
merge_potm: true
---

Welcome to Papers of the Month — Graphcore Research's effort to bring you our pick of the most interesting ML papers.
In December we noted a collection of papers which took innovative approaches to allocating compute (FLOPs) to input data.

We start with the Byte Latent Transformer. This modifies the standard transformer to operate on _patches_, which comprise a variable number of input bytes, as determined by an entropy metric. The consequence of this is that compute is dynamically allocated towards "harder input data". This has some similarities with the Concept Model architecture, which also uses a flexible intermediate representation. The model performs autoregressive sentence generation in this modality-agnostic space, rather than token space. 

The Memory Layers architecture allows extra parameters to be added to a model without increasing FLOPs. Decoupling these resources gives model designers more control (e.g. for co-design, to fit their hardware resources) and potentially facilitates more effective models in general.

Finally, the Phi-4 paper presents a rather different FLOPs angle: spending compute in the data-generation process to create higher quality data, leading to "student" models that (in some domains) out-perform their "teachers".

*We hope you enjoy these month's papers as much as we did! If you have thoughts or questions, please reach out to us at [@GCResearchTeam](https://x.com/GCResearchTeam).*
