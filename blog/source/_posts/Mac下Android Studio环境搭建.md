title: Mac下Android Studio环境搭建
date: 2016-04-27 08:25:00
categories: coder
tags: [Android Studio, mac]
-----------

本篇还原了本人在Macbook pro上安装Android Studio2.0的过程，安装环境是OS X EI Capitan 10.11.4；
<!-- more -->

下载Java SDK包，Android Studio安装包，android SDK包，这些资源在http://www.android-studio.org/index.php/download这个网站上都可以找到；

![网站标题](http://upload-images.jianshu.io/upload_images/1429775-80f5a33c449dec04?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

首先安装Java SDK包，这个安装的时候比较容易，直接双击点开的包就可以了；

![JDK](http://upload-images.jianshu.io/upload_images/1429775-be1726d680728df3?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

安装Android Studio，打开安装包装包拖入到自己Applications中，

![SDK](http://upload-images.jianshu.io/upload_images/1429775-ec89f55cd82937b3?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

安装完成后双击，它会提示你要不要打开，这个时候先不要打开，在Applications中右击显示包内容，在Contents/bin下打开idea.properties文件，在文件末尾添加一行：

`disable.android.first.run=true`

这是因为Android Studio会去获取 android sdk 组件信息，这个过程相当慢，还经常加载失败，导致Android Studio启动不起开。解决办法就是不去获取android sdk 组件信息。这个慢的原因，是因为android网站被墙了，必须翻墙才能访问到！所以如果你的电脑已经翻墙了，那么完全可以跳过这一步。

接下来点打开，如果是先打开后修改的话它会提示你的包已经损坏，并让你删除；

然后就是配置android SDK的目录了，我们把下载下来的包放到一个不经常修改的目录下，然后记住它的目录，我的是

![SDK放在这里](http://upload-images.jianshu.io/upload_images/1429775-76fee3c672cffe2b?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Android SDK Location就写你的SDK放置的路径，

![image](http://upload-images.jianshu.io/upload_images/1429775-a4f081f44e57151c?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


然后点Next就可以了，点完之后电脑会反应一会，时间会比较长，不要以为它什么都没有在干，等一会就好了。

下一步我们来安装SDK，进入到设置好的SDK目录下，使用命令行进入tools目录，输入`./android sdk`请出SDK Manager图形界面，点击顶部菜单栏Android SDK Manager -> Preferences...

进入配置页面，http proxy server这里填写： mirrors.neusoft.edu.cn （感谢东软搭建国内的镜像服务器，为广大程序员造福无数），如果以上填写的不能下载，也可以试着填写mirrors.opencas.ac.cn（这个也是从网上找的，感谢这些人的贡献）

端口填写80，然后把Force https:// 前的勾勾上，然后点击mac顶部菜单Tools->Manage Add-on Site，把下面这堆网址：

http://mirrors.neusoft.edu.cn/android/repository/addon-6.xml

 
http://mirrors.neusoft.edu.cn/android/repository/addon.xml 


http://mirrors.neusoft.edu.cn/android/repository/extras/intel/addon.xml 


http://mirrors.neusoft.edu.cn/android/repository/sys-img/android-tv/sys-img.xml 


http://mirrors.neusoft.edu.cn/android/repository/sys-img/android-wear/sys-img.xml 


http://mirrors.neusoft.edu.cn/android/repository/sys-img/android/sys-img.xml 


http://mirrors.neusoft.edu.cn/android/repository/sys-img/google_apis/sys-img.xml 


http://mirrors.neusoft.edu.cn/android/repository/sys-img/x86/addon-x86.xml 


http://mirrors.neusoft.edu.cn/android/repository/addons_list-2.xml 


http://mirrors.neusoft.edu.cn/android/repository/repository-10.xml



全手动New加进去，然后就可以下载了

![image](http://upload-images.jianshu.io/upload_images/1429775-769d654f67efd23f?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

接下来点击安装，下面是我安装过程中截的图：

![等待良人归来那一秒。。。](http://upload-images.jianshu.io/upload_images/1429775-08a78264896a3537?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


接下来，你需要的是漫长的等待。。。。。。

你的Android Studio就安装完成了。


