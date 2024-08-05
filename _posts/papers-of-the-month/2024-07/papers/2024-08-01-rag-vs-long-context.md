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
paper_order: 4  # Editor will decide
image_dir: "/assets/images/posts/2024-07/potm/rag-vs-long-context/"
review_author:
    name: "Luke Hudlass-Galley"
    link: "https://www.linkedin.com/in/lukehudlassgalley"
hidden: true
---


### The key idea

This paper from Google DeepMind attempts to answer the question of which is better - long context LLMs (LC) or retrieval augmented generation (RAG)? For state-of-the-art LLMs they find that LC outperforms RAG, albeit at a larger computational cost due to the quadratic complexity of attention. However, they find that for most queries, both RAG and LC generate identical predictions. Motivated by this observation, the authors propose a method to route queries to RAG or LC, reducing the cost of inference while maintaining task performance comparable to LC.

<img src="{{ page.image_dir | append: 'method-comparison.png' | relative_url }}" alt="For several state-of-the-art LLMs, long context outperforms RAG, but routing between the two methods can attain similar performance with a fraction of the cost.">
<figcaption>Figure 1. While long-context LLMs (LC) surpass RAG in long-context understanding, RAG is significantly more cost-efficient. Our approach, SELF-ROUTE, combining RAG and LC, achieves comparable performance to LC at a much lower cost.</figcaption>

### Background

An emergent behaviour in LLMs is in-context learning, in which models can retrieve and learn from information present in its context. This behaviour allows models to learn from new information not seen in its training data, without requiring fine-tuning. However, the attention operation present in LLMs has a cost that scales quadaratically with the length of the sequence, and therefore increasing the amount of context may lead to slower performance. Retrieval Augmented Generation (RAG) can alleviate some of this cost by only retrieving a subset of relevant documents/information, which is added to the prompt before the inference process begins. This permits shorter, cheaper sequence lengths, but does not allow the model to see all avaialable context during inference, and relies on a quality retrieval method to ensure that the relevant documents have been retrieved.

### Their method

The authors benchmarked both LC and RAG approaches on a variety of NLP tasks and state-of-the-art LLMs, including Gemini-1.5-Pro, GPT-4O and GPT-3.5-Turbo, which support context lengths of 1M, 128k and 16k tokens respectively. The results found that in general, LC outperforms RAG, except when using datasets from $`\infty`$Bench (where RAG outperforms LC for GPT-3.5-Turbo, likely due to the model's limited context window). These results differ from previous work comparing the two strategies, but the authors argue this is due to their use of stronger LLMs and longer contexts in their experiments.

One observation they noted was that for 60% of queries, RAG and LC generate the same prediction (ignoring whether the prediction is correct or not):

<img src="{{ page.image_dir | append: 'prediction-distribution.png' | relative_url }}" alt="Most of the time, RAG and LC generate the same predictions.">
<figcaption>Figure 2. Distribution of the difference of prediction scores between RAG and LC (computed w.r.t. groundtruth labels). RAG and LC predictions are highly identical, for both correct and incorrect ones.</figcaption>

Given that RAG is much cheaper than LC (due to the quadratic complexity of attention), the authors propose a simple method called Self-Route: first check if the LLM with RAG-retrieved context can successfully answer the question, using the given provided context. If the query is deemed answerable then the RAG prediction is taken as the final answer. Otherwise, the second step is called, in which the full context is provided to the long context model to obtain the final prediction. Practically, the only changes to the RAG implementation is that the LLM is given the option to declice answering with the prompt "Write unanswerable if the query can not be answered based on the provided text".


### Results

The results show that the proposed Self-Route method can obtain performance comparable to long context LLM prompting, but with a considerably reduced cost at inference time. Furthermore, Self-Route can attain better performance than RAG when retrieving fewer documents, as seen below.

<img src="{{ page.image_dir | append: 'top-k-ablation.png' | relative_url }}" alt="The author's Self-Route method can outperform RAG with fewer retrieved documents.">
<figcaption>Figure 3. Trade-off curves between (a) model performance and (b) token percentage as a function of k.</figcaption>

