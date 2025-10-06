---

title: "Metacognitive Reuse: Turning Recurring LLM Reasoning Into Concise Behaviors"

paper_authors: "Aniket Didolkar, et al."

orgs: "Meta, Mila-Quebec AI Institute, Princeton University"
paper_link: "https://arxiv.org/abs/2509.13237"
tags:
    - LLMs
    - reasoning
    - RAG
    - self-improvement
    - efficient-inference

potm_year: 2025
potm_month: 9
paper_order: 1  # Editor will decide
image_dir: "/assets/images/posts/2025-09/potm/metacognitive-reuse/"
review_author:
    name: "Dobrik Georgiev"
    link: "https://x.com/DobrikG"
hidden: false
---

<!-- [200 words is a rough guide for the length of a summary. -->
<!-- Feel free to go a fair bit over or under if needs be. -->
<!-- The editor will fix any issues with images being rendered too wide/narrow etc. -->
<!-- See README for how to view locally if you wish to (not required. Contact CB if this -->
<!-- is broken for you.)] -->

### The key idea

> "_Do not rediscover the wheel, if you have already done it once!_"
>
>  -- paraphrased **TL;DR**

According to Didolkar et al., this is the key lesson we should teach LLMs. Why?
The authors have observed that while rapid progress in the performance of
Chain-of-Thought approaches has been made, there has also led to a
efficiency decline. From where? Because **the LLMs re-derives knowledge from
scratch too often**.


The proposed remedy is _metacognitive reuse_. Instead of providing a set of
facts/rules, we let the LLMs synthesise their own _behaviours_. Those are concise
pieces of knowledge, reusable across questions/datasets and models.

<!-- A few sentences outlining why the paper is interesting... -->

<!-- Add images where appropriate throughout. This section should always -->
<!-- have at least 1 key figure though. -->

<!-- *Please use high-res images (zoom in for those screenshots!) The editor will * -->

<!-- ![A specific and succinct sentence or two describing the figure 1 (alt text). Valuable for seo and accessibility.](example_upload/figure_1.png) -->
<!-- <figcaption>Figure 1a. If the caption isn't included in the image, it should be added like so.</figcaption> -->

![Behaviour curation and application](/assets/images/posts/2025-09/potm/metacognitive-reuse/vis_abstract.png)
<figcaption markdown="1">

**Behavior Curation Pipeline (left)**: All the 3 stages of behavior curation
pipeline: _solution_, _reflection_, _extraction_. LLM A is referred to as the
Metacognitive Strategist. **Reasoning with behaviors (right; in gray)**: The
three proposed ways to utilize behaviours. LLM B and LLM C are a student and
teacher LLMs respectively.

</figcaption>

Once synthesised, Didolkar et al. propose three ways to utilise extracted
behaviours:
* Behaviour-conditioned inference -- the set of behaviours is pre-extracted
  from a (different) strategist LLM
* Behaviour-guided self-improvement -- the set of behaviours is extracted as we
  process questions/tasks from the same LLM
* Behaviour-conditioned SFT -- a Behaviour-conditioned teacher model
  synthesises a training set of question/solution pairs, used to fine tune the student model

###  Background

[Chain-of-Thought](https://arxiv.org/abs/2201.11903) (CoT) prompting is a technique
in prompt engineering for large language models. It encourages the LLM to break
down complex reasoning tasks into a sequence of intermediate reasoning steps (a
“chain”) before arriving at a final answer. This helps improve performance on
multi-step problems (e.g. arithmetic, logic, commonsense) and, at the cost of
outputting long reasoning traces (the higher the output tokens, the higher the
cost). Unfortunately, the chain might still be flawed. More
enumerative [beam-search-like approaches](https://arxiv.org/abs/2412.09078),
can resolve this, but the computation required is even higher.

### Their method

**Behaviour curation** &ensp; hi


**Behaviour usage** &ensp; hi

<!-- Latex can be included in the standard way, either inline: $R=\sum _{t=0}^{\infty }\gamma ^{t}r_{t}$ -->

<!-- Or as a block: -->

<!-- $$ -->
<!-- Q_{t+1}^{A}(s_{t},a_{t})=Q_{t}^{A}(s_{t},a_{t})+\alpha _{t}(s_{t},a_{t})\left(r_{t}+\gamma Q_{t}^{B}\left(s_{t+1},\mathop {\operatorname {arg~max} } _{a}Q_{t}^{A}(s_{t+1},a)\right)-Q_{t}^{A}(s_{t},a_{t})\right). -->
<!-- $$ -->

<!-- Code can also be included in the standard way: -->

<!-- ``` -->
<!-- import popart -->

<!-- builder = popart.Builder() -->

<!-- # Build a simple graph -->
<!-- i1 = builder.addInputTensor(popart.TensorInfo("FLOAT", [1, 2, 32, 32])) -->
<!-- i2 = builder.addInputTensor(popart.TensorInfo("FLOAT", [1, 2, 32, 32])) -->

<!-- o = builder.aiOnnx.add([i1, i2]) -->
<!-- ``` -->

### Results

...

### [optional] Takeaways

...
