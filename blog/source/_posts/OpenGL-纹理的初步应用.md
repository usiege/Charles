title: OpenGL-纹理的初步应用
date: 2016-08-06 01:30:00
categories: coder
tags: [opengl, texture]
-----------

Summary:说到纹理，通俗的讲就是我们不用再自己去画图啦，用一些装有信息格式的文件去实现画图，这将为我们带来一个更加清新的展示效果。在纹理中涉及到许多概念也是需要我们去理解的，理解的部分我无法为你们完成，概念的部分我尽量写出自己的理解。希望可以帮到看本博客的同学。
<!-- more -->


[本文例子查看地址](https://github.com/usiege/OpenGL_S/tree/master/OpenGL_05_%E5%9F%BA%E7%A1%80%E7%BA%B9%E7%90%86/BaseTexture)，本例中展示了读取tag文件并加载纹理生成图像，mac用户可以把例子下下来看看效果。

## 纹理坐标自描述

典型情况下，纹理坐标是作为0.0到1.0范围内的浮点值指定的，坐标命名为s,t,r,q，分别对应顶点坐标的x,y,z,w；自己理解下就是纹理会被先加载到一个各边都视为单位1的坐标系下，然后再将这样的坐标系映射到真实的屏幕坐标系里，因为每个坐标系上的全长都是单位一，那么根据在第边上的比例即可计算纹理的真实像素。而且若三个坐标系的单位一不相同的情况下，得到的结果也不会是一个正方体，所以真实的纹理计算过程会进行拉伸或收缩。

## 读取像素

Targa图像格式是一种方便且容易使用的图片格式，先贴上一个函数，该函数详细介绍了tga文件的加载过程：

```
/*自定义tga图片头信息结构*/
#pragma pack(1)//结构体字节对齐
typedef struct
{
    GLbyte  identsize;              // Size of ID field that follows header (0)
    GLbyte  colorMapType;           // 0 = None, 1 = paletted
    GLbyte  imageType;              // 0 = none, 1 = indexed, 2 = rgb, 3 = grey, +8=rle
    unsigned short  colorMapStart;          // First colour map entry
    unsigned short  colorMapLength;         // Number of colors
    unsigned char   colorMapBits;   // bits per palette entry
    unsigned short  xstart;                 // image x origin
    unsigned short  ystart;                 // image y origin
    unsigned short  width;                  // width in pixels
    unsigned short  height;                 // height in pixels
    GLbyte  bits;                   // bits per pixel (8 16, 24, 32)
    GLbyte  descriptor;             // image descriptor
} TGAHEADER;
#pragma pack(8)


/*tga图片读取*/
//进行内存定位并载入targa位，返回指向新的缓冲区指针，纹理高宽，以及OpenGL数据格式
//注：只支持targa,只能是8位、24位或32位色，没有调色板和RLE编码（这部分没看懂，应该是跟图像格式有关的）
GLbyte *gltReadTGABits(const char *szFileName, GLint *iWidth, GLint *iHeight, GLint *iComponents, GLenum *eFormat)
{
    FILE *pFile;            // File pointer
    TGAHEADER tgaHeader;        // TGA file header
    unsigned long lImageSize;       // Size in bytes of image
    short sDepth;           // Pixel depth;
    GLbyte  *pBits = NULL;          // Pointer to bits
    
    //默认或失败值
    *iWidth = 0;
    *iHeight = 0;
    *eFormat = GL_RGB;
    *iComponents = GL_RGB;
    
    //尝试打开文件
    pFile = fopen(szFileName, "rb");
    if(pFile == NULL)
        return NULL;
    
    // 读入文件头（二进制）
    fread(&tgaHeader, 18/* sizeof(TGAHEADER)*/, 1, pFile);
    
    // 为大小字节存储顺序问题而进行字节交换，这里有大神给解释下吗？
//#ifdef __APPLE__
//    LITTLE_ENDIAN_WORD(&tgaHeader.colorMapStart);
//    LITTLE_ENDIAN_WORD(&tgaHeader.colorMapLength);
//    LITTLE_ENDIAN_WORD(&tgaHeader.xstart);
//    LITTLE_ENDIAN_WORD(&tgaHeader.ystart);
//    LITTLE_ENDIAN_WORD(&tgaHeader.width);
//    LITTLE_ENDIAN_WORD(&tgaHeader.height);
//#endif
    
    // 获取纹理宽，高，深度
    *iWidth = tgaHeader.width;
    *iHeight = tgaHeader.height;
    sDepth = tgaHeader.bits / 8;
    
    //进行有效性检验，我们需要关心8位、24位或32位
    if(tgaHeader.bits != 8 && tgaHeader.bits != 24 && tgaHeader.bits != 32)
        return NULL;
    
    // 计算图像缓冲区大小
    lImageSize = tgaHeader.width * tgaHeader.height * sDepth;
    
    // 内存定位和成功检验
    pBits = (GLbyte*)malloc(lImageSize * sizeof(GLbyte));
    if(pBits == NULL)
        return NULL;
    
    // 读入位
    // 检查读取错误，这项操作应该发现RLE或者其他我们不想识别的格式
    // RLE:一种压缩过的位图文件格式，RLE压缩方案是一种极其成熟的压缩方案，
    // 特点是无损失压缩，既节省了磁盘空间又不损失任何图像数据;
    if(fread(pBits, lImageSize, 1, pFile) != 1)
    {
        free(pBits);
        return NULL;
    }
    
    // 设置希望的OpenGL格式
    switch(sDepth)
    {
#ifndef OPENGL_ES
        case 3:     // Most likely case
            *eFormat = GL_BGR;
            *iComponents = GL_RGB;
            break;
#endif
        case 4:
            *eFormat = GL_BGRA;
            *iComponents = GL_RGBA;
            break;
        case 1:
            *eFormat = GL_LUMINANCE;
            *iComponents = GL_LUMINANCE;
            break;
        default:        // RGB
            //如果是在iPhone上，TGA为BGR，并且iPhone不支持没有alpha的BGR
            //iPhone支持RGB，所以只要将红色和蓝色调整一下就能符合要求
            //但是为了加快iPhone的载入速度，请保存带有alpha的TGA
#ifdef OPENGL_ES
            for(int i = 0; i < lImageSize; i+=3)
            {
                GLbyte temp = pBits[i];
                pBits[i] = pBits[i+2];
                pBits[i+2] = temp;
            }
#endif
            break;
    }

    // 文件结束
    fclose(pFile);
    
    // 返回指向图像的指针
    return pBits;
}

```

函数`gltReadTGABits`是自定义读取函数，大致的过程就是打开一个tga文件，然后以二进制的形式读取出来，进而对外部指针width等做修改，所以该函数返回了像素的宽高等的一些信息。

## 载入纹理

接下来载入缓冲区内的纹理：

```
bool LoadTGATexture(const char *szFileName, GLenum minFilter, GLenum magFilter, GLenum wrapMode)
{
	GLbyte *pBits;
	int nWidth, nHeight, nComponents;
	GLenum eFormat;
	
	// Read the texture bits
	pBits = gltReadTGABits(szFileName, &nWidth, &nHeight, &nComponents, &eFormat);
	if(pBits == NULL)
		return false;
	
    //纹理环绕
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, wrapMode);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, wrapMode);
	
    //纹理过滤（邻近过滤和线性过滤）
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, minFilter);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, magFilter);
    
	glPixelStorei(GL_UNPACK_ALIGNMENT, 1);
	glTexImage2D(GL_TEXTURE_2D, 0, nComponents, nWidth, nHeight, 0,
				 eFormat, GL_UNSIGNED_BYTE, pBits);
	
    free(pBits);
    
    if(minFilter == GL_LINEAR_MIPMAP_LINEAR || 
       minFilter == GL_LINEAR_MIPMAP_NEAREST ||
       minFilter == GL_NEAREST_MIPMAP_LINEAR ||
       minFilter == GL_NEAREST_MIPMAP_NEAREST)
        glGenerateMipmap(GL_TEXTURE_2D);
    
	return true;
}
```

### `glTexParameteri`

OpenGL在拉伸和收缩时对纹理贴图计算颜色片段的过程称为纹理过滤；纹理坐标总是根据纹理图像的纹理单元进行求值和绘图；使用上面这个函数设置放大和缩小的过滤模式：

```
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
```
`GL_LINEAR`,是线性过滤，把纹理坐标周围的的纹理单元的加权平均值应用到纹理坐标上，这可以需要一些额外的开销；

`GL_NEAREST`是最邻近过滤，把最邻近的纹理单元应用到纹理坐标中，它我们能选择的最简单、最快速的过滤方法；



前面说到纹理坐标坐落在一个0.0到1.0的范围内，当超过了范围，OpenGL使用这个函数处理纹理环绕模式；

`GL_REPEAT`模式下OpenGL在纹理坐标值超过1.0的方向上进行重复；

`GL_CLAMP`所需的纹理单元取自纹理边界或`TEXTURE_BORDER_COLOR`(glTexParameterfv函数设置的值)；

`GL_CLAMP_TO_EDGE`强制对范围外的纹理坐标沿着合法的纹理坐标的最后一行或一列进行渲染；

`GL_CLAMP_TO_BORDER`范围之外的纹理坐标使用边界纹理单元；

注：在`GL_NEAREST`模式下过滤模式并不起作用，因为纹理坐标总是对齐到纹理贴图中的一些特定的纹理单元；


### `glPixelStorei`

`GL_UNPACK_ALIGNMENT`指定OpenGL如何从数据缓冲区中解包图像数据；关于这个函数我们暂时只说明这一点；这似乎跟OpenGL对像素的内存分配有关；

### `glTexImage2D`

函数原型：

```
glTexImage2D(GLenum target, GLint level, GLint internalformat, 
				GLsizei width, GLsizei height, GLsizei depth, GLint border,
				GLeunm format, GLeunm type,void* data);
```

函数比较长，参数讲解：

target变量分别是`GL_TEXTURE_1D`, `GL_TEXTURE_2D`, `GL_TEXTURE_3D`,这里我们选择`GL_TEXTURE_2D`；该函数之后会有详细说明；

level指定了加载的mip贴图层次（你说你不知道mip贴图是什么，下次我们会讲，这里你理解成你们家铺地的瓷砖就好了）；

我们必须指定纹理数据的internalformat，这个信息告诉我们希望在每个纹理中存储多少颜色成分，并在可能的情况下说明这些成分的存储大小，以及是否希望对纹理进行压缩；竟然一个参数有这么多作用，具体参数列表为：

| 常量              | 含义           |
| ------------- |:-------------:| -----:|
| GL_ALPHA              |按照alpha值存储纹理单元|
| GL_LUMINANCE(亮度)     |按照亮度值存储纹理单元|
| GL_LUMINANCE_ALPHA    |按照亮度值和alpha值存储纹理单元|
| GL_RGB                |按照红、绿、蓝成分存储纹理单元|
| GL_RGBA               |按照红、绿、蓝和alpha成分存储纹理单元|

width,height,depth指定了被加载纹理的宽、高和深，这些值必须是2的整数次方，这一点非常重要；纹理贴图并不要求是立方体，但是一个纹理在加载时如果使用了非2的整数次幂值，将会导致纹理贴图被禁用，意思就是你什么也显示不出来；

border允许我们为纹理贴图指定一个边界宽度；

format,type,data详见`glReadPixels()`函数中对应的解释；

### `glReadPixels`

```
glReadPixels(GLint x,GLint y,GLSizei width,GLSizei height,
GLenum format,GLeunm type,const void* pixels);
```

OpenGL提供了简洁的函数来操作像素：


glReadPixels：读取一些像素。当前可以简单理解为“把已经绘制好的像素（它可能已经被保存到显卡的显存中）读取到内存”。


glDrawPixels：绘制一些像素。当前可以简单理解为“把内存中一些数据作为像素数据，进行绘制”。


glCopyPixels：复制一些像素。当前可以简单理解为“把已经绘制好的像素从一个位置复制到另一个位置”。虽然从功能上看，好象等价于先读取像素再绘制像素，但实际上它不需要把已经绘制的像素（它可能已经被保存到显卡的显存中）转换为内存数据，然后再由内存数据进行重新的绘制，所以要比先读取后绘制快很多。
这三个函数可以完成简单的像素读取、绘制和复制任务，但实际上也可以完成更复杂的任务。

该函数总共有七个参数。前四个参数可以得到一个矩形，该矩形所包括的像素都会被读取出来；（第一、二个参数表示了矩形的左下角横、纵坐标，坐标以窗口最左下角为零，最右上角为最大值；第三、四个参数表示了矩形的宽度和高度）


第五个参数表示读取的内容，例如：GL_RGB就会依次读取像素的红、绿、蓝三种数据，GL_RGBA则会依次读取像素的红、绿、蓝、alpha四种数据，GL_RED则只读取像素的红色数据（类似的还有GL_GREEN，GL_BLUE，以及GL_ALPHA）。如果采用的不是RGBA颜色模式，而是采用颜色索引模式，则也可以使用GL_COLOR_INDEX来读取像素的颜色索引。目前仅需要知道这些，但实际上还可以读取其它内容，例如深度缓冲区的深度数据等；


第六个参数表示读取的内容保存到内存时所使用的格式，例如：GL_UNSIGNED_BYTE会把各种数据保存为GLubyte，GL_FLOAT会把各种数据保存为GLfloat等。


第七个参数表示一个指针，像素数据被读取后，将被保存到这个指针所表示的地址。注意，需要保证该地址有足够的可以使用的空间，以容纳读取的像素数据。例如一幅大小为256*256的图象，如果读取其RGB数据，且每一数据被保存为GLubyte，总大小就是：256*256*3 = 196608字节，即192千字节。如果是读取RGBA数据，则总大小就是256*256*4 = 262144字节，即256千字节。
注意：glReadPixels实际上是从缓冲区中读取数据，如果使用了双缓冲区，则默认是从正在显示的缓冲（即前缓冲）中读取，而绘制工作是默认绘制到后缓冲区的。因此，如果需要读取已经绘制好的像素，往往需要先交换前后缓冲。

本篇就先到这里吧，本人要下班了。

