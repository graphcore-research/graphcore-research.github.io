---
title: "How Does Critical Batch Size Scale in Pre-training?"
paper_authors: "Hanlin Zhang, et al."
orgs: "Harvard, Berkeley, University of Hong Kong, Amazon"
paper_link: "https://arxiv.org/abs/2410.21676"
tags:
    - batch-size
    - training-dynamics
    - efficient-training
    - scaling-laws
    - LLMs
potm_year: 2024
potm_month: 11
paper_order: 1
image_dir: "/assets/images/posts/2024-11/potm/critical-batch-size/"
review_author:
    name: "Charlie Blake"
    link: "https://thecharlieblake.co.uk/"
hidden: true
---

### The key idea

Critical Batch Size (CBS) is the batch size beyond which one starts to see diminishing returns. This is a key notion in modern pre-training: it determines the limits of data parallelism and local batch size.

The key contribution in this paper is an analysis of how CBS _scales_ wrt. data and model size, in a modern training setup. They find a key and perhaps surprising result: CBS is largely determined by the amount of data trained on, and is almost invariant to model size.

### Background

One can view the standard ML training procedure as operating in two phases: the accumulation of gradients, and the update of parameters based on those gradients. Accumulation takes place in three places: within a local mini-batch (summing over outer-products to compute weight gradients), across devices (data parallel all-reduce), and across sequential mini-batches (gradient accumulation).

For the sake of computational efficiency, we wish to use sufficiently large local mini-batches to hide the cost of loading weights, and as many data parallel devices as we have available to maximise compute. When the global batch size is lower than the CBS it makes no difference to the final loss how large or small the batch size is (i.e. how much we accumulate before a we update the parameters) - we always reach the same loss with the same amount of data. Another way to view this is to say that below the CBS, a doubling of the batch size halves the number of updates required (termed "linear scaling").

The CBS defines the point at which linear scaling ceases to hold. This concept was first introduced in [OpenAI's Large-Batch training paper](https://arxiv.org/abs/1812.06162), which shows that gradient noise can be used to predict the critical batch size. But what that paper and its successors don't show is how the CBS relates to the model size and number of tokens trained on, particularly in the context of LLM training. Understanding this is the purpose of this paper.

### Their method

The authors provide a definition of the CBS, by which this relationship can be measured: it is the batch size at which >=20% more steps are needed to reach the target loss than would be predicted were the linear scaling at small batch sizes to continue (see the paper for a mathematical formulation of this statement).

<img src="{{ page.image_dir | append: 'definition.png' | relative_url }}" alt="Illustration of critical batch size, showing the point at which the number of steps exceeds linear scaling by >=20%." class="constrained_img_large">
<figcaption>Critical Batch Size is the batch size at which >=20% more steps are needed than under linear scaling.</figcaption>

20% is a somewhat arbitrary threshold, but a useful one.

Instead of setting a target number of tokens and looking at the degradation in loss as batch size increases, they've instead chosen to set a target loss and look at the increase in steps required to reach it. This seems sensible - step-increase is a more interpretable metric than loss-increase, but this does make some things harder. For instance, they have to use a slightly non-standard (though well-validated) loss schedule that doesn't need to know the number of steps ahead of time.

### Results

They then train three sets of models, where each set contains models trained with a range of batch sizes and total compute allocations. The sets differ in how this scaled-up compute is allocated between increased model size and increased token count:

1. Allocates using the compute-optimal ([Chinchilla](https://arxiv.org/abs/2203.15556)) ratio between the two
2. Fixes the model size and only increases token count
3. Fixes the token count and only increases model size

They then use this to fit scaling laws for the number of steps taken as a function of the batch size. This results in the following:

<img src="{{ page.image_dir | append: 'scaling.png' | relative_url }}" alt="Optimization efficiency and scaling of critical batch size in Chinchilla (left) and controlled (middle, right) settings.">

The scaling laws determine the forecasts in the bottom row. The most interesting feature of these plots is the shape of the bottom right curve, showing that the CBS depends little on model size. Their scaling law says the the critical batch size $B^* $ relates to the model size $N$ as $B^* \propto N^{0.087}$ - a tiny exponent!


### Takeaways

This is a very useful paper, with a nice clear central result (something like: "only worry about scaling batch size with model size (alone) if you have a ~1000x increase in parameters"). It's made more robust by the careful control of hyperparameters (e.g. using µP to scale the learning rate). Practitioners will be able to use this kind of analysis to determine their own critical batch size for large training runs.

The only thing really lacking is a good intuition for _why_ longer training runs should have a larger CBS. One assumption here is that later in training larger batch sizes are more helpful, as the model improves and more data is required to derive an effective update (i.e. the loss landscape is harder to descent). This opens up the question of whether the CBS increases during training (this may well explain their finding), and if so how might one set a batch size schedule. We look forward to seeing future papers investigate this question!
