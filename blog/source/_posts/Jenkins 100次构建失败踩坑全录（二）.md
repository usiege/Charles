title: Jenkins 100次构建失败踩坑全录（二）
date: 2017-12-10 20:53:00
categories: coder
tags: [jenkins]
-----------

接上篇，继续踩坑，下面到构建触发器环节：

+ 构建触发器
![image_1c0qnmug31v0hvkf1pp1kqf1bir9.png-91.5kB][1]
能用到的发图所示，说明在下方，自行研究，需要注意的一点是图中的*号之间是有空格的；

+ 构建环境
这里又有一个超时，与上面的无关，这个是构建过程中的，根据需要添加，下面那个选项是时间戳；
![image_1c0qooi0dkg7ls9abefu71n77p.png-38.6kB][2]

接下来是Keychains和Mobile PP，必填项；
![image_1c0qosdhm132q23k103kckp1dok16.png-8kB][3]

逐个击破：
Keychains部分
![image_1c0qovfpn1n431vc7n8qonb8o51j.png-83.2kB][4]
这个部分也是选择题，因为之前你已经上传了，但是这里会出现无法选择的bug，点保存刷新下页面就可以选了，Variables部分填如下：
```
${KEYCHAIN_PATH} ${KEYCHAIN_PASSWORD} ${CODE_SIGNING_IDENTITY}
```
Mobile Provisioning Profiles部分
![image_1c0qprhce18lu1vjb1pd1aakjv20.png-47.6kB][5]
这个部分同上，请选择你确定的PP文件，一定要对应好：
```
${PROVISIONING_PROFILE}
```

+ 构建

整个配置过程最重要的部分，大多数问题都出在这里，我这里目前到了Archive阶段，也就是说归档成功，然后归档结果可以用xcode进行ipa打包，具体打包还要设置一个shell脚本，网上好多，有的可以用有的不可以，所以打算研究下这个脚本，自己写一个再上传，之后会在博客中跟进，现在先继续把已完成的部分写下来；

首先是先要加一个结束后的脚本，这个脚本不做打包操作，只是设置一下环境，以及配置一下有pod依赖的情况，如下：
```
#!/bin/bash -l
export LANG=en_US.UTF-8
export LANGUAGE=en_US.UTF-8
export LC_ALL=en_US.UTF-8

pod install --verbose --no-repo-update
open LeWaiJiao.xcworkspace
```
![image_1c0qqc2ubcfq5tvuui19m3oi89.png-47.4kB][6]

下面的那个**Pack application,build and sign** .ipa项就是打ipa的功能，暂时没有搞通，后续会补上来，先跳过；

![image_1c0qqnucp1np81vaj3rs1l7p1otdm.png-97.4kB][7]

**Code signing & OS X keychain options**

下面的bundleID是你要进行打包的bundleID，info.plist是workspace下的路径，注意一下下面的Development Team ID这个ID是你的钥匙串上的证书名称，后面括号里的那一串字符，由字母和数字组成的，需要你自己做对应，下面的照着抄就行了，password填你电脑用户的密码，不要填错了；

![image_1c0qr7dli1unv1s7s1vu2ugm1fuh13.png-102.7kB][8]


贴几个Error：
=========

```
Code Signing Error: Code signing is required for product type 'Application' in SDK 'iOS 11.1'
```
需要你在xcode中设置，然后上传到你们的Git服务器再构建：
![image_1c0qs83ul1baipc04otg331geb1g.png-35.4kB][9]

```
No global development team or local team ID was configured.
```

就是之前说的**Development Team ID**部分，填了就解决了；
[http://www.jianshu.com/p/8b2fc2da0466][10]

```
xcodebuild: error: The flag -scheme is required when specifying -archivePath but not -exportArchive.
```
这个问题也是个大坑，找了好久，也是搜狗找到的：
[http://www.jianshu.com/p/8967e4e27e9b][11]
[https://www.tuicool.com/articles/zQ73Q3Q][12]
[https://github.com/jenkinsci/clang-scanbuild-plugin/commit/b970f5280a9c1929e9cd9d3b4d2b76a7d6cbc0dc][13]

解决方法最直接的就是指定scheme和xcode workspace file，分别填你xcode工程中的scheme和pod生成的xcworkspace的名字；
![image_1c0r0aqt33tdthopme188a2kk1t.png-87.3kB][14]

有些同学不知道scheme在什么地方，如下图所示：
![image_1c0r0eai5f09qj47rs134c1upu2a.png-145.6kB][15]


如上，能保证构建可以成功在Archive过程完成，如遇其他问题，欢迎评论区讨论；
之后会再继续完成打包ipa以及上传平台，同时之前提过的SSH部分会持续跟近，因为SSH与本文所讨论的内容并不十分吻合，所以这里不作讨论。


  [1]: http://static.zybuluo.com/usiege/it14w81rja3zme63xykjxy5o/image_1c0qnmug31v0hvkf1pp1kqf1bir9.png
  [2]: http://static.zybuluo.com/usiege/pjeg3kt1s3cb0rxb2l1dfsfr/image_1c0qooi0dkg7ls9abefu71n77p.png
  [3]: http://static.zybuluo.com/usiege/cjtc66sg8991c5ulj3uib8dq/image_1c0qosdhm132q23k103kckp1dok16.png
  [4]: http://static.zybuluo.com/usiege/li5lfp7spsd6c3bw435besbb/image_1c0qovfpn1n431vc7n8qonb8o51j.png
  [5]: http://static.zybuluo.com/usiege/1s0il4bxtsop1ame15pbq0ul/image_1c0qprhce18lu1vjb1pd1aakjv20.png
  [6]: http://static.zybuluo.com/usiege/rxby0iwous3ppc63wyn1c83y/image_1c0qqc2ubcfq5tvuui19m3oi89.png
  [7]: http://static.zybuluo.com/usiege/eceobb4arpah1xacmv2lmxrr/image_1c0qqnucp1np81vaj3rs1l7p1otdm.png
  [8]: http://static.zybuluo.com/usiege/xhxhseh11fwg4wnbt8gpj95y/image_1c0qr7dli1unv1s7s1vu2ugm1fuh13.png
  [9]: http://static.zybuluo.com/usiege/r85b8hxub85tfinbuzue1svp/image_1c0qs83ul1baipc04otg331geb1g.png
  [10]: http://www.jianshu.com/p/8b2fc2da0466
  [11]: http://www.jianshu.com/p/8967e4e27e9b
  [12]: https://www.tuicool.com/articles/zQ73Q3Q
  [13]: https://github.com/jenkinsci/clang-scanbuild-plugin/commit/b970f5280a9c1929e9cd9d3b4d2b76a7d6cbc0dc
  [14]: http://static.zybuluo.com/usiege/tlotqzvjbjlqk2ms1u43w2yd/image_1c0r0aqt33tdthopme188a2kk1t.png
  [15]: http://static.zybuluo.com/usiege/1y4937ijhbvifle7jfgjg3ac/image_1c0r0eai5f09qj47rs134c1upu2a.png