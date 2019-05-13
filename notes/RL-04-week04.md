# 深度强化学习实践4

> 

## 价值函数近似

find a $\pi$，在该策略下每个状态的价值最大；

- model-based方法
- model-free方法

可微函数的函数近似，不用查表法去进行查找；

强化学习与监督学习训练方法的区别：动态变化(数据是随着策略变化的)、非独立的数据；

如果价值函数存在，采用SGD优化价值函数；用特征向量表示与监督学习类似；

MC估计是一个无偏有噪声的估计，TD有偏估计（$TD(0)$, $TD(\lambda)$）；

Linear Sarsa With Coarse Coding in Mountaion Car;



前向，后向，on-policy, off-policy；(四个概念)



增量控制算法；

增量方法用过的样本会丢弃，导致样本利用率低；

批方法会利用经验回放，DQN采用经验回放和固定Q-target：

- 将经验数据存放在回放记忆体D中；

- D中随机采样mini-batch样本；

- Q-network(已经固定的权重)，Q-target(当前仍在进行训练的权重)之间的MSE；



## RL与GAN在文本序列生成的应用

### 交叉熵

传统RNN训练与测试的矛盾：

基于交叉熵损失函数的 Sequence->Sequence 的模型有两个问题；

 - 训练与测试的评价机制不一致
 - Exposure Bias

maximum likelihood estimate, MLE 极大似然估计，它可以看成是一种特殊的RL；

### GAN

Generative Adversarial Nets, goodfellow in 2014;

Conditional Generative Adversarial Nets, Mehdi in 2014;

评价的指标，利用监督学习是无法进行描述的；

>  BLUE-1,2,3,4
>
> This is a cat.
>
> shader评价指标



GAN到判别期时为什么不可微？

policy-gridient + monte carle search 

SeqGAN

RankGAN

DP-GAN



evaluation —> discriminator









