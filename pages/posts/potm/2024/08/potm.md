---
date: 2024-09-01
categories:
- Papers of the Month
title: 'August Papers: Hallucinations, Quantisations and Test-Time Computations'
merge_potm: true
---

If there's one thing you can count on from Graphcore Research, it's tireless enthusiasm for effective compute utilsation!  Our favourite papers from August include:

 - _Spectra_, an open suite of 54 LLMs and 500+ intermediate checkpoints from 0.1B to 3.9B, spanning FP16 training, ternary training, and post-training quantisation to 3, 4, 6, and 8 bits. The proposed ternary architecture - TriLM - outperforms BitNet b1.58 models of similar size.

- An investigation into two methods for allowing LLMs to improve task performance on challenging prompts by expending more test-time compute. As a result, the authors demonstrate compute-optimal scaling strategies to allocate compute on a per-prompt basis, and show that thoughtful increases in the test-time compute budget for a small model can be more effective than training larger models.

- A training dataset derived from a Knowledge Graph where correct answers can always be known, enabling accurate measurement of hallucinations in LLMs. This facilitates an analysis of hallucincation rates and hallucaination detectability as training compute is scaled. So you see, we don't only think about compute!


_I hope you enjoy these as much as we did. If you have thoughts or questions, keep the conversation going [@GCResearchTeam](https://x.com/GCResearchTeam)._
