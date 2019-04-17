# Pointnet 代码解析

[TOC]

## Semantic Segmentation

1. get_loss
```python
loss = tf.nn.sparse_softmax_cross_entropy_with_logits(logits=pred, labels=label)
loss = tf.reduce_mean(loss)
```
[tf.nn.sparse_softmax_cross_entropy_with_logits](https://www.w3cschool.cn/tensorflow_python/tf_nn_sparse_softmax_cross_entropy_with_logits.html)

2. accuracy
```
correct = tf.equal(tf.argmax(pred, 2), tf.to_int64(label))
accuracy = tf.reduce_sum(tf.cast(correct, tf.float32)) / float(num_point)
```
    - tf.argmax
    求出参数维数上最大值的索引；
    - tf.cast
    将数据转换为指定格式
    - tf.reduce_mean
    [tf.reduce_mean](https://www.w3cschool.cn/tensorflow_python/tensorflow_python-hckq2htb.html)
3. learning_rate
```
learning_rate = tf.train.exponential_decay(
        # base learning rate
        # current index into the dataset
        # decay step
        # decay rate
    )
learning_rate = tf.maximum(learning_rate, 0.00001)
```
    指数衰减，



