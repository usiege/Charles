title: Jenkins 100次构建失败踩坑全录（一）
date: 2017-12-09 20:53:00
categories: coder
tags: [jenkins]
-----------

本文将以问题与解决方案的方式对Jenkins构建过程中的问题进行收录，后期会在评论中持续收集，如果有相同情况，请自行对照解决；

本文参考：
手把手教你利用Jenkins持续集成iOS项目
http://www.jianshu.com/p/41ecb06ae95f
关于iOS-Jenkins进行持续集成项目部署
http://www.jianshu.com/p/54c7daae6c94
iOS持续集成：Jenkins篇
http://www.jianshu.com/p/faf879b3d182


## 关卡1 ：
安装Jenkins：首先你的电脑得有一个Java环境，接下来安装Jenkins。你可以直接去[Jenkins入口][1]网站，查看安装方式；
当然你也可以使用以下方法：

+ 安装homebrew
```
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
+ 安装jenkins
```
$ brew install jenkins
```
安装成功后需要开启jenkins服务；

## 关卡2 ：
开启Jenkins服务：确认jenkins已安装，在终端进入到jenkins安装目录下，会有一个叫做jenkins.war的文件，
```
$ java -jar jenkins.war
```
或者在终端输入：
```
$ jenkins
```
当出现：
![image_1c0ptnl2j13mh1mn2hmk18qf7usp.png-188.1kB][2]

服务已经就位，可以开始进行配置了；

这里还有两个命令用于jenkins开启和停用（Mac上）：
```
$ sudo launchctl load /Library/LaunchDaemons/org.jenkins-ci.plist
$ sudo launchctl unload /Library/LaunchDaemons/org.jenkins-ci.plist
```
如果是linux上也可以这样：
```
$ sudo systemctl status jenkins.service
$ sudo systemctl start jenkins.service
```
不过实际操作过程中，可能会出现停用失败的情况，我的做法是直接打开活动监视器，在里面搜java服务，强制关闭掉；这里需要注意，如果服务没有停止再进行jenkins开启是不成功的，提示会告诉你已经在用：

![image_1c0pu09in491qq31bqs25f1hbg26.png-222.9kB][3]

如果你想查看是否jenkins在运行，使用命令查看：
```
$ ps aux | grep jenkins
```

## 关卡3 ：
安装并开启完成就可以在浏览器里输入[localhost:8080][4]进行页面化配置了；
安装完成之后，Safari可能会自动打开，如果没有自动打开，打开浏览器，输入http://localhost:8080
![image_1c0pvjgjqfbg3i01c371uhc1ves2j.png-27.6kB][5]

这个时候可能会报一个错误。如果出现了这面的问题。出现这个问题的原因就是Java环境有问题，重启Java环境即可。

这个时候如果你重启电脑会发现Jenkins给你新增了一个用户，名字就叫Jenkins，不过这个时候你不知道密码。你可能会去试密码，肯定是是不对的，因为初始密码很复杂。这个时候正确做法是打开http://localhost:8080 会出现下图的重设初始密码的界面。

![image_1c0pvl71n5dulcc413164i1hcp30.png-30.4kB][6]

按照提示，找到/Users/Shared/Jenkins/Home/ 这个目录下，这个目录虽然是共享目录，但是有权限的，非Jenkins用户/secrets/目录是没有读写权限的。

![image_1c0pvm8al1tce1iled5voi216ac3d.png-200.2kB][7]

打开initialAdminPassword文件，复制出密码，就可以填到网页上去重置密码了。如下图

![image_1c0pvp2p01fon1h2mmvjs6s1fuj3q.png-99.6kB][8]

一路安装过来，输入用户名，密码，邮件这些，就算安装完成了。

还是继续登录localhost:8080

然而这一关还没有结束：
写blog的时候我把自己设置的帐号注销了，然而当时设置的密码却忘记了，怎么都想不起来，怎么办呢？
首先我想能不能用之前给的Jenkins帐户呢，经试错，未果；
接下来上百度查了几种方法，有的方法很复杂，不打算用，我们只用最简单粗暴的；只要之前的帐号信息没有丢失，又可以进入系统就OK了，于是：

![image_1c0q0bnonde9a9omqa1092a1747.png-85.9kB][9]

注意实际操作过程中发现不是`/User/Shared/Jenkins/Home`下的config.xml，也不是`/User/Shared/Jenkins/Home/users`下的config.xml，而是**你自己用户目录**`~/.jenkins/`下的config.xml，具体原因可能是jenkins运行的工作空间是当前用户目录下的`.jenkins`，然后就是这样：

![image_1c0q277tu152r9mg1dhg1edq8jp5q.png-55.9kB][10]

经检验，无误，可进入，但是好像遗留了一个问题，就是这样进入的话就找不到管理用户的选项了；解决问题，勾选图中黄色圈，返回系统管理，出现管理用户（还是个隐藏道具）；
![image_1c0q3ukis1vlhib71uij1729ohs67.png-33.1kB][11]

![image_1c0q419b0164pqfe25d9br1fpt74.png-39.8kB][12]

![image_1c0q42m3mvf41d8fjs21ptb1ae77h.png-11.4kB][13]

搞的像是特工登录非授权帐户一样，不管怎么说，总算是攻破了，进入下一关；

## 关卡 4：
先不管工程构建里那一堆设置，我们先来搞一下证书Cer，钥匙Keychain，配置文件Provisioning Profiles的一些问题：
首先去系统管理 -> 管理插件 -> 可选插件，搜索并安装Keychains and Provisioning Profiles Management插件；
进入插件：
![image_1c0qeblep1tcj4m319ap1bek783ah.png-31.1kB][14]

不要关键去填下面的空，我会告诉你这是一道有选项的题目；进入文件目录，`Command + shift + G`，写下这样的路径`~/资源库/Keychains`，

![image_1c0qekdqp9v712rd1gefjdr1fdcbe.png-62.2kB][15]

这里我们把login.keychain-db上传到Jenkins里，但是Upload并不能上传这样后缀的文件，所以需要你手动把login.keychain-db修改成login.keychain（复制后再修改，以防止其他地方会引用到带-db）；上传完成后就会在下面出现你一些信息；然后打开你的钥匙串，这个知道在什么地方吧；

![image_1c0qet898q8m118mk2s6kj1cq5eb.png-131kB][16]

点击打包所用到的证书，将红色框中的名称复制出来，添加到identities中；

![image_1c0qf02rofnpc3r121c1nlb1mqteo.png-42.7kB][17]

如果有多个，则点击Add Code Signing Identity添加；

然后是PP文件，这些文件需要我们从系统PP文件夹下复制到Jenkins资源文件夹下，如下图两个路径：
这个是系统PP文件目录
![image_1c0qkdte41j1rgq81k8v1bi19f4f5.png-144.2kB][18]
这个是Jenkins PP文件目录
![image_1c0qkkk833p0nt18andthn9qfi.png-79.2kB][19]

Provisioning Profiles Directory Path 填写成，注意替换为自己的username：

```
/User/{USERNAME}/Library/MobileDevice/Provisioning Profiles
```
接着去你苹果帐号里去找你对应打包所需要的PP文件，然后点upload上传到Jenkins环境里；
以上，证书部分解决；

## 关卡 5
创建项目过程我们会对各个需要的项进行逐个描述：
点新建项目，输入项目名称，选择 构建一个自由风格的软件项目，然后确定，进入配置页面。
![image_1c0ql3ppk1bht1b5ms4hcui1jpjfv.png-8.2kB][20]

+ General
这个部分的内容都很浅显，没有什么可以说的，根据需要自行填充；这里说一下GitLab connection选项，因为我自己的工程是用gitlab管理的代码，所以需要在Jenkins里下一个Gitlab的插件，然后在里面进行帐号配置，可以采用帐号密码以及SSH的方式，具体这个部分会有一个SSH的坑，先不作分析，后面会讲到，我这里先用帐号密码的方式进行构建，经检验发现SSH方式非必要；

**Credentials**在这里配置：
![image_1c0qljaq610ljc02k6g1r821fs5gc.png-78.2kB][21]

+ 源码管理
这里我选的Git，**Repository URL**填你工程的git地址，选用帐号密码的形式应该是以http或https开头的，**Credentials**填你在上一步中新建好的，
![image_1c0qlt20313duogl2g51hp11nqsgp.png-73kB][22]
**Branch Specifier (blank for 'any')**	填你要进行构建的分支，我这里是`*/release`；

这里我们PS一个隐藏BOSS：
```
returned status code 143 jenkins
ERROR: Error fetching remote repo ‘origin’
```
这个报错是工程配置结束后进行构建后提示的，我当时搞这个发现远程代码明明是已经拉取到本地的，只是在拉取过程中会发生中断，本人在进行了将近50次试错后发现这个拉取到本地的代码率是变化的，先前以为是SSH帐号的问题，于是转头花了一天的时间搞了下SSH，后来SSH搞通后发现该问题仍然存在，后来终于在经历百度，谷歌，搜狗也用上的（不得不说有时候百度搜不出来的搜狗能搜到），发现了几篇有用的，后来解决，也算是不负辛苦，后面有踩坑的伙伴多注意，前车之鉴后事之师；

[http://blog.sina.com.cn/s/blog_72ef7bea0102vo9w.html][23]
[https://issues.jenkins-ci.org/browse/JENKINS-20445][24]
[https://stackoverflow.com/questions/35069079/jenkins-git-plugin-timeout-when-try-to-pull-repositoty-using-ssh][25]

解决方案就在于这个**Timeout**，相信你看了这个单词就知道是怎么回事了：
![image_1c0qmnlafh2p1j571b4ettv1ncah6.png-74.3kB][26]

另顺便粘一个code 128的链接，是个与该问题相关的问题，因为这些问题关键字有的重复，所以搜出来的文章有时会误导，所以请仔细辨别：
```
returned status code 128 jenkins
ERROR: Error cloning remote repo 'origin'
stderr: Permission denied (publickey).
```
[http://wantcoding.com/?p=293][27]
[这个链接是附送的，进去多看看你会有惊喜，还有QQ群哦][28]



  [1]: https://jenkins.io
  [2]: http://static.zybuluo.com/usiege/uowhxmph61xngu3l2t4hxamh/image_1c0ptnl2j13mh1mn2hmk18qf7usp.png
  [3]: http://static.zybuluo.com/usiege/s46xl40yzd7t5gijpwdippc9/image_1c0pu09in491qq31bqs25f1hbg26.png
  [4]: localhost:8080
  [5]: http://static.zybuluo.com/usiege/fn2f1wx006r3chny2t5u9atc/image_1c0pvjgjqfbg3i01c371uhc1ves2j.png
  [6]: http://static.zybuluo.com/usiege/sfnjgdq201o27xta3ttqllkr/image_1c0pvl71n5dulcc413164i1hcp30.png
  [7]: http://static.zybuluo.com/usiege/ltc8z86hbmzy78857uo767zr/image_1c0pvm8al1tce1iled5voi216ac3d.png
  [8]: http://static.zybuluo.com/usiege/ub5cnhcl82hyed8j8aqghlna/image_1c0pvp2p01fon1h2mmvjs6s1fuj3q.png
  [9]: http://static.zybuluo.com/usiege/ihh8n31m9fb1r9gomahd7l6d/image_1c0q0bnonde9a9omqa1092a1747.png
  [10]: http://static.zybuluo.com/usiege/rmn1oao4inl6rvryb8ne596c/image_1c0q277tu152r9mg1dhg1edq8jp5q.png
  [11]: http://static.zybuluo.com/usiege/v5zxzwu4pex59s78odynkkd6/image_1c0q3ukis1vlhib71uij1729ohs67.png
  [12]: http://static.zybuluo.com/usiege/bxyfaeid922e3lf7dvuz9mh8/image_1c0q419b0164pqfe25d9br1fpt74.png
  [13]: http://static.zybuluo.com/usiege/burf10v126vjx00u2ym0h2bn/image_1c0q42m3mvf41d8fjs21ptb1ae77h.png
  [14]: http://static.zybuluo.com/usiege/kgy8eq7ug16g0o1o4eotp3bw/image_1c0qeblep1tcj4m319ap1bek783ah.png
  [15]: http://static.zybuluo.com/usiege/ebpz8l8bnnvlrr6oi3a0423h/image_1c0qekdqp9v712rd1gefjdr1fdcbe.png
  [16]: http://static.zybuluo.com/usiege/w9l7f921rn6he0vx1vcqmu6a/image_1c0qet898q8m118mk2s6kj1cq5eb.png
  [17]: http://static.zybuluo.com/usiege/zc1wu103t1woz01fp07s80b7/image_1c0qf02rofnpc3r121c1nlb1mqteo.png
  [18]: http://static.zybuluo.com/usiege/peonwampxc6wa9h3i2yuhfm5/image_1c0qkdte41j1rgq81k8v1bi19f4f5.png
  [19]: http://static.zybuluo.com/usiege/v0firte6p13gwec9a133ixi1/image_1c0qkkk833p0nt18andthn9qfi.png
  [20]: http://static.zybuluo.com/usiege/1ytel52lwidafke7uv5rmgb0/image_1c0ql3ppk1bht1b5ms4hcui1jpjfv.png
  [21]: http://static.zybuluo.com/usiege/f6pv0rsip2oirn32m01agp1l/image_1c0qljaq610ljc02k6g1r821fs5gc.png
  [22]: http://static.zybuluo.com/usiege/bzufeuzktht55r97i2bsem18/image_1c0qlt20313duogl2g51hp11nqsgp.png
  [23]: http://blog.sina.com.cn/s/blog_72ef7bea0102vo9w.html
  [24]: https://issues.jenkins-ci.org/browse/JENKINS-20445
  [25]: https://stackoverflow.com/questions/35069079/jenkins-git-plugin-timeout-when-try-to-pull-repositoty-using-ssh
  [26]: http://static.zybuluo.com/usiege/firl86lawiru1uvz1jhelb28/image_1c0qmnlafh2p1j571b4ettv1ncah6.png
  [27]: http://wantcoding.com/?p=293
  [28]: http://www.cnblogs.com/EasonJim/p/6266892.html