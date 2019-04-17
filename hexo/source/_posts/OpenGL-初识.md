title: OpenGL-初识
date: 2016-06-15 10:00:00
categories: coder
tags: [opengl, glut]
-----------

看了OpenGLES已经有一段时间了，大致对这个3D库有了一些了解，之后就开始对这套API进行一下深入的研究学习。
<!-- more -->

学习主要是通过《计算机图形学》一书开展的，网上有什么红宝书蓝皮书什么的回头再看吧，学习要专注，你懂得。

首先要先了解一下GL和GLUT的概念，自己详细Google下，总之你得先了解你所要用的库以及库的功能，在这里简单提一下，GL是3D库的主要API框架，而GLUT则是一些工具，我们在x86_64或i386架构下使用Xcode所对应的头文件是：

## GLUT

```
#include <OpenGL/gl.h>
#include <GLUT/GLUT.h>
```
GLUT在这里会提供一些创建桌面窗口之类的工具，用于显示opengl画出图的效果；话不多说，直接上例子。

```
#include <iostream>
#include <GLUT/GLUT.h>

int main(int argc, char * argv[]) {
    // insert code here...
    std::cout << "Hello, World!\n";
    
    glutInit(&argc, argv);
    glutInitWindowPosition(100, 100); //初始位置
    glutInitWindowSize(600, 450);//大小
    glutCreateWindow("显示图元");
    
    gluOrtho2D(0, 200, 0, 150);
    
    //只调用最后一次的
    glutDisplayFunc(drawLine);
    glutDisplayFunc(drawPolyline);
    glutMainLoop();
    
    return 0;
}

```

先不着急，一点一点解释：


`glutInit`

glut初始化，在这里提一下第二个参数，因为之前用xcode创建例子的时候，函数主入口是这样的：
```
int main(int argc, const char * argv[])
```
然而进行传参时，`glutInit(&argc,argv)`提示没有匹配的函数，经查证后得知是参数传错了，理由是：指向const的指针不能被赋给指向非const的指针；解决办法倒不是没有，应该用strcpy，也就是另开一块内存，把字符一个个复制过去，但是这样太麻烦了，索性直接改掉main()的参数好了；


`glutInitWindowPosition`

设置窗口的初始位置，以桌面左上角为零点；

`glutInitWindowSize`

设置窗口的大小；

`glutCreateWindow`

创建窗口，给定一个窗口标题；

`gluOrtho2D`

接下来的这个函数是在<OpenGL/glu.h>中的，这个函数给定了一个坐标系，该坐标系将与上面设置的坐标系对齐，具体对齐规则书中暂时还没有说到，后面会详细讲，这里先大致清楚它是在做一件什么事情就好了,gl画图的函数坐标将以该坐标系为基准进行画图；

`glutDisplayFunc`

接下来要进行画图了，这个函数接收一个函数指针，类型为`void (*func)(void)`;很明显是传入的将是一系列的画图动作，这个形式有点类似于OC的SEL，显然是GPU内部的回调；还有一点是我试图重复调用该函数，结果会发现它并不是会对两个函数分别调用，实验显示只对最后一次的调用起作用。

`glutMainLoop()`

这是一个运行循环，貌似所有交互系统都是需要有一个死循环的，否则无法进行交互处理。说到“交互”，这真是一个神奇的词语。

然后就进入我们今天的重点，画图，先上代码；

## GL

画一条线：

```
void drawLine(void){
    printf("画一条线\n");
    
    glClearColor(0, 0, 0, 1);
    glClear(GL_COLOR_BUFFER_BIT);
    glMatrixMode(GL_PROJECTION);
    
    glColor3f(0, 1, 0);
    
    int point1[] = {0,0};
    int point2[] = {200,150};
    int point3[] = {0,200};
    
    glBegin(GL_LINES);
    glVertex2iv(point1);
    glVertex2iv(point2);
    glVertex2iv(point3);
    glEnd();
    /**
     *  如果列出的端点数为奇数，则最后一个端点被忽略；
     */
    glFlush();
}

```

`glClearColor`

使用该函数设置图形背景颜色，四个参数分别是我们熟悉的RGBA；然而该函数只是将颜色值保存在了颜色缓存中，必须要通过调用`glClear`才能将颜色值取出来；

`glColor3f`

使用该函数设置的颜色对要进行画的像素着色；如果是一条线，它将是线的颜色；

```
glBegin(GL_LINES);
	
glEnd();
```

画图需要被包含在以上两个函数之间，`glBegin`的参数将决定画的是什么图形，各图形画图时有各自的规则，之后慢慢讲解；画点函数`glVertex*`，在Vertex后的2,3,4数字表示维数（在几维的空间坐标系中）；之后接的是类型，表示浮点还是整形等；最后如果加v的话，表示传入的将是一个用数组表示的点，本例中就是这样表示的；

`glFlush`

最后这个函数非常重要，没有它，之前所做的一切都白费了；原文解释，该函数强制由计算机系统存放在不同位置的缓存中的OpenGL函数执行，其位置依赖于OpenGL的实现，暂时还不是能太搞懂，之后可能会详细介绍，本章只是做了一个引入。

另外如果要画一个点则可以这样做：

```
glBegin(GL_POINTS);
glVertex2i(x, y);
glEnd();
```

这样可以通过循环，画一些不规则的图形，如果你自己设计算法，也许圆也可以画的出来；另外如果要从一个像素点上取得颜色，则需要使用`getPixel`。


画一条折线：

```
void drawPolyline(void){
    printf("画折线");
    
    glClearColor(0, 0, 0, 1);
    glClear(GL_COLOR_BUFFER_BIT);
    
    glColor3f(0, 0, 1);
    int point[5][2] = {{0,0},{100,20},{30,100},{150,10},{150,150}};
    
    glBegin(GL_LINE_STRIP);//strip条状，剥去
    for (int i=0; i<5; i++) {
        glVertex2iv(point[i]);
    }
    glEnd();
    /**
     *  使用图元常量GL_LINE_STRIP可获得折线；
     *  如果不列出至少两个点，则什么也不显示；
     *
     */
    
    glColor3f(1, 0, 0);
    int pointLoop[5][2] = {{100,100},{20,20},{50,50},{150,10},{70,10}};
    
    glBegin(GL_LINE_LOOP);
    for (int i=0; i<5; i++) {
        glVertex2iv(pointLoop[i]);
    }
    glEnd();
    /**
     *  使用图元常量GL_LINE_LOOP可获得闭合折线；
     *  如果不列出至少两个点，则什么也不显示；
     *  最后一个端点与第一个端点相连接；
     *
     */

    
    glFlush();
}
```

上面的例子会教你如何画一条折线或者闭合折线，注意看里面的注释。

本篇就讲到这里，持续学习并更新中...
