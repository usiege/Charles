# 深度强化学习实践3

## 无模型的方法

S A P R $\gamma​$

Model-based RL



SARSA

收敛条件一：GLIE，收敛到贪心策略，greedy in the limit；所有(s, a)被抽样无穷次；

收敛条件二：Robbins-Monro算法；



值迭代方法：v值迭代，Q值迭代；

Q-learning，值优化间接优化策略



一步一步的学习，off-line学习；一次性学习，on-line学习；

on-policy off-policy



> 为什么前者是策略迭代，而后者是值迭代？
>
> Data: ( S, A, $\gamma$ )
> Result: $\pi^*(s)$ for all s
> For each state s and a, initialize $q^*(s, a)$(一) , $\pi^*(s)$(二),  randomly
>
> foreach episode k do
> 	set s to initial state;
> 	repeat
> 		take action a <- $q_\pi(s, a)​$
> 		observe R,s' choose action a' <-  $argmax_{a'}q_\pi(s', a') ​$
> 		$ q_\pi(s, a) = q_\pi(s, a) + \eta[ R + \gamma q_\pi(s', \pi(s')) - q_\pi(s, a)]​$ 
> 		s <- s'
> 	until  s is terminal state
> end

​		

## 应用

智能体能否通过观察得到状态？











