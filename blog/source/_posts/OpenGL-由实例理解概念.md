title: OpenGL-由实例理解概念
date: 2016-07-10 22:00:00
categories: coder
tags: [opengl, render]
-----------

Summary:本篇讲一下关于OpenGL图形管线的一些基础知识，刚开始的内容会比较枯燥，后面会用几个例子讲解几种渲染方法，下载git上的例子可以在xcode上看到几种渲染的效果。可展示的效果有，正面和背面剔除、深度测试、多边形偏移、裁剪、混合、多重采样。



本篇讲一下关于OpenGL图形管线的一些基础知识，刚开始的内容会比较枯燥，后面会用几个例子讲解几种渲染方法，下载git上的例子可以在xcode上看到几种渲染的效果。可展示的效果有，正面和背面剔除、深度测试、多边形偏移、裁剪、混合、多重采样。

git地址：[点击这里](https://github.com/usiege/OpenGL_S/tree/master/OpenGL_03_基础渲染/OGL_03_BaseRender)（这里做一下说明，在研究例子的过程中，请无视掉GLTools库，该库是原书作者对gl的一次封装，内部实现接下来会逐层展开，我们现在只讨论与gl有关的内容，后期的话我们可以自己实现封装。）

## 将点连接起来

上篇讲了运用gl画线函数画出直线与折线，本篇作一些补充。

- 点的大小

`void glPointSize(GLfloat size);`

该函数可以指定绘制点的像素，不过并不是所有点的大小都能够支持，使用前请确认指定的点大小是可用的；利用下面这段代码可以获得点大小的范围，以及最小间隔：

```
GLfloat sizes[2];	//存储支持的点的大小范围
GLfloat step;			//存储支持点的大小增量

//获取支持的点的大小范围和增量
glGetFloatv(GL_POINT_SIZE_RANGE,sizes);
glGetFloatv(GL_POINT_SIZE_GRANULARITY,&step);
```
点总是正方形的像素，改变点大小情况也如此；

另外还可以通过使用程序点大小模式来设置点大小，这样的话需要在顶点着色器或几何着色器代码中设置点的大小，这两种编程方法将在后面讲到；

```
glEnable(GL_PROGRAM_POINT_SIZE);
//该模式允许通过着色器程序修改点大小
gl_PointSize = 5.0;
//在着色器程序中，修改该内建变量的值
```

- 线的宽度

`void glLineWidth(GLfloat width);`

该函数可以指定线段的宽度，它是改变线段宽度的唯一方式；

- 线带

连续的从一个顶点绘制线段，以形成一个连接起来的线带，使用`GL_LINE_STRIP`可绘制一组连接起来的线段；

- 线环

如果想要使上面的线带是闭合的，那么使用`GL_LINE_LOOP`会是不错的选择；

- 三角形环绕

>指定三角形时，点绘制的顺序与方向是不同的，使用这种结合来指定的方式叫做环绕。

默认情况下，OpenGL认为具有逆时针方向环绕的多边形是正面的，如想修改默认的行为：

`glFrontFace(GL_CW);`

`GL_CW`参数告诉OpenGL顺时针环绕多边形将被认为是正面的；如需恢复逆时针，可以使用参数`GL_CCW`;

- 三角形带

当我们需要一串相连的三角形时，可以使用`GL_TRIANGLE_STRIP`图元绘制相连的三角形，这样可以节省大量时间；

- 三角形扇

使用`GL_TRIANGLE_FAN`可以创建一组围绕一个中心点的相连三角形；

本文地址工程目录Primitives展示了以上几种图形的画法；

## 基础渲染方式

### - 油画法

绘制三角形时，如果出现覆盖的情况，通常的做法是对三角形进行排序，然后首先画那些较远的三角形，再在上方渲染那些较近的三角形，这种方式称做“油画法”；这种方法在图形处理中是非常低效的；

### - 正面和背面剔除

前面讲到三角形有正面与背面的区分，对其进行区分的原因之一就是为了进行剔除；选择不必要的面进行剔除会极大地提高性能；剔除按如下方式开启：

```

glEnable(GL_CULL_FACE);		//开启
glDisable(GL_CULL_FACE);	//关闭

```

我们并没有指明剔除的面，如下：

```

void glCullFace(GLenum mode);

GL_FRONT	//剔除正面

GL_BACK	//剔除背面

GL_FRONT_AND_BACK //正反面全部剔除
```

### - 深度测试

在绘制一个像素时，将一个值（z值）分配给它，表示它到观察者的距离；当另外一个像素在同样位置进行绘制时，新像素z将与原来的进行比较，我们只绘制z值更小的像素；

启用深度测试：

`glEnable(GL_DEPTH_TEST);`

### - 多边形模式

函数*glPolygonMode*允许将多边形渲染成实体、轮廓或只有点，而且可以选择在多边形的正反面上启用该模式；

```

void glPolygonMode(GLenum face, GLenum mode);

//face

GL_FRONT

GL_BACK

GL_FRONT_AND_BACK

//mode

GL_FILL		//默认值，实心

GL_LINE		//轮廓

GL_POINT		//点
```

本文例子GeoTest会展示这些效果；

### - 多边形偏移

举个例子，我们可能想要绘制一架大型飞机，然后在飞机上一个较小的但却与飞机在同一物理空间的图形，这叫做“贴花”；这个小的图形的深度值将会与原来飞机的深度缓冲区中的值相同，这将导致深度测试不可预料的通过或者失败，这种情况叫做z冲突；

另外一种情况，我们想要在绘制的实心几何图形上突出它的边；以上这些z冲突的情况下，通常我们解决的办法是当深度值相同时，适当的对深度进行偏移而并不改变实际3D空间中的物理位置：

```
void glPolygonOffset(GLfloat factor, GLfloat units);
//函数通过 Depth offset = (DZ * factor) + (r * units) 公式计算新的深度值；
//其中，DZ是深度值相对于多边形屏幕区域的变化量，r是使深度缓冲区值产生变化的最小值；

```

例子Primitives的`DrawWireFramedBatch`函数代码中展示了偏移的使用;

```
```

### - 裁剪

裁剪是将渲染限制在一个较小的矩形中，如要开启裁剪：

`glEnalbe(GL_SCISSOR_TEST);`

指定窗口：

```
void glScissor(GLint x, GLint y, GLsizei width, GLsizei height);
//x,y指定裁剪框左下角，width height则指定宽度和高度
```

例子Scissor展示了该函数的用法:

```
	// Clear blue window
    glClearColor(0.0f, 0.0f, 1.0f, 0.0f);
    glClear(GL_COLOR_BUFFER_BIT);
    
    // Now set scissor to smaller red sub region
    glClearColor(1.0f, 0.0f, 0.0f, 0.0f);
    glScissor(100, 100, 600, 400);
    glEnable(GL_SCISSOR_TEST);
    glClear(GL_COLOR_BUFFER_BIT);
    
    // Finally, an even smaller green rectangle
    glClearColor(0.0f, 1.0f, 0.0f, 0.0f);
    glScissor(200, 200, 400, 200);
    glClear(GL_COLOR_BUFFER_BIT);
    
    // Turn scissor back off for next render
    glDisable(GL_SCISSOR_TEST);
    
```

### - 混合

当深度值相同时，使用混合也可以使下层的颜色值不会被清除；开启混合使用：

`glEnable(GL_BLEND);`

> 目标颜色：已经存储在颜色缓冲区中的颜色值；


> 源颜色：作为当前渲染命令的结果进入颜色缓冲区的颜色；

混合功能开启后，目标颜色和源颜色的组合方式是由混合方程式控制的；

>> Cf = (Cs * S) + (Cd * D)

>Cf是最终计算产生的颜色，Cs是源颜色，Cd是目标颜色，S、D分别是源和目标混合因子；

>注意Cs和Cd都是向量，以上进行的是向量乘法和加法；

混合因子是用函数进行设置的：

```
glBlendFunc(GLenum S, GLenum D);
//S D都是枚举值，详细请自行google，这里给出枚举值
```

混合方程式并不是唯一的，如需改变则：

```
void glBlendEquation(GLenum mode);

GL_FUNC_ADD						//Cf = (Cs * S) + (Cd * D)

GL_FUNC_SUBTRACT					//Cf = (Cs * S) - (Cd * D)

GL_FUNC_REVDRSE_SUBTRACT		//Cf = (Cs * D) - (Cd * S)

GL_MIN								//Cf = min(Cs,Cd)

GL_MAX								//Cf = max(Cs,Cd)
```

另外：

`void glBlendFuncSeparate(GLenum srcRGB,GLenum dstRGB,GLenum srcAlpha,GLenum dstAlpha);`

可以指定源和目标的RGB颜色与Alpha颜色不同的混合函数；

`vodi glBlendColor(GLclampf red,GLclampf green,GLclampf blue,GLclampf alpha);`

可以指定混合一个常量混合颜色，初始为黑色（0,0,0,0）；

### - 抗锯齿

由于像素是正方形的，混合时通常可以相当清楚地看到两种颜色的分界，它们常常被称为锯齿，为了消除锯齿，使用混合功能并开启锯齿，使边缘变得平滑；具体使用方法如下代码：

```
		 switch(value)
        {
        case 1:
            // 打开抗锯齿，并给出关于尽可能进行最佳的处理的提示
			  glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
            glEnable(GL_BLEND);
            glEnable(GL_POINT_SMOOTH);
            glHint(GL_POINT_SMOOTH_HINT, GL_NICEST);
            glEnable(GL_LINE_SMOOTH);
            glHint(GL_LINE_SMOOTH_HINT, GL_NICEST);
            glEnable(GL_POLYGON_SMOOTH);
            glHint(GL_POLYGON_SMOOTH_HINT, GL_NICEST);
            break;

        case 2:
            // 关闭混合和所有的平滑处理
			  glDisable(GL_BLEND);
            glDisable(GL_LINE_SMOOTH);
            glDisable(GL_POINT_SMOOTH);
            break;

        default:
            break;
        }
```

`glEnable(GL_POINT_SMOOTH);`就是开启抗锯齿；

`glHint(GLenum target, GLenum mode)`函数中target参数指定希望进行修改的行为类型，mode参数告诉OpenGL我们最关心的是什么，或渲染速度或输出质量；该函数是gl唯一一个行为完全依赖生产商的函数，总结呢是跟渲染的性能有关的函数，具体情况具体分析吧，这种函数一般很难实际看出效果；

### -多重采样

最后讲一下多重采样，上边讲到的平滑处理在点和直线上是广泛支持的，但是多边形的平滑处理并没有在所有平台上都得到实现，然而在`GL_POLYGON_SMOOTH`时，由于抗锯齿处理是基于混合操作的，需要对从前到后所有图元进行排序，这显然相当麻烦，使用多重采样可以解决这个问题；

多重采样时，当某一点上的像素进行更新时，gl会在一个缓冲区内对该像素上的值进行采样，结果会通过采样值产生一个单独的值，这可能对性能造成一定的影响；

打开多重采样：

`glEnable(GL_MULTISAMPLE);`

值得注意的一点是，当启用多重采样时，点、直线和多边形的平滑特性会被忽略；

多重采样的采样值是会被保存在一个单独的缓存区内的，如果没有多重采样缓存区，OpenGL就当作该功能是被禁用的；

>>状态排序

>打开或关闭不同的OpenGL特性将会修改驱动程序的内部状态，这种状态的改变可能会对渲染的性能造成影响。对性能非常敏感的程序员常常会不辞辛苦地对所有绘图命令进行排序，这样需要相同状态的几何图形就可以在一起绘制。这种状态排序是在游戏中常用的提高速度的方法之一。

多重采样缓和区在默认情况下使用片断的RGB值，并不包括颜色的alpha成分；我们可以调用`glEnable`来修改这个行为

```
GL_SAMPLE_ALPHA_TO_COVERAGE			//使用alpha值

GL_SAMPLE_ALPHA_TO_ON					//将alpha值设为1并使用它

GL_SAMPLE_COVERAGE						//使用glSampleCoverage设置的值
```

`void glSampleCoverage(GLclampf value, GLboolean invert);`函数允许指定一个特定的值，它是与片断覆盖值进行按位与操作的结果；


