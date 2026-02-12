---
tags:
- AGI
- Evolutionary Algorithms
- RAG
potm_order: 2
paper_title: 'AlphaEvolve: A coding agent for scientific and algorithmic discovery'
paper_authors: Emilien Dupont, et al.
paper_orgs: Google DeepMind
paper_link: https://storage.googleapis.com/deepmind-media/DeepMind.com/Blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/AlphaEvolve.pdf
review_authors:
- roberthu
---

AlphaEvolve, evolves (no pun intended) the seminal method [FunSearch](https://www.nature.com/articles/s41586-023-06924-6) introduced in late 2023. Powered by a frontier model rather than a smaller LLM, it leverages evolutionary algorithms to successively prompt Gemini to finding novel solutions with respect to a multi-objective target. The results are quite compelling, improving upon various mathematical results relating to matrix multiplication and even reducing Google Cloud's costs with 0.7%. This is a staggering saving considering the scale of Google. 

### The key idea

AlphaEvolve’s workflow begins with an initial program and an automated evaluation function. Marked code blocks are evolved through LLM-proposed diffs, evaluated for quality, and selectively retained in a program database. Prompts are assembled from high-performing ancestors and injected with stochastic formatting, context, and feedback.

The use of powerful Gemini 2.0 models (Flash for speed, Pro for breakthroughs) ensures a mix of exploration and high-quality suggestions. The evolution loop is fully asynchronous and can evaluate expensive programs in parallel. AlphaEvolve can optimize for multiple metrics and adapt across abstraction levels: from evolving functions to full search algorithms.

By exploiting the capacity of LLMs and engineering a feedback loop, it can effectively help Gemini to act as an "arbitrary" format optimiser for very vague tasks, as long as the problem can be expressed in some form of syntax paired with an evaluation criteria. 

![Overall feedback loop for AlphaEvolve](./Fig1.png)
<figcaption>Figure 1. AlphaEvolve feedback loop design.</figcaption>


### Their method

AlphaEvolve works by evolving full programs through an LLM-driven, feedback-grounded loop. Candidate solutions are generated as diffs from existing programs, scored via an automated evaluation function, and stored in a database to seed further generations. It supports evolving entire files across multiple languages and can simultaneously optimize for multiple metrics.

To understand what makes AlphaEvolve effective, the authors performed ablation studies on two tasks: matrix multiplication and the kissing number problem. The key findings:

1. **No evolution**: Removing the evolutionary loop (i.e., re-prompting the initial program) significantly degrades performance.

2. **No context**: Stripping rich context from prompts leads to worse solutions, confirming that prompt engineering matters.

3. **Small LLMs only**: Using only lightweight models reduces result quality. Strong base models like Gemini Pro make a difference.

4. **No full-file evolution**: Restricting changes to a single function (vs. whole files) limits AlphaEvolve’s power and flexibility.

5. **No meta-prompt evolution** : Removing the co-evolution of prompts results in slower progress, showing prompt quality co-evolution is a key driver.

Together, these ablations show that AlphaEvolve’s strength comes from multiple interacting components; especially full-code evolution, high-quality LLMs, and contextual prompting.

![AlphaEvolve methodological gains](./Fig2.png)
<figcaption>Figure 2. AlphaEvolve ablation study results.</figcaption>



### Results

AlphaEvolve discovered a new algorithm to multiply 4×4 complex matrices using 48 scalar multiplications—beating Strassen’s 49 from 1969. It improved tensor decomposition methods for matrix multiplication, set new state-of-the-art results on the Erdős minimum overlap and kissing number problems, and evolved efficient scheduling heuristics that saved 0.7% of Google’s data center compute.

They further demonstrated that AlphaEvolve also able to carry out assembly level code to optimise kernels for Gemini's attention layer, yielding a 23% performance improvement, with a 1% decrease in wall time. 


### Takeaways

Some observations here is that frontier models can evidently be used as "general-purpose" optimisers assuming a well engineered feedback loop. This can likely be generalised to a product using an arbitrary frontier model, and may possibly add another venue for the agentic-LLM community to explore.
