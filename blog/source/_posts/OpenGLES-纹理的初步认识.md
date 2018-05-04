title: OpenGLES-纹理的初步认识
date: 2016-06-04 23:51:00
categories: coder
tags: [opengles, texture]
-----------

Summary:  上周看书学习OpenGLES关于纹理的知识，云里雾里的，看完的感觉是好多东西都明白，涉及到许多opengl的内容，不过照着书里的内容运行了几个Demo，大致算是有些总结，现做一下回顾，上几个例子。
不过这里有一点，这本书看完下一步还是要细研究一下opengl，初步决定从《计算机图形学》这本书入手。好了，之后的事情不多说，先做好当下的事情。

<!-- more -->


## Demo:渲染图片[Demo代码](https://github.com/usiege/OpenGLES/tree/master/OpenGLES_Ch_3_纹理/OpenGLES_Ch3_2)

首先是关于纹理的一些概念:

>纹理是什么？纹理是一个用来保存图像的元素值的OGE缓存,就是颜色缓存；

>当用一个图像初始化一个纹理缓存后，每一个像素就变成了纹理中的纹素（texel）；


>像素通常表示屏幕上的一个实际的颜色点，纹素是在一个虚拟的坐标系中;


>GPU会转换OGE坐标系中的每个点为帧缓存中的真实像素坐标（视口viewport坐标）；


>转换几何形状数据为帧缓存中的颜色像素的过程叫做点阵化（rasterizing），每个颜色像素叫做片元（fragment）;


>纹素决定片元的对齐过程，叫做映射（mapping）；


>取样（sampling）是GPU从每个片元的U、V位置选择纹素的过程；


>MIP贴图是为一个纹理存储多个细节的技术，它通过减少GPU的取样来提高渲染的性能；

下面的例子展示了使用一个图片渲染的图片缓存：


在`GLKViewController`中，设置OGE的上下文：


```
	GLKView *view = (GLKView *)self.view;
    view.backgroundColor = [UIColor whiteColor];
   NSAssert([view isKindOfClass:[GLKView class]],
      @"View controller's view is not a GLKView");
   
   view.context = [[AGLKContext alloc] 
      initWithAPI:kEAGLRenderingAPIOpenGLES2];
   
   // Make the new context current
   [AGLKContext setCurrentContext:view.context];
```

上面的`AGLKContext`是`EAGLContext`的子类，`setCurrentContext:`是继承自父类的方法，设备当前上下文；

设置提供基础功能:

```
// Create a base effect that provides standard OpenGL ES 2.0
   // shading language programs and set constants to be used for 
   // all subsequent rendering
   self.baseEffect = [[GLKBaseEffect alloc] init];
   self.baseEffect.useConstantColor = GL_TRUE;
   self.baseEffect.constantColor = GLKVector4Make(
      1.0f, // Red
      1.0f, // Green
      1.0f, // Blue
      1.0f);// Alpha
```
上面的这个constantColor,说是顶点缓冲，这里可能是顶点的颜色缓存，具体应该是与opengl相关的东西，这里这么用着，我改过这里的值，会修改渲染出来图的背景色，暂且认为是渲染用的一个底色吧；

设置当前上下文的“清除颜色”：

