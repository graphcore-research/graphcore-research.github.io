---
title: "July Papers: All About Scaling"
header:
    teaser: /assets/images/posts/2024-07/potm/twitter_card.png
    image: /assets/images/posts/2024-07/potm/twitter_card.png
    og_image: /assets/images/posts/2024-07/potm/twitter_card.png

date: 2024-08-01T01:00:00-00:00
potm_year: 2024
potm_month: 7

layout: paper-summaries-layout
category: "papers-of-the-month"
toc: true
toc_sticky: true
toc_label: "Papers"
toc_icon: "book"
author.twitter: "GCResearchTeam"
---

Scaling continues to be a super hot topic of research and our selection of papers for this month all tackle different angles of how to scale models efficiently.

The first paper we cover builds upon the work of muP to give a guide of how we can transfer hyperparameters optimised on small models to the large models we care about, especially as transformer width increases.

Our second chosen paper looks at scaling mixture of expert transformers along the expert dimension. They design an efficient routing strategy that allows them to push the expert number to the extreme for a more compute optimal configuration. 

The third paper we discuss addresses the lack of scaling laws for vocabulary parameters in LLMs. They first validate that there exists an optimal vocab size for a given compute budget and then empirically fit power laws to show that vocab parameters should be scaled differently to the other parameters of the model. 

Finally, our fourth paper answers the question of whether using long context lengths or retrieval augmented generation is better for scaling in-context learning and if a combination of the two could lead to more efficient inference.


_I hope you enjoy these as much as we did. If you have thoughts or questions, keep the conversation going [@GCResearchTeam](https://x.com/GCResearchTeam)._

---

{% include paper-summaries.md %}
