---
date: 2025-04-06
categories:
- Papers of the Month
title: 'March Papers: De-Norming, Skill-Scaling, Over-Training and Drug-Generating'
merge_potm: true
---

We've enjoyed March, bringing improving weather and many excellent ML papers to keep us busy. As usual, we're here to share summaries of four of our favourites.

First, Meta share their work that successfully removes the need for `LayerNorm` in transformers, replacing them with a reduction-free $\tanh$ ([de-norming](#transformers-without-normalisation)). This is followed by two papers on scaling - studying the different scaling laws for skill-based vs knowledge-based downstream tasks ([skill-scaling](#compute-optimal-scaling-of-skills-knowledge-vs-reasoning)), and whether pretraining can go on too long, making downstream performance worse ([over-training](#overtrained-language-models-are-harder-to-fine-tune)). Finally, EPFL share a flow-matching GNN model for generating small molecules for drug design ([drug-generating](#multi-domain-distribution-learning-for-de-novo-drug-design)).
