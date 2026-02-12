---
date: 2025-02-27
categories:
- Papers of the Month
title: 'February Papers: Learning to Scale'
merge_potm: true
---

Welcome to Papers of the Month! This time around, our monthly selection of ML papers revolves around the central theme of *scale* – and learning how to scale efficiently. Scaling-laws for LLMs, multi-scale quantisation training and scaling test-time compute: it's a rich buffet!

The first paper, **Distillation Scaling Laws**, presents a thorough study of distillation for Language Models, with the aim of estimating how student performance scales as a function of model size and amount of distillation data used -- offering very useful insights, in an era where distillation pre-training of LLMs is becoming more and more widespread to improve "capability per watt".

The problem of computational efficiency and cost reduction is also at the heart of **Matryoshka Quantisation**, DeepMind's solution for training a quantised model that can then be easily served at different lower numerical precisions, by leveraging the nested structure of integer data types. And if you are a quantisation geek like we are, make sure to also read our summary of **ParetoQ**, a new unified framework to investigate the scaling laws that govern the trade-off between quantised model size and accuracy in extremely low-bit regimes.

Finally, we jump from training scaling laws to **scaling up test-time compute**, with a paper that introduces a recurrent block in LLMs at test-time to allow the model to perform iterative reasoning in latent space, without verbalizing its intermediate thoughts, to improve its performance.

*We hope you enjoy these month's papers as much as we did! If you have thoughts or questions, please reach out to us at [@GCResearchTeam](https://x.com/GCResearchTeam).*
