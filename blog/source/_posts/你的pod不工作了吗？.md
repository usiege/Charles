title: 你的pod不工作了吗？
date: 2017-10-17 11:03:00
categories: coder
tags: [CocaoPods]
-----------

最近公司的项目需要添加几个依赖库，用pod更新的时候发现一直卡在了
```
Setting up CocoaPods master repo
```
<!-- more -->


继而是漫长的等待，在这个期间我不知道它发生了什么。

在这种等待中，程序员一般会选择做一些别的事情。于是我上网验证了一下我的行为，结论告诉我：

1.我要开个VPN；

2.我需要重新安装一下pod，因为它已经不工作了；

首先要先检查一下ruby源：

```
gem sources -l
```

返回的结果是https://rubygems.org/，如果你在网上找到过其他源并且修改过它，并且你不确定你的源是否可以使用的话，那么请修改回来，买个VPN，这会让你节省很多不必要的劳动，你可以用以下代码修改源：

```
#移除旧源
gem sources --remove 旧源址
#添加新源
gem sources -a https://rubygems.org/
```

PS:请确保你的源可用！！！

接着如果你没有安装pod，请执行：


```
sudo gem install cocoapods
```

如果你已经安装pod，请执行：

```
pod setup
```

这个操作结束之后，又重现了一个漫长的等待过程，那么我们要清楚它是否在认真工作，请打开另外一个终端，我们要检查一下进度：

```
#进入到pod目录
cd ~/.cocoapods

#检查当前文件下所有文件的大小，此后如果你不放心，可以分时段检查一下
du -sh *
```

这个过程会很漫长，取决于你VPN的速度，最后我这边出结果会反馈绿色的文字，Setup completed!文件总大小是1.2G，所以还是耐心的等待吧。。。

另外还有一点，如果上述`pod setup`出现红色的错误信息，也有可能是gem没有到最新版本，那么你还需要用你的VPN更新一下gem到最新；
```
sudo gem update --system
```
PS:顺便记一下寻找库代码
```
pod search AFNetworking
```
这个时候会遇到这样的提示：
```
[!] Unable to find a pod with name, author, summary, or descriptionmatching `AFNetworking`
```
你需要做如下操作，再进行搜索：
```
rm ~/Library/Caches/CocoaPods/search_index.json
```
最后你将如愿以偿，感谢亲人：
```
Creating search index for spec repo 'master'.. Done!
```