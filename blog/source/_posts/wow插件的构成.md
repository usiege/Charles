title: World of WarCarft插件的构成
date: 2016-08-25 11:21:00
categories: wower
tags: [addons, wow, toc]
-----------

今天来说一说wow插件是个什么鬼？
<!-- more -->

插件是魔兽世界开放的第三个接口，有朋友会问，什么是第三方？这个是软件业的一个术语，简单的说，就是游戏当中能让我们自己来定制DIY的部分，比方说对话界面，还有一些数据显示之类的功能。

wow的插件全部保存在*World of Warcraft/Interface/AddOns*目录下，在这个目录下会有一些暴雪自带的功能插件，它们均是以*Blizzard_*开头的，我们自己做的插件可以随意命名，不同插件可以分别放在不同的文件夹下面（我们在做插件的过程中，强烈建议用英文命名，避免因为中文导致插件无法被识别的问题）。[http://www.townlong-yak.com/framexml/](http://www.townlong-yak.com/framexml/)这个网址可以下载暴雪自带插件。

说一下插件的构成，打开插件目录，你会发现大致会有三种类型文件，分别是toc文件，xml文件和lua文件。

## toc文件

这个文件是一个必要文件，它的名字与你的插件文件夹名字同名，只不过带了一个后缀toc，如果不同名的话，打开魔兽客户端将会无法识别你的插件；

注意！！！这个文件的每行开头不能有空格，每行仅作一个说明。

用文本工具打开toc文件，内容说明分三种类型：

### 以##开头的数据

用来进行插件描述，一般会有插件名称，作者名称，功能描述等；它的基本格式是

```
## 标签名：标签值
```

标签的名字可以随便写，但是有一些wow自带的标签名我们进行一下解释：

```
Interface:标记插件可用在的wow游戏版本，当该值小于低于当前游戏版本插件不会被加载；
Title:插件名称，这个会被显示在游戏选择人物的插件列表里；
Title-zhCN:插件的中文显示，如果想要在其他语言中显示，则修改-后面的就可以了；下面的Notes也是如此；
Notes:插件列表中，鼠标移到插件名上时显示的信息；
RequiredDeps, Dependencies, 或者任意以 "Dep" 开始的字符串：表示我们当前的插件必须需要加载的其他插件；
OptionalDeps:与上面的对照，这里的插件是可选的；
LoadOnDemand:值为1时，表示这个插件不会在游戏开始就加载，而是在需要的时候才加载；
LoadWith:如果上面的值为1时，本条所描述的插件会随着本插件一起加载；
LoadManagers:本条中所描述的插件如果都不存在的话，则会自动加载本插件；如果有一个存在，则按LoadOnDemand值为1处理；
SavedVariables:一些以逗号分割的变量名称，这些变量会被保存在硬盘上，下次加载时可以被读取到；
SavedVariablesPerCharacter:与上面的标签是相同的作用，不过该标签只用于保存不同角色的不同配置；
DefaultState:本插件默认开启状态，值为disabled/enabled；
Author:作者名字
Version:插件的版本号

```

另外你可以定义自己的标签，以上中最重要的就是前两个，尽量不要出错；

### 本插件需要加载的代码文件

列出需要加载的代码类文件，只支持lua和xml两种格式，这里的文件需要给出以当前目录为根目录的文件完整路径，就是说如果你插件目录下有一个`myaddon.lua`的文件则需要添加：

```
myaddon.lua
```
而如果你插件目录下有一个子文件夹*MyAddon*，而该目录下有一个`myaddon2.lua`的话，则需要添加：

```
MyAddon/myaddon2.lua
```

### 以#开头的文件

这些是注释文本，在toc中可以随便添加，主要用作插件制作者自己记录，这些不会被插件加载；


## XML文件

xml文件主要用于插件的界面制作，以及事件绑定，事件绑定通俗的讲就是你对插件做某些操作（按一个按钮之类的）游戏中会出现的事件，这些事件会以一个方法的形式出现在lua文件中，你可以把你自己想做的事情写在这个方法中，如果你学过些编程，应该知道我们这里说的方法就是lua函数；

在你插件的根目录下会有一个叫做**Bindings.xml**的文件，这个文件会被游戏客户端自动读取，不必写在toc文件中；

我们来看一个该文件的例子：

```
<Bindings> 
    <Binding name="CUBE_CODE" header="CUBE"> 
      if IGAS.UIParent.Cube_Main then 
         IGAS.UIParent.Cube_Main.Visible = not IGAS.UIParent.Cube_Main.Visible 
      end 
    </Binding> 
    <Binding name="CUBE_DEBUG"> 
      if IGAS.UIParent.Cube_Debug then 
         IGAS.UIParent.Cube_Debug.Visible = not IGAS.UIParent.Cube_Debug.Visible 
      end 
    </Binding> 
</Bindings>
```


我们暂时先不要管这些代码的意思，只需要知道这个文件设置了界面元素与游戏事件的绑定，而绑定的事件是由Lua文件完成的；**Bindings.xml**文件绑定了一个与插件名同名的lua文件，并且还将界面上的元素与该文件所描述的事件绑定在了一起：

```
-- Binding Text 
_G.BINDING_HEADER_CUBE = L["Cube"] 
_G.BINDING_NAME_CUBE_CODE = L["Simple Dev Tool"] 
_G.BINDING_NAME_CUBE_DEBUG = L["Simple Debug Tool"]

```

我们现在先不要管他们是怎么联系起来的，具体我们在之后的写代码过程中会慢慢讲到，现在只要理解一点，xml会定义我们的界面，并且还可以设置界面元素与事件的绑定，而绑定的事件会交由lua文件处理；

我们还可以加载其他的xml和lua文件，如下例：

```
<Ui xmlns="http://www.blizzard.com/wow/ui/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.blizzard.com/wow/ui/..\FrameXML\UI.xsd"> 
   <!-- Init --> 
   <Script file = "IGAS_Toolkit.lua"/> 

   <!-- Modules --> 
   <Include file = "Modules\AutoRepair\AutoRepair.xml"/> 
   <Include file = "Modules\AutoSell\AutoSell.xml"/> 
</Ui>
```

其中**<** **/>**这间的就是xml文件的标签，标签的类型会由**<**后面的名称标识，如上`Script`这个标签用于加载lua文件，而`Include`用于加载其他的xml文件；

## lua文件

Lua是wow插件逻辑的主要语言，做插件前需要先熟悉一下lua的语法，感兴趣的不防去知乎下搜索一些学习的建议，找一些入门的资料，在我的公众号给我留言，我们可以一起学习探讨下；这里我们给一些简短的片断，目的是了解一下它的作用；

假设我们现在做一个插件，名为DHAddon（想想DH是不是恶魔猎手的缩写呀？Devil Hunter?），插件里有两个Lua文件devil.lua hunter.lua;

wow加载它们的方式，类似下面的代码：

```
-- Load DHAddon 
local DHAddon = {} 

f = loadfile("devil.lua") 
f( "DHAddon", DHAddon ) 

f = loadfile("hunter.lua") 
f( "DHAddon", DHAddon )
```

loadfile就是加载文件，文件名称用字符串表示（lua语法“”表示字符串）；加载的结果保存在f中；

devil.lua:

```
local addonName, addon = ... 

print(addonName .. " is loaded.") 

addon.DHAddon = 123

```

hunter.lua:

```
local addonName, addon = ... 

print( "DHAddon is " .. addon.DHAddon )
```

不出意外的话，运行结果会是：

DHAddon is loaded.
DHAddon is 123

另外上面的两个lua文件也可以下面这么写，其中有好多lua的内容，暂不解释原因，贴在这里之后了解到了再来回顾：

```
-- 插件第一个Lua文件使用，这行代码确保以下的代码以addon为环境，而不是以_G为环境， 
-- 并且在addon环境中可以访问_G的任意变量，访问的变量值也将存储到addon中，便于下次直接访问 
-- 下面的代码定义的全局变量都将保存在addon表中，而非_G 
setfenv(1, setmetatable(select(2, ...), { __index = function(self,  key) local v = _G[key]; rawset(self, key, v); return v end })) 

function testA() 
    print("devil case A") 
end

```
```
-- 插件的其他lua文件仅需要设置运行环境 
setfenv(1, select(2, ...)) 

-- devil.lua 中定义的函数可以被直接调用 
testA()

```

插件的构成就说这么多，好多东西不是很懂，慢慢深入了解就好了；本篇就到这了，有兴趣的可以关注公众号“艾泽拉斯日常”，我们一同来探讨...