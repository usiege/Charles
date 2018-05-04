title: Python-django安装
date: 2017-10-25 19:56:00
categories: coder
tags: [python, django]
-----------


1. 发现错误
![image_1bt9d9b27bv5glj1a0m15hr1ncn9.png-258.7kB][1]
怀疑是pip版本的问题；

2. 于是查了下更新pip的方法： 

查看pip版本
```
pip -version
```
升级方法
```
pip install -U pip
```
如果pip出现有问题，或者你花了很长的时间想用pip安装，例如使用下面这种方式：
```
pip install Django==1.8.16
```

如果你刚好安装成功，那么恭喜你；如果不是，那么我们就要使用另外一种方法； 
3. 下载安装

[gzip压缩包][2]

或者：
```
git clone https://github.com/django/django.git
```
下载完成之后：
```
tar -xvf django-master.tar.gz
cd django-master
python setup.py install
```
会出现下面的问题：
![image_1bt9ib15m8juqh01adb1hlb154k9.png-97.5kB][3]
继续找：
Because you're trying to install it on Python2, but the latest version of Django requires Python 3;
所以使用安装方法：
```
pip3 install -e django
```
这个仍然是联网安装，但是貌似`pytz`并不能连接上，vpn也不行；
所以:
```
cd django
python3 setup.py install
```
终于，你的django完成了；

续：
隔天使用以上的所有方法均可以，可能是十九大开会期间被墙掉了吧。
![image_1btbid9ijfnd1q2i15npd78l9p9.png-253.6kB][4]


  [1]: http://static.zybuluo.com/usiege/tvcs5iet0ge1yypcquu2swdq/image_1bt9d9b27bv5glj1a0m15hr1ncn9.png
  [2]: https://github.com/django/django/archive/master.tar.gz
  [3]: http://static.zybuluo.com/usiege/skgzjd12wfs2u973aidsrk7o/image_1bt9ib15m8juqh01adb1hlb154k9.png
  [4]: http://static.zybuluo.com/usiege/06h0phv3szekmv2l4x2cmurb/image_1btbid9ijfnd1q2i15npd78l9p9.png