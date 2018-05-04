title: Python-pelican搭建个人博客
date: 2015-12-11 09:23:00
categories: coder
tags: [python, pelican]
-----------

Summary:  本文使用python pelican搭建个人静态博客，并上传到个人git仓库，实现访问个人博客，本文作者所用就是基于该博客的个人主页。
<!-- more -->

>PS：提升到系统root权限：$ sudo -s；

### 1.安装git；
### 2.安装pip过程：

查看pythion安装目录：
`$ which python`
/usr/local/bin/python
安装pip:
`$ sudo easy_install pip`
第一次输入时出现无法安装，则可以选择进行下面的安装；
安装最新版本的python,pip&setuptools:
`$ brew install python`
>PS:brew 又叫Homebrew，是Mac OSX上的软件包管理工具，能在Mac中方便的安装软件或者卸载软件，只需要一个命令,非常方便brew类似ubuntu系统下的apt-get的功能,http://brew.sh/ 安装方法如下：`$ ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go)"`

详细请见：http://www.cnblogs.com/TankXiao/p/3247113.html
### 3.安装virtualenv:

`$ pip install virtualenv`
### 4.创建虚拟环境：

```
$ virtualenv ~/virtualenv/pelican
$ cd ~/virtualenvs/pelican
$ source bin/activate
```
### 5.安装pelican：

`$ pip install pelican`
### 6.安装markdown,typogrify：

`$ pip install markdown`
`$ pip install typogrify`
### 7.创建博客站点：

```
$ mkdir blog
$ cd blog
$ pelican-quickstart
```
pelican-quickstart执行命令后，会提示输入博客的配置项，除了少数几个必填以外，其它都可以选择默认，而且都可以在pelicanconf.py文件中进行更改，所以你可以随意选择。 命令成功执行后，会出现pelican的框架，如下所示

blog/


├── content                # 存放输入的markdown或RST源文件


│   └── (pages)            # 存放手工创建的静态页面，可选


│   └── (posts)            # 存放手工创建的文章，可选


├── output                 # 存放最终生成的静态博客


├── develop_server.sh      # 测试服务器


├── Makefile               # 管理博客的Makefile


├── pelicanconf.py         # 配置文件


└── publishconf.py         # 发布文件，可删除



### 8.选择博客主题：

在blog目录下，各页面主题可以在这个网址查看Pelican themes  http://pelicanthemes.com/, 克隆主题开源库 https://github.com/getpelican/pelican-themes
- 克隆主题到本地
`$ git clone https://github.com/getpelican/pelican-themes.git`

- 打开pelicanconf.py配置文件，更改或添加THEME为自己喜欢的主题，例如本博客所挑选的elegant，更多的配置含义请关注官方文档。
- 注意下面的这个主题需要填主题的目录路径

`THEME = 'pelican-themes/gum'`

添加评论系统:

开启个人博客的原因在于分享知识，分享就需要交流，评论模块当然少不了。在Disqus上申请帐号，按照流程Disqus会分配给你站点的Shortname，记牢Shortname，如果忘了请进入admin/settings中查看。然后同理，在pelicanconf.py添加

`DISQUS_SITENAME = Shortname`

生成博客站点:

`$ Site generation`

`$ pelican /path/to/your/content/ [-s path/to/your/settings.py]`


PS：上面的这个路径是你自己博客的content路径；

预览生成的站点

For Python 2, run:

```
$ cd output
$ python -m SimpleHTTPServer
```

For Python 3, run:

```
$ cd output
$ python -m http.server
```
### 9.环境建好之后的事情：

OK,到这里，pelican的环境部分我们已经配置完了，不过博主好奇刚才pelican的安装些什么了？也就是说pelican的依赖项：
>
- feedgenerator, to generate the Atom feeds
- jinja2, for templating support
- pygments, for syntax highlighting
- docutils, for supporting reStructuredText as an input format
- pytz, for timezone definitions
- blinker, an object-to-object and broadcast signaling system
- unidecode, for ASCII transliterations of Unicode text
- six, for Python 2 and 3 compatibility utilities
- MarkupSafe, for a markup safe string implementation
- markdown, for supporting Markdown as an input format

好家伙，这么多啊，都看看 发现都不错！之后用到了在展开慢慢来说。

现在，让我们看看pelican是多么神奇吧，

`$ pelican-quickstart`

运行命令之后，在当前目录下有以下的文件

yourproject/


├── content


│  └── (pages)


├── output


├── develop_server.sh


├── fabfile.py


├── Makefile


├── pelicanconf.py      # Main settings file


└── publishconf.py      # Settings to use when ready to publish



我来说说都是些什么吧，

content这里是放置你的博文的，例如我的hello_python.md文章；pages是让永和可以自己定制些页面，比如aboutme.md等等页面；

output这个目录下放置的就是一会利用pelican生成的静态博客内容，当然是html的；

pelicanconf.py，是博客的配置文件，后面慢慢讲；

Makefile，make命令的配置文件，如果你懂linux这个就so easy！不过不懂也没事。

develop_server.sh 本地服务的脚本;

大致看完这个之后，我们可以先写一篇自己的文章瞅瞅啊，文章模板如下：

Title: My super title


Date: 2010-12-03 10:20


Category: Python


Tags: pelican, publishing


Slug: my-super-post


Author: Alexis Metaireau


Summary: Short version for index and feeds



This is the content of my super blog post.

写完保存后，要有以下的几个命令来生成博客内容啦；

### 10.git上创建个人主页

首先在自己的git帐号下新建一个组织，填写组织名；添加一个repository:*usiege/usiege.github.com*(必须用自己用户名，且唯一)；这里需要解决git多用户的问题；将生成的静态页面push到repository中；此时可以访问username.github.com的静态页面；

利用下面的命令来生成你的博客site：

`$ make html`

我比较喜欢下面的这个命令，它是实时生成你的站点，就是说你修改你的博客什么的它会实时的生成！很棒吧。

`$ make regenerate`


ok，生成之后，我们要看下显示的效果，用下面的命令吧

`$ make serve`

下面这个我比较喜欢，理由同上面的那个regerate，哈哈

`$ make devserver`

至此，我们可以在本地浏览刚才建好的博客了，地址就是http://localhost:8000

停止服务器则是下面的命令：

`$ ./develop_server.sh>`

创建成功以后，便可以把生成的页面push到github。

```
$ cd output
$ git init
$ git add .
$ git commit -m "first commit"
$ git remote add origin https://github.com/xxx/xxx.github.io.git
$ git push -u origin master
```
关于上传的一些注意点：
 $ git push origin master
   git push命令会将本地仓库推送到远程服务器。
   git pull命令则相反。
   修改完代码后，使用git status可以查看文件的差别，使用git add 添加要commit的文件，也可以用git add -i来智能添加文件。之后git commit提交本次修改，git push上传到github。

