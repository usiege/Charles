title: iOS 作为Central蓝牙连接外围（上）
date: 2016-05-21 18:06:00
categories: coder
tags: [iOS, bluetooth]
-----------

Summary: 今天说一说iOS蓝牙相关的东西，本文背景是公司的蓝牙项目，项目要求是利用手机蓝牙模块与低功耗蓝牙卡进行通信，蓝牙卡信息解析由卡厂商提供，而我们先要做的就是建立手机与蓝牙卡的连接。

今天说一说iOS蓝牙相关的东西，本文背景是公司的蓝牙项目，项目要求是利用手机蓝牙模块与低功耗蓝牙卡进行通信，蓝牙卡信息解析由卡厂商提供，而我们先要做的就是建立手机与蓝牙卡的连接。难点主要集中在与蓝牙卡连接断开部分，因为蓝牙卡是低能耗的，每开启蓝牙卡片蓝牙后它会在8秒后自动断开连接，所以在处理蓝牙连接的的部分逻辑较为复杂。接下来我们把重点放在与蓝牙建立连接的部分，Google之，先来搞清楚与iOS有关的蓝牙库。    

先说一下蓝牙版本问题，如果你的设备支持的是蓝牙4.0之前的版本，那么会涉及到一个MFI的概念，MFI（Make For ipod/ipad/iphone）是苹果的一套认证，只有少数的硬件厂商才有苹果的MFI认证，做之前需要搞定这个认证。使用蓝牙4.0的话，由于4.0苹果开放了BLE（Bluetooth Low Energy）通道，就不会有认证的问题了，而且向下兼容。    
我们用到的蓝牙库为CoreBluetooth，而蓝牙库中首先要介绍下两个概念Central和Peripheral；

# Central 和 Peripheral 在蓝牙交互中的角色

><font color=#C0C0C0  size=4>所有涉及蓝牙低功耗的交互中有两个主要的角色：中心Central和外围设备Perpheral。根据一些传统的客户端-服务端结构，Peripheral通常具有其他设备所需要的数据，而Central通常通过使用Perpheral的信息来实现一些特定的功能。</font>

这里我自己理解，如果你的设备连接的是本文这种蓝牙卡或者穿戴设备等，那么你的程序就是作为Central；如果你的设备是与另外一台iPhone设备，那么它既可以作为Central也可以作为Perpheral；

