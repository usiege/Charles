title: 关于GLKit的推断
date: 2016-05-09 22:00:00
categories: coder
tags: [opengles, GLKit]
-----------

Summary:本篇是对OpenGLES_Ch2_1中的缓存管理代码的简单重用和重构，用以加深对GLKView的理解。苹果的GLKit框架封装了gl的具体实现，以便使用gl的用户减少编写gl的代码量以及避免不必要的错误。

<!-- more -->

本文介绍两个封装类，`AGLKContext`和`AGLKVertexAttribArrayBuffer`，前者是内建的`EAGLContext`的简单子类，后者封装了使用OpenGLES2.0顶点属性数组缓存的7个步骤；


## `AGLKContext.m`

```
// This method sets the clear (background) RGBA color.
// The clear color is undefined until this method is called.
- (void)setClearColor:(GLKVector4)clearColorRGBA
{
   clearColor = clearColorRGBA;
    
   NSAssert(self == [[self class] currentContext],
      @"Receiving context required to be current context");
      
   glClearColor(
      clearColorRGBA.r, 
      clearColorRGBA.g, 
      clearColorRGBA.b, 
      clearColorRGBA.a);
}
```

```
/////////////////////////////////////////////////////////////////
// This method instructs OpenGL ES to set all data in the
// current Context's Render Buffer(s) identified by mask to
// colors (values) specified via -setClearColor: and/or
// OpenGL ES functions for each Render Buffer type.
- (void)clear:(GLbitfield)mask
{
   NSAssert(self == [[self class] currentContext],
      @"Receiving context required to be current context");
      
   glClear(mask);
}
```

>
>函数原型: `void glClear(GLbitfield mask);`    
>参数说明：    
>GLbitfield：可以使用 | 运算符组合不同的缓冲标志位，表明需要清除的缓冲，例如glClear（GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT）表示要清除颜色缓冲以及深度缓冲，可以使用以下标志位    
>
      GL_COLOR_BUFFER_BIT:    当前可写的颜色缓冲
      GL_DEPTH_BUFFER_BIT:    深度缓冲
      GL_ACCUM_BUFFER_BIT:    累积缓冲    
      GL_STENCIL_BUFFER_BIT:  模板缓冲
函数说明：    
glClear()函数的作用是用当前缓冲区清除值，也就是glClearColor或者glClearDepth、glClearIndex、glClearStencil、glClearAccum等函数所指定的值来清除指定的缓冲区，也可以使用glDrawBuffer一次清除多个颜色缓存。

以上两个函数的封装为渲染提供背景，并且利用glClearColor()将上下文帧缓存中的每个像素颜色设置为该颜色值；该类中的其他函数是OpenGL的相关函数，留着以后再研究；

## `AGLKVertexAttribArrayBuffer.m`

接下来我们说一下在开篇中谈到的7个步骤；

* NSParameterAssert
有的方法的条件可以满足可以不满足，都不影响执行。但如果你希望程序在某些条件不满足的时候产生错误告诉你，就用nsparameterassert让程序崩溃。
 
* glGenBuffers  

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

glGenBuffers()创建缓存对象并且返回缓存对象的标示符。它需要2个参数：第一个为需要创建的缓存数量，第二个为用于存储单一ID或多个ID的GLuint变量或数组的地址。
	
```
void glGenBuffers(GLsizei n, GLuint *buffers);
//在buffers数组中返回当前n个未使用的名称，表示缓冲区对象
GLboolean glIsBuffer(GLuint buffer);
//判断是否是缓冲区对象
```

* glBindBuffer  
  
当缓存对象创建之后，在使用缓存对象之前，我们需要将缓存对象连接到相应的缓存上。
glBindBuffer()有2个参数：target与buffer。    
   
```
void glBindBuffer(GLenum target, GLuint buffer)
```
target告诉顶点缓存对象(VBO)该缓存对象将保存顶点数组数据还是索引数组数据：GL_ARRAY_BUFFER或GL_ELEMENT_ARRAY。任何顶点属性，如顶点坐标、纹理坐标、法线与颜色分量数组都使用GL_ARRAY_BUFFER。用于glDraw[Range]Elements()的索引数据需要使用GL_ELEMENT_ARRAY绑定。注意，target标志帮助VBO确定缓存对象最有效的位置，如有些系统将索引保存AGP或系统内存中，将顶点保存在显卡内存中。
当第一次调用glBindBuffer()，VBO用0大小的内存缓存初始化该缓存，并且设置VBO的初始状态，如用途与访问属性。

* glBufferData   

 
当缓存初始化之后，你可以使用glBufferData()将数据拷贝到缓存对象。    

```
void glBufferData(GLenum target，GLsizeiptr size, const GLvoid* data, GLenum usage);
```

第一个参数target可以为GL_ARRAY_BUFFER或GL_ELEMENT_ARRAY。size为待传递数据字节数量。第三个参数为源数据数组指针，如data为NULL，则VBO仅仅预留给定数据大小的内存空间。最后一个参数usage标志位VBO的另一个性能提示，它提供缓存对象将如何使用：static、dynamic或stream、与read、copy或draw。
VBO为usage标志指定9个枚举值：
GL_STATIC_DRAW
GL_STATIC_READ
GL_STATIC_COPY
GL_DYNAMIC_DRAW
GL_DYNAMIC_READ
GL_DYNAMIC_COPY
GL_STREAM_DRAW
GL_STREAM_READ
GL_STREAM_COPY
”static“表示VBO中的数据将不会被改动（一次指定多次使用），”dynamic“表示数据将会被频繁改动（反复指定与使用），”stream“表示每帧数据都要改变（一次指定一次使用）。”draw“表示数据将被发送到GPU以待绘制（应用程序到GL），”read“表示数据将被客户端程序读取（GL到应用程序），”copy“表示数据可用于绘制与读取（GL到GL）。



