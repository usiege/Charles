title: iOS 作为Central蓝牙连接外围（下）
date: 2016-05-29 20:48:00
categories: wower
tags: [iOS, bluetooth]
-----------

Summary: 仍然是公司蓝牙卡项目，搞了两周，现在大致搞定，作一个总结；首先要把上篇遗留下来的蓝牙外围设备写数据等问题解决下...

仍然是公司蓝牙卡项目，搞了两周，现在大致搞定，作一个总结；首先要把上篇遗留下来的蓝牙外围设备写数据等问题解决下...

## 解决蓝牙写数据等问题
### 更正读数据的一个问题

更正一个问题，就是读数据时notify和read的两个回调，本人实测回调notification只是在之后回调一次，而不论读数据采用以上哪种，updataValue方法总是会执行，而且有时还不只是一次；


总结：

1.read方法时，回调updataValue；nofify时，notification回调一次后，updataValue再开始调，且不只一次；

2.接收 characteristic 数据的方式有两种：

在需要接收数据的时候，调用 readValueForCharacteristic:，这种是需要主动去接收的。
用 setNotifyValue:forCharacteristic: 方法订阅，当有数据发送时，可以直接在回调中接收。

### 向 characteristic 写数据

写数据其实是一个很常见的需求，如果 characteristic 可写，你可以通过CBPeripheral类的writeValue:forCharacteristic:type:方法来向设备写入NSData数据。

```
[peripheral writeValue:dataToWrite forCharacteristic:characteristic type:CBCharacteristicWriteWithResponse];
```

上面的那个type参数是表示是否需要在写入后进行回调，这里的意思是需要回调，那么将在下面这个函数回调:

```
- (void)peripheral:(CBPeripheral *)peripheral
didWriteValueForCharacteristic:(CBCharacteristic *)characteristic
             error:(NSError *)error {
 
    if (error) {
        NSLog(@"Error writing characteristic value: %@", [error localizedDescription]);
    }
}
```

### 读写补充

在不用和 peripheral 通信的时候，应当将连接断开，这也对节能有好处。在以下两种情况下，连接应该被断开：

当 characteristic 不再发送数据时。（可以通过 isNotifying 属性来判断）
你已经接收到了你所需要的所有数据时。
以上两种情况，都需要先结束订阅，然后断开连接。

```
[peripheral setNotifyValue:NO forCharacteristic:characteristic];
[myCentralManager cancelPeripheralConnection:peripheral];
```

**cancelPeripheralConnection:** 是非阻塞性的，如果在 peripheral 挂起的状态去尝试断开连接，那么这个断开操作可能执行，也可能不会。因为可能还有其他的 central 连着它，所以取消连接并不代表底层连接也断开。从 app 的层面来讲，在 peripheral 决定断开的时候，会调用 **CBCentralManagerDelegate**  的 **centralManager:didDisconnectPeripheral:error:** 方法。

另外关于蓝牙重连等的相关东西，这里就不一一说了，有兴趣的还是到本文参考文章中去找答案吧！再次感谢广大的代码工作者们！

------------------------------------

# 项目总结
## 关于结构方面的

这一点呢是个人习惯的问题，我们一般在工作中会接手到一些别人做了一半的任务，只有部分功能被实现的很好，那么这时就需要大量改动代码了。个人的建议是，不要在原来的模块中做修改，而是添加一个中间层，新实现的功能封装在新的类中，等到所有功能全部实现，再进行项目整合，因为这个时候对项目基本上能算作是了解，重构的时候也相对容易些。

第二点是关于iOS block与delegate选择上的意见，上面一点中说的中间层最好选用block，因为在逻辑上真的是很好理解，而且不容易出错，少写很多代码；而代理的话适合暴露出去，被其他人使用，这样调用你代码的人会在结构上相对好把握，自由度要大些。

PS:既然说到了block，我们补充一点，如果你想让自己的block失效，ARC下只要让他的指针置空就可以了，当然如果你只是对它进行了第二次赋值，那么之前指针所指向的block块是没有被失效的。

## 说说写代码的一些

1.就像本项目中用到的蓝牙，这些都是不需要在主线程中做的事情，诸如此类的相关还有网络连接，喇叭，话筒等（），将它们扔在后台线程中，任务完成之后回到主线程中修改UI;

2.一些超时操作，我们需要的把它也扔在后台线程中，你可以用:

```
dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
            _scanTimer = [NSTimer scheduledTimerWithTimeInterval:seconds target:self selector:@selector(scanTimeoutHandler:) userInfo:nil repeats:NO];
            });

```
也可以这样：


```
[self performSelector:@selector(scanTimeoutHandler:) withObject:nil afterDelay:seconds inModes:@[NSDefaultRunLoopMode]];
```
或者直接把它加到你的一个runloop中：

```
[[NSRunLoop currentRunLoop] addTimer:timer forMode:NSRunLoopCommonModes];
```
否则它一直占用着当前的线程会给你带来很大的困扰；

