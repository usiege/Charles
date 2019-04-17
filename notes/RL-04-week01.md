# 深度强化学习实践

[TOC]

## 学习概述

### Q-learning

一张图像200 * 300像素，256 ^ {200 * 300}种状态

```python
from maze_env import Maze
from RL_brain import QLearningTable

def update():
    # 学习 100 回合
    for episode in range(100):
        # 初始化 state 的观测值
        observation = env.reset()

        while True:
            # 更新可视化环境
            env.render()

            # RL 大脑根据 state 的观测值挑选 action
            action = RL.choose_action(str(observation))

            # 探索者在环境中实施这个 action, 并得到环境返回的下一个 state 观测值, reward 和 done (是否是掉下地狱或者升上天堂)
            observation_, reward, done = env.step(action)

            # RL 从这个序列 (state, action, reward, state_) 中学习
            RL.learn(str(observation), action, reward, str(observation_))

            # 将下一个 state 的值传到下一次循环
            observation = observation_

            # 如果掉下地狱或者升上天堂, 这回合就结束了
            if done:
                break

    # 结束游戏并关闭窗口
    print('game over')
    env.destroy()

if __name__ == "__main__":
    # 定义环境 env 和 RL 方式
    env = Maze()
    RL = QLearningTable(actions=list(range(env.n_actions)))

    # 开始可视化环境 env
    env.after(100, update)
    env.mainloop()
```

- 强化学习有状态(state)， 动作(action)，奖赏(reward)；
- Q为动作效用函数(action-utility function)，用于评价在特定条件下采取某个动作的优劣；

$$
Q(s, a) = (1-\alpha)Q(s,a)+(\alpha)[r+\gamma max_{a'}Q(s',a')]
$$

​	其中$\alpha$为学习速率；

### 价值迭代

### MDP（Markov decision processes）问题



## Dynamic Programming问题

### Bellman方程

- Bellman 方程，控制论术语，递归关系

- prediction control

- Policy Evaluation

  bellman expectation equation | iterative policy evaluation

  

  1. in-place
  2. prioritised sweeping
  3. real-time

  

  - state

  - action 

  - MDP evns (mdp(s, a, p, reward, \gamma) —> envs)

    $MDP(S, A, P, R, \gamma)​$

    P 状态转移概率

    $\gamma$  折扣因子

  

  https://zhuanlan.zhihu.com/p/26214408

  https://zhuanlan.zhihu.com/p/39279611

  

  价值迭代 

  策略迭代

  

## AlphaGo 初探

- DL RL MCTS 涉及知识点多

- AlphaGo combines the policy and vlaue networks with MCTS

  - 搜索+剪枝
    - 减小搜索的深度
    - 减小搜索的广度

- 相关技术

  - 蒙特卡洛树搜索

    - selection 

      选择最优局面

    - expansion 

      生成新子树，走子网络(监督学习，强化学习，前者效果更好)

    - simulation 

      value network输出结果

    - backpropagation

      更新访问次数N， 动作价值Q

  - 树搜索

  - 暴力穷举—必胜策略

    $p(s_{t+1}|s_t, a_t)$

  - 基于策略函数的强化学习

    R 轨迹回报 J 目标函数

- 训练流程

  一、模仿(区别在于卷积核不同，有不同的用途)

  - rollout policy 
  - SL policy network

  二、强化提升棋力

  - RL policy network

  三、学习评估局面

  - value network

1. phase 1

   15w + 100w 训练数据

   局面s，动作a

   input : 19 *19 *48 

   48 channels 不同角度对局面进行描述

   13层，没有pooling层

   

2. phase 2

   **ReinForce算法**

   policy gradient

   状态，动作，回报

   - 监督学习网络作为强化初始网络；
   - 与之前随机版本对局
   - 算法更新参数
   - 

3. phase 3

   局面评估函数

   input: 局面S， 2 phase产生

   回归任务 MSE损失训练网络

- 存在挑战
  - 过拟合
    - 0.19 on train,  0.37 on eval
  - 解决方法
    - self-play增广数据 (3000w)
    - 0.226 on train , 0.234 on eval

- MCTS CNN
  - 更强的走子网络
  - 好的走子策略
  - 1202CPU 176GPU



## 