```
// A vertex attribute array buffer must be prepared when your 
// application wants to use the buffer to render any geometry. 
// When your application prepares an buffer, some OpenGL ES state
// is altered to allow bind the buffer and configure pointers.
- (void)prepareToDrawWithAttrib:(GLuint)index
   numberOfCoordinates:(GLint)count
   attribOffset:(GLsizeiptr)offset
   shouldEnable:(BOOL)shouldEnable
{
   NSParameterAssert((0 < count) && (count < 4));
   NSParameterAssert(offset < self.stride);
   NSAssert(0 != name, @"Invalid name");
	
   glBindBuffer(GL_ARRAY_BUFFER,     // STEP 2
      self.name);
	
   if(shouldEnable)
   {
      glEnableVertexAttribArray(     // Step 4
         index); 
   }
	
   glVertexAttribPointer(            // Step 5
      index,               // Identifies the attribute to use
      count,               // number of coordinates for attribute
      GL_FLOAT,            // data is floating point
      GL_FALSE,            // no fixed point scaling
      (self.stride),       // total num bytes stored per vertex
      NULL + offset);      // offset from start of each vertex to 
                           // first coord for attribute
	#ifdef DEBUG
	   {  // Report any errors 
	      GLenum error = glGetError();
	      if(GL_NO_ERROR != error)
	      {
	         NSLog(@"GL Error: 0x%x", error);
	      }
	   }
	#endif
}
```

* glEnableVertexAttribArray    


第4步和第5步理解起来有点困难，暂时放下，之后研究OpenGL的时候细研究，这里给出原书中的摘录；

>在第4步中，通过调用glEnableVertexAttribArray()来启动顶点缓存渲染操作；OpenGLES所支持的每一个渲染操作都可以单独地使用保存在当前OpenGLES上下文中的设置来开启或关闭。
在第5步中，glVertexAttribPointer()告诉OpenGLES顶点数据在哪里，以及怎么解释为每个顶点保存的数据。第一个参数指示当前绑定的缓存包含每个顶点的位置信息；第二个参数指示每个位置有3个部分；第三个参数告诉OpenGLES每个部分都保存为一个浮点类型的值；第四个参数告诉OpenGLES小数点固定数据是否可以被改变；第五个参数叫做“步幅”，它指定了每个顶点的保存需要多少个字节，换句话说，步幅指定了GPU从一个顶点的内存开始位置转到下一个顶点的内存开始位置需要跳过多少字节,sizeof(GLKVector3)指示在缓存中没有额外的字节，即顶点位置数据是密封的，在一个顶点缓存中保存除了每个顶点位置的X Y Z坐标之外的其他数据也是可能的；


* glVertexAttribPointer 
 
``` 
void glVertexAttribPointer( GLuint index, GLint size, GLenum type, GLboolean normalized, GLsizei stride,const GLvoid * pointer);
```

参数：
*index*
指定要修改的顶点属性的索引值
*size*
指定每个顶点属性的组件数量。必须为1、2、3或者4。初始值为4。（如position是由3个（x,y,z）组成，而颜色是4个（r,g,b,a））
*type*
指定数组中每个组件的数据类型。可用的符号常量有GL_BYTE, GL_UNSIGNED_BYTE, GL_SHORT,GL_UNSIGNED_SHORT, GL_FIXED, 和 GL_FLOAT，初始值为GL_FLOAT。
*normalized*
指定当被访问时，固定点数据值是否应该被归一化（GL_TRUE）或者直接转换为固定点值（GL_FALSE）。
*stride*
指定连续顶点属性之间的偏移量。如果为0，那么顶点属性会被理解为：它们是紧密排列在一起的。初始值为0。
*pointer*
指定第一个组件在数组的第一个顶点属性中的偏移量。该数组与GL_ARRAY_BUFFER绑定，储存于缓冲区中。初始值为0；

```
// Submits the drawing command identified by mode and instructs
// OpenGL ES to use count vertices from the buffer starting from
// the vertex at index first. Vertex indices start at 0.
- (void)drawArrayWithMode:(GLenum)mode
   startVertexIndex:(GLint)first
   numberOfVertices:(GLsizei)count
{
   NSAssert(self.bufferSizeBytes >= 
      ((first + count) * self.stride),
      @"Attempt to draw more vertex data than available.");
      
   glDrawArrays(mode, first, count); // Step 6
}
```

* glDrawArrays


glDrawArrays()第一个参数会告诉GPU怎么处理在绑定的顶点缓存内的顶点数据；第二个参数和第三个参数分别指定缓存内的需要渲染的第一个顶点的位置和需要渲染的顶点的数量；

```
// This method deletes the receiver's buffer from the current
// Context when the receiver is deallocated.
- (void)dealloc
{
    // Delete buffer from current context
    if (0 != name)
    {
        glDeleteBuffers(1, &name); // Step 7 
        name = 0;
    }
}
```
* glDeleteBuffers


删除不需再需要的顶点缓存和上下文，该方法保证Cocoa Touch收回上下文使用的内存和其他资源。

[本例的代码下载链接](https://github.com/usiege/OpenGLES/tree/master/OpenGLES_Ch_2_GL/OpenGLES_Ch2_3)