```
// Set the background color stored in the current context
GLKVector4 clearColorRGBA = GLKVector4Make(
      1.0f, // Red
      1.0f, // Green
      1.0f, // Blue
      1.0f);// Alpha 
glClearColor(
      clearColorRGBA.r, 
      clearColorRGBA.g, 
      clearColorRGBA.b, 
      clearColorRGBA.a); 
```
接下来要进行渲染图片了，大致与渲染一个三角形的过程差不多，可对照[开始OpenGLES的探索](http://uwuneng.com/opengles_start.html)，同样也是6步：

这里我们自定义了一个`AGLKVertexAttribArrayBuffer`封装了关于一些OGE的操作，来说明一下：

```
// This data type is used to store information for each vertex
//这个类型用来保存每个顶点的信息
 typedef struct {
   GLKVector3  positionCoords;
   GLKVector2  textureCoords;
}SceneVertex;

// Define    data for a triangle to use in example
//定义三角形顶点
static const SceneVertex vertices[] = 
{
   {{-0.5f, -0.5f, 0.0f}, {0.0f, 0.0f}}, // lower left corner
   {{ 0.5f, -0.5f, 0.0f}, {1.0f, 0.0f}}, // lower right corner
   {{-0.5f,  0.5f, 0.0f}, {0.0f, 1.0f}}, // upper left corner
};

// Create vertex buffer containing vertices to draw
//这里是定义渲染区域
   self.vertexBuffer = [[AGLKVertexAttribArrayBuffer alloc]
      initWithAttribStride:sizeof(SceneVertex)
      numberOfVertices:sizeof(vertices) / sizeof(SceneVertex)
      bytes:vertices
      usage:GL_STATIC_DRAW];

self.baseEffect.texture2d0.name = textureInfo.name;
self.baseEffect.texture2d0.target = textureInfo.target;

```

下面是init方法：

```
// This method creates a vertex attribute array buffer in
// the current OpenGL ES context for the thread upon which this 
// method is called.
- (id)initWithAttribStride:(GLsizei)aStride
   numberOfVertices:(GLsizei)count
   bytes:(const GLvoid *)dataPtr
   usage:(GLenum)usage;
{
   NSParameterAssert(0 < aStride);
   NSAssert((0 < count && NULL != dataPtr) ||
      (0 == count && NULL == dataPtr),
      @"data must not be NULL or count > 0");
      
   if(nil != (self = [super init]))
   {
      stride = aStride;
      bufferSizeBytes = stride * count;
      
      glGenBuffers(1,                // STEP 1
         &name);
      glBindBuffer(GL_ARRAY_BUFFER,  // STEP 2
         self.name); 
      glBufferData(                  // STEP 3
         GL_ARRAY_BUFFER,  // Initialize buffer contents
         bufferSizeBytes,  // Number of bytes to copy
         dataPtr,          // Address of bytes to copy
         usage);           // Hint: cache in GPU memory
         
      NSAssert(0 != name, @"Failed to generate name");
   }
   
   return self;
}   
```

从这里可以看到图形渲染的前三步，生成缓存`glGenBuffers`，绑定缓存`glBindBuffer`，复制数据到缓存`glBufferData`；

下面我们来进入今天的重点：

```
   // Setup texture
   CGImageRef imageRef = 
      [[UIImage imageNamed:@"leaves.gif"] CGImage];
      
   AGLKTextureInfo *textureInfo = [AGLKTextureLoader 
      textureWithCGImage:imageRef 
      options:nil 
      error:NULL];
   
   self.baseEffect.texture2d0.name = textureInfo.name;
   self.baseEffect.texture2d0.target = textureInfo.target;

```
`textureWithCGImage:`实现具体细节：

```
// This method generates a new OpenGL ES texture buffer and 
// initializes the buffer contents using pixel data from the 
// specified Core Graphics image, cgImage. This method returns an
// immutable AGLKTextureInfo instance initialized with 
// information about the newly generated texture buffer.
//    The generated texture buffer has power of 2 dimensions. The
// provided image data is scaled (re-sampled) by Core Graphics as
// necessary to fit within the generated texture buffer.

+ (AGLKTextureInfo *)textureWithCGImage:(CGImageRef)cgImage
                                options:(NSDictionary *)options
   error:(NSError **)outError;
{
   // Get the bytes to be used when copying data into new texture
   // buffer
   size_t width;
   size_t height;
   NSData *imageData = AGLKDataWithResizedCGImageBytes(
      cgImage,
      &width,
      &height);
   
   // Generation, bind, and copy data into a new texture buffer
   GLuint      textureBufferID;
   
   glGenTextures(1, &textureBufferID);                  // Step 1
   glBindTexture(GL_TEXTURE_2D, textureBufferID);       // Step 2
   
    //该函数是OGE最复杂的函数
   glTexImage2D(                                        // Step 3
      GL_TEXTURE_2D, //用于2D纹理
      0, //指定MIP帖图的初始细节级别
      GL_RGBA, //指定每个纹素需要保存信息的数量
      (GLuint)width,//
      (GLuint)height,
      0, //围绕纹素的边界的大小,总是被设置为0
      GL_RGBA, 
      GL_UNSIGNED_BYTE, 
      [imageData bytes]);
   
   // Set parameters that control texture sampling for the bound
   // texture
  glTexParameteri(GL_TEXTURE_2D,
     GL_TEXTURE_MIN_FILTER, 
     GL_LINEAR); 
   
   // Allocate and initialize the AGLKTextureInfo instance to be
   // returned
   AGLKTextureInfo *result = [[AGLKTextureInfo alloc] 
      initWithName:textureBufferID
      target:GL_TEXTURE_2D
      width:(GLuint)width
      height:(GLuint)height];
   
   return result;
}
```

上面这个方法使用Core Graphics图像的像素数据生成一个新的OGE缓存并初始化它，此方法返回一个不变的AGLKtextureinfo实例。

解释一下这个方法`glTexParameteri`，该方法为创建的纹理缓存设置OGE取样和循环模式。如果使用了MIP贴图，第二个参数会被设置成GL_LINEAR_MIPMAP_LINEAR，这会告诉OGE使用与被取样的S,T坐标最接近的纹素的线性插值取样两个最合适的MIP贴图图像尺寸。然后，来自MIP贴图的两个样本被线性差值来产生最终的片元颜色。这里涉及的两个概念需要对opengl进行深入了解。


其中`AGLKDataWithResizedCGImageBytes`把指定的cgImmage拖入imageData提供的字节中，Core Graphics把cgImage拖入一个适当大小的Core Graphics上下文中，这个过程会把图像的尺寸调整为2的幂，图像在绘制的时候还会被上下翻转，这是因为OGE的原点在左下角而iOS的实现原点却是在左上角，翻转Y轴确保了图像字节拥有适用于纹理缓存的正确的方向。

```
static NSData *AGLKDataWithResizedCGImageBytes(
   CGImageRef cgImage,
   size_t *widthPtr,
   size_t *heightPtr)
{
   NSCParameterAssert(NULL != cgImage);
   NSCParameterAssert(NULL != widthPtr);
   NSCParameterAssert(NULL != heightPtr);
   
   GLuint originalWidth = (GLuint)CGImageGetWidth(cgImage);
   GLuint originalHeight = (GLuint)CGImageGetWidth(cgImage);
   
   NSCAssert(0 < originalWidth, @"Invalid image width");
   NSCAssert(0 < originalHeight, @"Invalid image width");
   
   // Calculate the width and height of the new texture buffer
   // The new texture buffer will have power of 2 dimensions.
   GLuint width = AGLKCalculatePowerOf2ForDimension(
      originalWidth);
   GLuint height = AGLKCalculatePowerOf2ForDimension(
      originalHeight);
      
      //注意这个函数AGLKCalculatePowerOf2ForDimension就是用来取整用的
      
   // Allocate sufficient storage for RGBA pixel color data with 
   // the power of 2 sizes specified
   NSMutableData    *imageData = [NSMutableData dataWithLength:
      height * width * 4];  // 4 bytes per RGBA pixel

   NSCAssert(nil != imageData, 
      @"Unable to allocate image storage");
   
   // Create a Core Graphics context that draws into the 
   // allocated bytes
   CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
   CGContextRef cgContext = CGBitmapContextCreate( 
      [imageData mutableBytes], width, height, 8, 
      4 * width, colorSpace, 
      kCGImageAlphaPremultipliedLast);
   CGColorSpaceRelease(colorSpace);
   
   // Flip the Core Graphics Y-axis for future drawing
   CGContextTranslateCTM (cgContext, 0, height);
   CGContextScaleCTM (cgContext, 1.0, -1.0);
   
   // Draw the loaded image into the Core Graphics context 
   // resizing as necessary
   CGContextDrawImage(cgContext, CGRectMake(0, 0, width, height),
      cgImage);
   
   CGContextRelease(cgContext);
   
   *widthPtr = width;
   *heightPtr = height;
   
   return imageData;
}
```

最后在glk回调中实现真正画图：

```
- (void)glkView:(GLKView *)view drawInRect:(CGRect)rect
{
   [self.baseEffect prepareToDraw];
   
   // Clear back frame buffer (erase previous drawing)
   [(AGLKContext *)view.context clear:GL_COLOR_BUFFER_BIT];
   
   [self.vertexBuffer prepareToDrawWithAttrib:GLKVertexAttribPosition
      numberOfCoordinates:3
      attribOffset:offsetof(SceneVertex, positionCoords)
      shouldEnable:YES];
   [self.vertexBuffer prepareToDrawWithAttrib:GLKVertexAttribTexCoord0
      numberOfCoordinates:2
      attribOffset:offsetof(SceneVertex, textureCoords)
      shouldEnable:YES];
      
   // Draw triangles using the first three vertices in the 
   // currently bound vertex buffer
   [self.vertexBuffer drawArrayWithMode:GL_TRIANGLES
      startVertexIndex:0
      numberOfVertices:3];
}
```

`glEnableVertexAttribArray`,

`glVertexAttribPointer`,

`glDrawArrays`

这里提前熟悉一下这些函数，虽然现在还是对它们不是太理解。

后面的例子就不一一写了，过程笔记都在代码中，分别涉及到一些概念

[OpenGLES_Ch3_3取样循环等](https://github.com/usiege/OpenGLES_iOS/tree/master/OpenGLES_Ch_3_纹理/OpenGLES_Ch3_3)

[OpenGLES_Ch3_4混合片元颜色](https://github.com/usiege/OpenGLES_iOS/tree/master/OpenGLES_Ch_3_纹理/OpenGLES_Ch3_4)

[OpenGLES_Ch3_5多重纹理](https://github.com/usiege/OpenGLES_iOS/tree/master/OpenGLES_Ch_3_纹理/OpenGLES_Ch3_5)

[OpenGLES_Ch3_6自定义纹理](https://github.com/usiege/OpenGLES_iOS/tree/master/OpenGLES_Ch_3_纹理/OpenGLES_Ch3_6)