想了解更详细请参照：[iOS蓝牙编程指南 -- 核心蓝牙概述](http://www.jianshu.com/p/760f042a1d81)

# UUID

每个蓝牙4.0的设备都是通过服务和特征来展示自己的，一个设备必然包含一个或多个服务，每个服务下面又包含若干个特征。特征是与外界交互的最小单位。比如说，一台蓝牙4.0设备，用特征A来描述自己的出厂信息，用特征B来与收发数据等。

服务和特征都是用UUID来唯一标识的，UUID的概念如果不清楚请自行google,国际蓝牙组织为一些很典型的设备(比如测量心跳和血压的设备)规定了标准的service UUID(特征的UUID比较多，这里就不列举了);        

><font color=#C0C0C0  size=2>UUID含义是通用唯一识别码 (Universally Unique Identifier)，这是一个软件建构的标准，也是被开源软件基金会 (Open Software Foundation, OSF) 的组织应用在分布式计算环境 (Distributed Computing Environment, DCE) 领域的一部分。
UUID是指在一台机器上生成的数字，它保证对在同一时空中的所有机器都是唯一的。通常平台会提供生成的API。按照开放软件基金会(OSF)制定的标准计算，用到了以太网卡地址、纳秒级时间、芯片ID码和许多可能的数字。

>UUID由以下几部分的组合：

>（1）当前日期和时间，UUID的第一个部分与时间有关，如果你在生成一个UUID之后，过几秒又生成一个UUID，则第一个部分不同，其余相同。

>（2）时钟序列。

>（3）全局唯一的IEEE机器识别号，如果有网卡，从网卡MAC地址获得，没有网卡以其他方式获得。
>UUID的唯一缺陷在于生成的结果串会比较长。关于UUID这个标准使用最普遍的是微软的GUID(Globals Unique Identifiers)。在ColdFusion中可以用CreateUUID()函数很简单地生成UUID，其格式为：xxxxxxxx-xxxx- xxxx-xxxxxxxxxxxxxxxx(8-4-4-16)，其中每个 x 是 0-9 或 a-f 范围内的一个十六进制的数字。而标准的UUID格式为：xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (8-4-4-4-12)，可以从cflib 下载CreateGUID() UDF进行转换。</font>

# BLE中心模式流程

1.建立中心角色    

2.扫描外设(Discover Peripheral)    

3.连接外设(Connect Peripheral)    

4.扫描外设中的服务和特征(Discover Services And Characteristics)    

5.利用特征与外设做数据交互(Explore And Interact)

6.订阅Characteristic的通知

7.断开连接(Disconnect)

# 代码说明
## 初始化 CBCentralManager

```objective-c
dispatch_queue_t centralQ = dispatch_queue_create(BLUETOOCH_QUEUE_IDENTIFER, DISPATCH_QUEUE_CONCURRENT);
 _centralManager = [[CBCentralManager alloc] initWithDelegate:self queue:centralQ];
```
上面的代码中，将self设置为代理，用于接收各种 central 事件。将queue设置为nil，则表示直接在主线程中运行，这里是我自己定义的任务队列。

创建Central管理器时，管理器对象会调用代理对象的centralManagerDidUpdateState:方法。我们需要实现这个方法来确保本地设备支持BLE。

初始化 central manager 之后，设置的代理会调用centralManagerDidUpdateState:方法，所以需要去遵循<CBCentralManagerDelegate>协议。这个 did update state 的方法，能获得当前设备是否能作为 central。关于这个协议的实现和其他方法，接下来会讲到，也可以先看看[官方API](https://developer.apple.com/library/ios/documentation/CoreBluetooth/Reference/CBCentralManagerDelegate_Protocol/index.html#//apple_ref/doc/uid/TP40011285)

## 搜索当前可用的 peripheral

可以使用*CBCentralManager的scanForPeripheralsWithServices:options:*方法来扫描周围正在发出广播的 Peripheral 设备。peripheral 每秒都在发送大量的数据包，*scanForPeripheralsWithServices:options:*方法会将同一 peripheral 发出的多个数据包合并为一个事件，然后每找到一个 peripheral  都会调用 *centralManager:didDiscoverPeripheral:advertisementData:RSSI:* 方法。另外，当已发现的 peripheral  发送的数据包有变化时，这个代理方法同样会调用。

```
NSArray *services = @[[CBUUID UUIDWithString:BUSINESS_SERVICE_UUID_STRING]
NSDictionary *scanOption = @{CBCentralManagerScanOptionAllowDuplicatesKey:@(NO)};
[_centralManager scanForPeripheralsWithServices:services options:scanOption];
```
这里的services是中心要扫描的蓝牙设备类型，表示只搜索当前数组包含的设备（每个 peripheral 的 service 都有唯一标识——UUID）；而scanOption中的`CBCentralManagerScanOptionAllowDuplicatesKey`设置以后，每收到广播，就会调用上面的回调（无论广播数据是否一样）。关闭默认行为一般用于以下场景：根据 peripheral 的距离来初始化连接（距离可用信号强度 RSSI 来判断）。设置这个 option 会对电池寿命和 app 的性能产生不利影响，所以一定要在必要的时候，再对其进行设置。

在调用`scanForPeripheralsWithServices:options:`方法之后，找到可用设备，系统会回调（每找到一个都会回调）`centralManager:didDiscoverPeripheral:advertisementData:RSSI:`。该方法会已CBPeripheral返回找到的 peripheral，所以你可以使用数组将找到的 peripheral 存起来。

```
//扫描到蓝牙后的回调
-(void)centralManager:(CBCentralManager *)central didDiscoverPeripheral:(CBPeripheral *)peripheral advertisementData:(NSDictionary *)advertisementData RSSI:(NSNumber *)RSSI{
    //RSSI(Received Signal Strength Indication接收的信号强度指示)   
    printf("didDiscoverPeripheral\n");
    NSLog(@"advertisement data is :%@",advertisementData);
    NSString* identifer = [peripheral.identifier UUIDString];
}
```

## 连接 peripheral

```
//连接外围设备
[_centralManager connectPeripheral:peripheral options:nil];
```
当连接成功后，会回调方法*centralManager:didConnectPeripheral:*。在这个方法中，你可以去记录当前的连接状态等数据。

```
-(void)centralManager:(CBCentralManager *)central didConnectPeripheral:(CBPeripheral *)peripheral{
    printf("已连接上设备：");
    printf("name = %s\n",[peripheral.name UTF8String]);
    
    //连接到设备后要设置设备的代理，这样才可以接收到外围的服务与特性
    peripheral.delegate = self;
    
    NSArray<CBUUID*>* uuids =@[
	[CBUUID UUIDWithString:WRITE_CHARACTERISTIC_UUID_STRING],
	[CBUUID UUIDWithString:READ_CHARACTERISTIC_UUID_STRING]];
	//发现服务
	[peripheral discoverServices:uuids];
}
```
如果连接断开则会回调：

```
//断开回调处理
- (void)centralManager:(CBCentralManager *)central didDisconnectPeripheral:(CBPeripheral *)peripheral error:(NSError *)error{
    printf("设备 %s 已断开！\n",[peripheral.name UTF8String]);
}
```
失败的情况下则是： 
   
```
//连接失败回调
-(void)centralManager:(CBCentralManager *)central didFailToConnectPeripheral:(CBPeripheral *)peripheral error:(NSError *)error{
    NSLog(@"didFailToConnectPeripheral error:%@",error);
}
```

## 搜索 peripheral 的 service

当与 peripheral 成功建立连接以后，就可以通信了。第一步是先找到当前 peripheral 提供的 service，因为 service 广播的数据有大小限制（貌似是 31 bytes），所以你实际找到的 service 的数量可能要比它广播时候说的数量要多。调用CBPeripheral的 `discoverServices:`方法可以找到当前 peripheral 的所有 service。

```
//在搜索过程中，并不是所有的 service和characteristic 都是我们需要的,如果全部搜索，依然会造成不必要的资源浪费。
//这里的uuids是我工程中用到的UUID
NSArray<CBUUID*>* uuids =@[
[CBUUID UUIDWithString:WRITE_CHARACTERISTIC_UUID_STRING],
[CBUUID UUIDWithString:READ_CHARACTERISTIC_UUID_STRING]];
//发现服务
[peripheral discoverServices:uuids];
```
当找到特定的 Service 以后，会回调<CBPeripheralDelegate>的`peripheral:didDiscoverServices:`方法。Core Bluetooth 提供了CBService类来表示 service，找到以后，它们以数组的形式存入了当前 peripheral 的services属性中，你可以在当前回调中遍历这个属性。

```
- (void)peripheral:(CBPeripheral *)peripheral didDiscoverServices:(NSError *)error{ 
    if(error){
        NSLog(@"发现服务错误：%@",error);
        return;
    }
    printf("发现周边设备的服务:\n");
    printf("==== didDiscoverServices ==== \n");
 	
     //发现服务中的特性 
    for (CBService *service in peripheral.services) {
        printf("-- service : %s\n",[[service.UUID UUIDString] UTF8String]);
        [peripheral discoverCharacteristics:nil forService:service];
    }
}
```
## 搜索 service 的 characteristic

找到需要的 service 之后，下一步是找它所提供的 characteristic。如果搜索全部 characteristic，那调用CBPeripheral的`discoverCharacteristics:forService:`方法即可。如果是搜索当前service的characteristic，那还应该传入相应的CBService对象：

```
[peripheral discoverCharacteristics:nil forService:service];
```
找到所有 characteristic 之后，回调`peripheral:didDiscoverCharacteristicsForService:error:`方法，此时 Core Bluetooth 提供了CBCharacteristic类来表示characteristic。可以通过以下代码来遍历找到的 characteristic ：

```
- (void)peripheral:(CBPeripheral *)peripheral didDiscoverCharacteristicsForService:(CBService *)service error:(NSError *)error{
    printf("发现服务 :(%s)\n",[[service.UUID UUIDString] UTF8String]);
    
    if (error) {
        NSLog(@"There is a error in peripheral:didDiscoverCharacteristicsForService:error: which called:%@",error);
        return;
    } 
    printf("开始读取服务数据...\n");
    for (CBCharacteristic *characteristic in service.characteristics) {
        NSLog(@"properties is %lu",characteristic.properties);
        if (characteristic.properties & CBCharacteristicPropertyNotify) {
//            [peripheral readValueForCharacteristic:characteristic];
            [peripheral setNotifyValue:YES forCharacteristic:characteristic];
        }
    }
}
```
## 读取 characteristic 数据

这里读取涉及到两个方法：

```
[peripheral readValueForCharacteristic:characteristic];
[peripheral setNotifyValue:YES forCharacteristic:characteristic];

```
read这种方法是需要主动去接收的；notify方法订阅，当有数据发送时，可以直接在回调中接收,如果 characteristic 的数据经常变化，那么采用订阅的方式更好；


```
//获取外设发来的数据，不论是read和notify,获取数据都是从这个方法中读取。
- (void)peripheral:(CBPeripheral *)peripheral didUpdateValueForCharacteristic:(CBCharacteristic *)characteristic error:(NSError *)error{
    if (error) {
        NSLog(@"There is a error in peripheral:didUpdateValueForCharacteristic:error: which called:%@",error);
        return;
    }
    NSLog(@"characteristic data is:%@ ",characteristic.value);
    NSLog(@"characteristic data length is %ld",characteristic.value.length);
}

```
所以nofify可能会被调用多次，而且它获取的是实时数据，如果你接收蓝牙信息不是一次次接收的话，那么会用到它：

```
//中心读取外设实时数据
- (void)peripheral:(CBPeripheral *)peripheral didUpdateNotificationStateForCharacteristic:(CBCharacteristic *)characteristic error:(NSError *)error{
    printf("didUpdateNotificationStateForCharacteristic (%s)\n",[[characteristic.UUID UUIDString] UTF8String]);
    if(error){
        printf("error is : %s\n",[error.description UTF8String]);
        return;
    }
    printf(" update notification success !!");
    NSLog(@"接收到的数据：%@",characteristic.value);
    }   
}
```
[本文参考](http://www.saitjr.com/ios/core-bluetooth-read-write-as-central-role.html)，之后会继续讲解写数据和重连等问题；






