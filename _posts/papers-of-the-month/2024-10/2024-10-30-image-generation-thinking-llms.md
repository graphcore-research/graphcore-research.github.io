---
title: "October Papers: Improving image generation & making LLMs think"
header:
    teaser: /assets/images/posts/2024-10/potm/twitter_card.png
    image: /assets/images/posts/2024-10/potm/twitter_card.png
    og_image: /assets/images/posts/2024-10/potm/twitter_card.png

date: 2024-10-30T01:00:00-00:00
potm_year: 2024
potm_month: 10

layout: paper-summaries-layout
category: "papers-of-the-month"
toc: true
toc_sticky: true
toc_label: "Papers"
toc_icon: "book"
author.twitter: "GCResearchTeam"
---

This month brought us some exciting developments in image- generating models, as well as some interesting insights into how to make large language models *think*!

We start with promising results from OpenAI on using *consistency models* for image generation, challenging the well-established denoising diffusion paradigm. While not quite reaching the same performance, these models require orders of magnitude less compute to generate an image, and may provide a very promising future direction.

At the same time, researchers from Google DeepMind were able to achieve state-of-the-art performance in text-to-image generation, by scaling an autoregressive-type transformer to 10.5 billion parameters, stressing the importance of continuous token representations for images.

Finally, since the introduction of OpenAI's [o1 model](https://openai.com/index/introducing-openai-o1-preview/), there has been a growing interest within the research community in understanding how to make large language models reason. In *Thinking LLMs*, the authors propose a fine-tuning method to improve the responses from LLMs by eliciting a thought process before generating the answer.

*We hope you enjoy these month's papers as much as we did! If you have thoughts or questions, please reach out to us at [@GCResearchTeam](https://x.com/GCResearchTeam).*

---

{% include paper-summaries.md %}
