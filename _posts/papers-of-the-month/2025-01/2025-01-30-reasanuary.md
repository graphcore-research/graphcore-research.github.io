---
title: "January Papers: More Like \"Reas-anuary Papers\""
header:
    teaser: /assets/images/posts/2025-01/potm/twitter_card.png
    image: /assets/images/posts/2025-01/potm/twitter_card.png
    og_image: /assets/images/posts/2025-01/potm/twitter_card.png

date: 2025-01-30T01:00:00-00:00
potm_year: 2025
potm_month: 01

layout: paper-summaries-layout
category: "papers-of-the-month"
toc: true
toc_sticky: true
toc_label: "Papers"
toc_icon: "book"
author.twitter: "GCResearchTeam"
---

New year, new Papers of the Month!
Kicking off 2025, it's apparent that reasoning and test-time compute are the hot topics on the block, with
much research investigating how to best use these new methods to improve LLM capabilities.

We start with **Titans**, which introduces a memory module to architectures that can be updated during inference. This results
in a hybrid between attention mechanisms and recurrent models, and unlocks the ability to handle really long sequence lengths.

**Evolving Deeper LLM Thinking** explores evolutionary search strategies to scale test-time compute, outperforming other
inference strategies in natural language planning tasks.

**Transformer-Squared** is a novel approach that adapts LLMs for new tasks by selectively adjusting the singular components of their
weight matrices, helping broaden LLMs' abilities to handle diverse tasks with fewer parameters and greater efficiency.

Finally, we look at two recent models from DeepSeek; **DeepSeek-V3** and **DeepSeek-R1**. Given this double-release is packed with
so much information, today we'll only cover the high-level details on the innovations described in the papers and their impact on
efficiency and model performance — we will release a new blog post soon with a deep-dive into DeepSeek's recent publications.

*We hope you enjoy these month's papers as much as we did! If you have thoughts or questions, please reach out to us at [@GCResearchTeam](https://x.com/GCResearchTeam).*

---

{% include paper-summaries.md %}
