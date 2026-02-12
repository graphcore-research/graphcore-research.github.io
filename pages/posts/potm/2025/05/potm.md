---
date: 2025-06-02
categories:
- Papers of the Month
title: 'May Papers: Parallel scaling, Evolving code, Understanding LLM reasoning'
merge_potm: true
---

Hurtling past the NeurIPS submission deadline into the summer months, we switch from huddling around server rooms to keep warm to babysitting experiments whilst basking in the sun. We've had a bumper month of papers to sift through and once again we offer summaries of a few of our favourites.

First, [Parallel Scaling Laws for Language Models](#parallel-scaling-laws-for-language-models) proposes a novel method of scaling compute with language models inspired by classifier-free guidance that finetunes a model to run multiple forward passes with different learned vector prefixes. We also looked into [AlphaEvolve](#alphaevolve-a-coding-agent-for-scientific-and-algorithmic-discovery), an evolutionary algorithm from Google DeepMind that generates and refine prompts for Gemini that can advance the state-of-the-art in algorithm design. 

Since it has been a particularly exciting month for contributions on LLM reasoning, we picked two papers to dive into deeper. In [Soft Thinking](#soft-thinking-unlocking-the-reasoning-potential-of-llms-in-continuous-concept-space) the authors attempt to improve on prior work sampling continuous token embeddings rather than discrete tokens during reasoning phases of text generation. Finally, in [Spurious Rewards](#spurious-rewards-rethinking-training-signals-in-rlvr) they find that even rewarding random answers can improve reasoning ability, potentially forcing us to reconsider how we understand post-training techniques to improve the use of test-time compute. 
