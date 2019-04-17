# 四月第一周论文阅读

[TOC]

## Fully Convolutional Networks for Semantic Segmentation

- file-tuning

DeCAF: A deep convolutional acivation feature for generic visual recognition. ICML 2014.

- fully convolutional networks

$$
\bold y_{ij} = f_{ks}(\{\bold  x_{si+\delta_{i}, s_j+\delta_{j}}\} 0 \leq \delta_i,\delta_j \leq k) \\ \text k: kernel \ size, \  s:stride \ or \ subsampling\ factor
$$


$$
f_{ks} \circ g_{k's'} = (f \circ g)_{k'+(k-1)s',ss'}
$$

$$
\ell(x;\theta) = \sum_{ij}{\ell'(\bold x_{ij};\theta)}
$$
$\ell(x;\theta) = \sum_{ij}{\ell'(\bold x_{ij};\theta)}$

> 行内公式与行间公式在显示时会不一样，如上；


$$
f'_{ij} = \left\{ {\array{
f_{i/s,j/s} & \textrm{  if s divides both i and j.} \\
0 & \textrm{ otherwise}}
} 
\right.
$$

> 将letex里所有的\begin{element} 改为\element 即可在markdown中使用

- sift-and-stitch







## Pointwise Convolutional Neural Networks

- Convlution

Each kernel has a size or radius value, which and be adjusted to account for different number of neighbor points in each convolution layer.
$$
x_i^\ell=\sum_k\omega_k\frac{1}{|\Omega_i{(k)}|}\sum_{p_j\in\Omega_i{(k)}}x_j^{\ell-1}
$$
$\Omega_i{(k)}$表示在中心点i周围的第k个子域，$|\cdot|$表示子域上的所有点数，${p_i}$是点i的坐标，$\omega_k$是第k个子域的权重，$\ell$表示卷积层数，$x_i,x_j$表示点i,j的值；

- Gradient backpropagation

$$
\frac{\partial L}{\partial {x_j^{\ell-1}}} = \sum_{i\in\Omega_j}{\frac{\partial L}{\partial {x_i^{\ell}}}}{\frac{\partial x_i^\ell}{\partial {x_j^{\ell-1}}}}
$$


$$
{\frac{\partial x_i^\ell}{\partial {x_j^{\ell-1}}}} = \sum_k\omega_k\frac{1}{|\Omega_i{(k)}|}\sum_{p_j\in\Omega_i{(k)}}1
$$

$$
\frac{\partial L}{\partial {\omega_k}} = \sum_{i}{\frac{\partial L}{\partial {x_i^{\ell}}}}{\frac{\partial {x_i^{\ell}}}{\partial \omega_k}}
$$

$$
{\frac{\partial {x_i^{\ell}}}{\partial \omega_k}} = \frac{1}{|\Omega_i{(k)}|}\sum_{p_j\in\Omega_i{(k)}}x_j^{\ell-1}
$$
