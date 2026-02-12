---
tags:
- audio-visual generation
- diffusion
- diffusion transformer
- efficient-inference
potm_order: 2
paper_title: 'LTX-2: Efficient Joint Audio-Visual Foundation Model'
paper_authors: Yoav HaCohen, et al.
paper_orgs: Lightricks
paper_link: https://arxiv.org/abs/2601.03233
review_authors:
- benoitg
---

### The key idea

LTX-2 is a text-conditioned generative model for joint audio-visual generation. Unlike prior approaches that generate video and audio separately or in sequential pipelines, LTX-2 directly models their joint distribution, enabling temporally aligned and semantically coherent audiovisual outputs.

LTX-2 is composed of modality-specific Variational Autoencoders (VAEs) that encode audio and video into separate latent tracks, a novel text-conditioning module for improved semantic understanding, and an asymmetric dual-stream Diffusion Transformer (DiT) backbone.

![Overview of the LTX-2 architecture.](./ltx2.png)


### Method

#### Architecture
Video inputs are encoded using a spatiotemporal causal VAE, while audio inputs are encoded by a separate causal audio VAE operating on 16 kHz mel spectrograms.
Text conditioning relies on a modified Gemma3-12B backbone, followed by a multi-layer feature extractor and a text connector module that refines the extracted representations using thinking tokens.
The DiT backbone consists of a 14B-parameter video stream and a 5B-parameter audio stream. Each stream sequentially applies self-attention, text cross-attention for prompt conditioning, audio-visual cross-attention for inter-modal exchange, and a feed-forward network (FFN) for refinement.

![Dual stream DiT architecture.](./dual_dit.png)

#### Inference
At inference time, LTX-2 uses multimodal classifier-free guidance, where each modality is simultaneously guided by a text-based term and a cross-modality alignment term.
A multi-scale, multi-tile inference strategy enables high-resolution audiovisual generation while avoiding the high memory costs typical of large-scale video diffusion models.
### Results

#### Data
The model is trained on a collection of publicly available datasets, filtered to retain video clips with significant and informative audio content.
The captioning of the video is done with a proprietary new video captioning system.

#### Results
The authors evaluate LTX-2 across three dimensions: audio-visual quality, video generation performance, and inference efficiency.
They claimed that LTX-2 significantly outperforms open-source alternatives on audio-visual performances based on an internal benchmark as well as being ranked in the top five in image-to-video and text-to-video according to the Artificial Analysis public rankings.
Finally, they compare runtime performance against Wan 2.2-14B, reporting up to an 18× speed improvement.

### Limits
In addition to the limitations acknowledged by the authors, including poor mutli-speaker audio performances, limited temporal scalability for sequences longer than 20 seconds, and a lack of reasoning capabilities, the proprietary nature of the training data and the limited evaluation undermine any reproducility attents.

