---
title: "Retrieval Augmented Generation or Long-Context LLMs? A Comprehensive Study and Hybrid Approach"
paper_authors: "Zhuowan Li, et al."
orgs: "Google DeepMind, University of Michigan"
paper_link: "https://arxiv.org/abs/2407.16833"
tags:
    - efficient-inference
    - LLMs
    - retrieval-augmented-generation
    - long-context
potm_year: 2024
potm_month: 7
paper_order: 1  # Editor will decide
image_dir: "/assets/images/posts/2024-07/potm/rag-vs-long-context/"
review_author:
    name: "Luke Hudlass-Galley"
    link: "https://www.linkedin.com/in/lukehudlassgalley"
hidden: true
---

[200 words is a rough guide for the length of a summary.
Feel free to go a fair bit over or under if needs be.
The editor will fix any issues with images being rendered too wide/narrow etc.
See README for how to view locally if you wish to (not required. Contact CB if this
is broken for you.)]

### The key idea

A few sentences outlining why the paper is interesting...

Add images where appropriate throughout. This section should always
have at least 1 key figure though.

*Please use high-res images (zoom in for those screenshots!)*

This paper from Google DeepMind attempts to answer the question of which is better - long context LLMs (LC) or retrieval augmented generation (RAG)? They find that for state-of-the-art LLMs that LC outperforms RAG, albeit at a larger computational cost due to the quadratic complexity of attention. However, they find that for most queries, both RAG and LC generate identical predictions. Motivated by this observation, the authors propose a method to route queries to RAG or LC, reducing the cost of inference while maintaining task performance comparable to LC.

<img src="{{ page.image_dir | append: 'method-comparison.png' | relative_url }}" alt="For several state-of-the-art LLMs, long context outperforms RAG, but routing between the two methods can attain similar performance with a fraction of the cost.">
<figcaption>Figure 1. While long-context LLMs (LC) surpass RAG in long-context understanding, RAG is significantly more cost-efficient. Our approach, SELF-ROUTE, combining RAG and LC, achieves comparable performance to LC at a much lower cost.</figcaption>

### Background

An emergent behaviour in LLMs is in-context learning, in which models can retrieve and learn from information present in its context. This behaviour allows models to learn from new information not seen in its training data, without requiring fine-tuning. However, the attention operation present in LLMs has a cost that scales quadaratically with the length of the sequence, and therefore increasing the amount of context may lead to slower performance. Retrieval Augmented Generation (RAG) can alleviate some of this cost by only retrieving a subset of relevant documents/information, which is added to the prompt before the inference process begins. This permits shorter, cheaper sequence lengths, but does not allow the model to see all avaialable context during inference, and relies on a quality retrieval method to ensure that the relevant documents have been retrieved.

### Their method

The authors benchmarked both LC and RAG approaches on a variety of NLP tasks and state-of-the-art LLMs, including Gemini-1.5-Pro, GPT-4O and GPT-3.5-Turbo, which support context lengths of 1M, 128k and 16k tokens respectively. The results found that in general, LC outperforms RAG, except when using datasets from $`\infty`$Bench (where RAG outperforms LC for GPT-3.5-Turbo, likely due to the model's limited context window). These results differ from previous work comparing the two strategies, but the authors argue this is due to the stronger LLMs and longer contexts used in their experiments.



Latex can be included in the standard way, either inline: $R=\sum _{t=0}^{\infty }\gamma ^{t}r_{t}$

Or as a block:

<div>
$$
Q_{t+1}^{A}(s_{t},a_{t})=Q_{t}^{A}(s_{t},a_{t})+\alpha _{t}(s_{t},a_{t})\left(r_{t}+\gamma Q_{t}^{B}\left(s_{t+1},\mathop {\operatorname {arg~max} } _{a}Q_{t}^{A}(s_{t+1},a)\right)-Q_{t}^{A}(s_{t},a_{t})\right).
$$
</div>

Code can also be included in the standard way:

```
import popart

builder = popart.Builder()

# Build a simple graph
i1 = builder.addInputTensor(popart.TensorInfo("FLOAT", [1, 2, 32, 32]))
i2 = builder.addInputTensor(popart.TensorInfo("FLOAT", [1, 2, 32, 32]))

o = builder.aiOnnx.add([i1, i2])
```

### Results

...

### [optional] Takeaways

...
