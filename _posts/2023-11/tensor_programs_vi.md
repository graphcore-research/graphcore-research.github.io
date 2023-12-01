### The key idea

By classifying infinite-width neural networks and identifying the *optimal* limit, Tensor Programs IV and V demonstrated a universal way, called μP, for *widthwise hyperparameter transfer*, i.e., predicting optimal hyperparameters of wide neural networks from narrow ones. Here they investigate the analogous classification for *depthwise parametrizations* of deep residual networks (resnets).

They provide the following formulatin for their proposed method, depth-µP:

![image]({{image_dir}}/tensor_programs_vi/table_1.png)

### Their method

There is a multiplier for each residual branch before adding to its input, which is inversely
proportional to the square root of L (where L is the depth). Formally, with a constant a
independent from L:

$$x^l = x^{l-1} + \frac{a}{\sqrt{L}} \cdot g^l(x^{l-1}; W^l).$$

They also set the learning rate of Wl
so that the update of Wl during training is proportional to
1/√L. They derive different learning rate schemes for different optimization algorithms based
on this principle. For Adam, because it is scale-invariant to the gradient, the learning rate
of Wl is set to be η/√L. On the other hand, the learning rate of Wl for SGD is set as a
constant η because the gradient of Wl is already of size 1/√L due to the multiplier.

### Results

They demonstrate that standard-parameterization has inconsistent LRs as depth changes, and also deteriorates as the number of layers increases:

![image]({{image_dir}}/tensor_programs_vi/figure_10c.png)
_Loss achieved when training with different LRs across depth, for a transformer with 1-layer residuals. The above plots use standard parameterization, and optimal LR is not consistent._

Whereas using depth-µP with 1-layer residuals maintains optimal LR as depth increases:

![image]({{image_dir}}/tensor_programs_vi/figure_10a.png)
_Same as above, but using depth-µP. Now both mid-training (left) and late in training (right) the optimal LR is stable across depth._

However, standard transformers want different scaling rules at different points in training:

![image]({{image_dir}}/tensor_programs_vi/figure_10b.png)
_Now using a normal non-linear transformer FFN with depth-µP. We see that mid-training the optimal LR is stable in depth. However late in training it now scales with 1/√L (note the different x-axis here!)._

They recommend using 1/√L learning rate rule, though note that this improved scheme “is likely to be brittle to architectural and algorithmic changes, or even simple things like training time”.