3.NSStream Socket网络编程

NSStream很简单，用到的东西并不是很多就可以做一个简单的socket；NSStreamDelegate,NSInputStream,NSOutStream，一个代理和两个对象，连接的时候像这样：


```
- (void)connectToHostUseStreamWithIP:(NSString *)host port:(int)port data:(NSData *)data{
    // 1.建立连接
    // 定义C语言输入输出流
    CFReadStreamRef readStream;
    CFWriteStreamRef writeStream;
    CFStreamCreatePairWithSocketToHost(NULL, (__bridge CFStringRef)host, port, &readStream, &writeStream);
    
    // 把C语言的输入输出流转化成OC对象
    _inputStream = (__bridge NSInputStream *)(readStream);
    _outputStream = (__bridge NSOutputStream *)(writeStream);
    
    // 设置代理
    _inputStream.delegate = self;
    _outputStream.delegate = self;
    
    // 把输入输入流添加到运行循环
    [_inputStream scheduleInRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
    [_outputStream scheduleInRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
    
    // 打开输入输出流
    [_inputStream open];
    [_outputStream open];
    
    //发送数据
    [[NSRunLoop currentRunLoop] run];
}
```

断开时候：

```
- (void)stopConnect{
    // 从运行循环移除
    [_inputStream removeFromRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
    [_outputStream removeFromRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
    // 关闭输入输出流
    [_inputStream close];
    [_outputStream close];
    
    _inputStream = nil;
    _outputStream = nil;
    
    NSLog(@"Socket 连接已断开！");
}
```
代理只有一个回调函数，你所有的事情全部需要在这里面解决；

```
-(void)stream:(NSStream *)aStream handleEvent:(NSStreamEvent)eventCode{
    NSLog(@"%@",[NSThread currentThread]);
    //    NSStreamEventOpenCompleted = 1UL << 0,//输入输出流打开完成
    //    NSStreamEventHasBytesAvailable = 1UL << 1,//有字节可读
    //    NSStreamEventHasSpaceAvailable = 1UL << 2,//可以发放字节
    //    NSStreamEventErrorOccurred = 1UL << 3,// 连接出现错误
    //    NSStreamEventEndEncountered = 1UL << 4// 连接结束
    
    switch (eventCode) {
        case NSStreamEventOpenCompleted:
                NSLog(@"输入输出流打开完成");
                break;
        case NSStreamEventHasBytesAvailable:
                NSLog(@"有字节可读");
                [self readDataFromSocket];
                break;
        case NSStreamEventHasSpaceAvailable:
                NSLog(@"可以发送字节");
            [self sendDataToSocket];
                break;
        case NSStreamEventErrorOccurred:
                NSLog(@"连接出现错误");
                break;
        case NSStreamEventEndEncountered:
                NSLog(@"连接结束");
     
     
        // 从运行循环移除
        [_inputStream removeFromRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
        [_outputStream removeFromRunLoop:[NSRunLoop currentRunLoop] forMode:NSDefaultRunLoopMode];
            
            
        // 关闭输入输出流
        [_inputStream close];
        [_outputStream close];
                break;
        default:
                break;
     }
}
```

记住，一定是自己单独开一个线程，socket会一直占用着线程，如果你不把它自己关掉，那么它会无休止的连接着，你无法做一些其他的事情，所以，这一点很重要；

另外，用完一定要关掉它，一定，一定，重要的事情多说几遍；

4.状态机

我们在项目中有时会遇到一些状态值，一般情况下枚举将会是个好选择，然而当你遇到的状态是多选择的就显得不那么好用了；于是本项目中我用到的option会是一个好的点子；我们先上代码，然后来解释；

```
typedef NS_OPTIONS(NSUInteger,CardOperationState) {
    CardOperationState_idle = 0,
    
    CardOperationState_ReadCorrect = 1 << 0, //读卡成功 1
    CardOperationState_ReadWrong = 1 << 1,   //读卡失败 2
    
    CardOperationState_Checkouted = 1 << 2,      //已校验密码 4
    CardOperationState_Written = 1 << 3,         //数据已写入成功 8
    CardOperationState_ChangedPass = 1 << 4,     //已修改密码
};

```

举个例子，如果你要表示的状态是已校验，已写入，已修改，那你的这个状态应该是:


```
state == CardOperationState_Checkouted | CardOperationState_Written| CardOperationState_ChangedPass
```
用枚举的话那要用好几个判断:


```
state == CardOperationState_Checkouted && state == CardOperationState_Written && state == CardOperationState_ChangedPass 
```
很明显，option少写了很多判断；

当前状态添加一个状态：

```
currentState = currentState | CardOperationState_Checkouted;//增加已校验状态
```
减少一个状态：

```
currentState = currentState & (~CardOperationState_ReadCorrect);
```

判断是否包含一个状态:

```
currentState & CardOperationState_Checkouted
```


