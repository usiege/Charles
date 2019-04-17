# Labeltool 标注工具

[TOC]

## 环境配置

使用conda，python2.7版本创建虚拟环境；
```
$ conda create -n labeltool python=2.7
```

添加tk模块：

```shell
sudo apt install python-tk
```
添加PIL模块:
```
pip install Pillow
```
添加numpy：
```
pip install numpy
```
添加matplotlib:
```
pip install matplotlib
```
添加torch:
```
pip install torch
```
添加scipy:
```
pip install scipy
```
添加sklearn:
```
pip install sklearn
```


## 工具编写

```python
# 
Frame.pack(file=BOTH, expand=1)
# 
Canvas(self.frame, cursor='tcross')
# 

```

## 问题记录

1. 在windows系统下的中文编辑问题；
2. python库的使用

```python
# 数据库
# json 

# pickle

# shelve
with shelve.open(file) as f:
DbfilenamesShelf instance has no attribute '__exit__'


```




## 公式测试

$ c^{2}=a^2+b^2 ​$  

我想要一个行内的矩阵，$\bigl(tag\bigr)​$


$$
\begin{equation}
\begin{matrix}
1 & 1\\
2 & 2
\end{matrix} \\
\\
\begin{pmatrix}
1 & 1\\
2 & 2 
\end{pmatrix} 
\text{注释} \\
\\
\begin{bmatrix}
1 & 1\\
2 & 2
\end{bmatrix}
\text{测试} \\ \\
\color{#0FF}{我有姿色}\,\;,我没有
\label{eq:2.3}
\end{equation}
$$


\begin{equation}  



\end{equation}



