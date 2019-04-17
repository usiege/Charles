# 深度强化学习实践2

[TOC]

## Model-Free Prediction

### Monte-Carlo

1. S A P R $\gamma​$

   

2. 试错的思想

   $ \mu_k = \sum{}{}​$

### Temporal-Difference Learning

Driving Home Example例子：

$V(S_t) = V(S_{t-1}) + \mu(G_t-V_{S_t})$  ———> (MC)

$V(S_t) = V(S_{t-1}) + \mu(TD -( V_{s}+\gamma V_{s'}))​$   ———>(TD)

$G_t$表示，等于$R_{t+1}+\gamma V(S_{t+1})$

$\lambda​$ 超参指的什么？有什么意义？



- 以上两者的区别

  前者走过所有状态，而后再进行更新；

  后者利用下一个预测状态而不是最终状态去对当前状态进行更新；

- MC缺点通过上面这个区别可以体现

- TD的方差小，但是有偏差



## Language Generation with Hierarchical Reinforcement Learning

输出的是一个序列；

视频描述，经典的网络框架 编码-解码结构，其中一个是视觉编码器，另一个是语言解码器(LSTM)；

交叉熵损失函数，最大化准确类别的概率，在序列生成中不能保证全局是否是最好的，只能保证几个单词最优；



为什么在这个问题中使用强化学习？

1. 动态影响；
2. 延迟的、稀疏的问题；



学习策略：value-based，policy-based，actor critic(前两者结合)

policy-based在高维度或连续空间更有效，有更好的收敛性质，优化时存在高方差(可以缓解)；

value-based；

Agent视频描述网络，Environment视频，State已经生成的单词序列；



采样层次化强化学习的动机？

解决稀疏反馈的问题（基于策略梯度的视频描述方法）；

直接优化整个问题(分而治之)，引入一个子目标，序列生成转化为子序列生成群问题；



manager（高层次策略），worker (低层次策略)，与环境交互的是worker；

worker生成短语，action是给worker生成完成短语的目标goal，评估器用来判定短语是否生成完成；

所以manager的主要作用体现就是对整个句子短语的切分；

Internal critic就是上述的评估器，不进行return reward，它是通过监督训练生成的；

CIDEr；

manager不直接跟网络交互，它的动作空间（goal）是连续（是一个向量的表达？）的高维空间，无法进行穷举；

（trade-off?）

训练过程中，worker与manager进行交替训练；

方差是指梯度的方差，梯度是指什么梯度？



Derterminitic policy grident 决定性策略梯度；



序列映射到序列的应用中；





## Revise