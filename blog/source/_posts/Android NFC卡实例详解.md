title: Android NFC卡实例详解
date: 2016-07-08 11:08:00
categories: coder
tags: [Android, NFC]
-----------

公司最近在做一个NFC卡片的工程，经过几天的时间，终于写了一个Demo出来，在此记录下在此过程中遇到的问题。由于之前本人是做iOS的，Android写起来并不是那么的顺手，其中有一些比较基础的问题也会做出解答，水平不高，唯愿不被吐槽。另外最近写java发现，不得不说java还是比较好写的，不用考虑循环引用的问题，而且没有指针的存在理解起来也不是很费劲，内部类用起来的便捷性，底层库也比较好用，下面直接进入Demo吧；

项目地址：[NFCDemo](https://github.com/usiege/Android_S/tree/NFC-master/NFCDemo)

## NFC
由于本篇主要讲的是Android手机对NFC卡片的处理，所以先来介绍几个NFC的概念，定义并不完全，如需了解更多请自行谷歌；


>>NFC,全称是近场通信（Near Field Communication）,是一种短距离无线技术；

>一个带有NFC支持的android设备通常是一个发起者。也可以作为NFC的读写设备。他将检测NFC tags并且打开一个Activity来处理. Android 2.3.3还有支持有限的P2P。;

>Android NFC同时支持三个主要的操作模式:

>**设备读/写模式，允许NFC设备的读/写NFC目标设备**(本例中我们用的是这种操作模式);

>P2P模式，使NFC设备与其他NFC节点交换数据；这种运作模式被使用在Android Beam中;

>卡仿真模式，使NFC设备本身作为一个NFC卡。然后模拟NFC卡可以通过一个外部的NFC读写访问，如销售终端NFC点。


>>NDEF(NFC data exchange format)

>为实现NFC标签、NFC设备以及NFC设备之间的交互通信，NFC论坛(NFC Forum)定义了称为NFC数据交换格式（NDEF）的通用数据格式;

>NDEF是轻量级的紧凑的二进制格式，可带有URL，vCard和NFC定义的各种数据类型;

>NDEF使NFC的各种功能更加容易的使用各种支持的标签类型进行数据传输，因为NDEF已经封装了NFC标签的种类细节信息，使得应用不用关心是在与何种标签通信;

>**大致可以理解为就是NFC通信用的一种传输格式；**

>>Android Beam

>Android Beam是一个基于近场通信所做的新功能，这个功能可以为其他手机分享你正在使用的功能。 Android升级到4.1后，Android Beam现在可以在两台支持NFC的Android设备间分享照片和视频，还可以与支持NFC的蓝牙设备相连。

>*？这里有一个标签的概念比较模糊，原文是“当Android设备扫描包含NDEF格式数据的NFC标签，它对消息进行解析，试图找出其中的数据的MIME类型或URI标识”，从该句可看，所谓的标签就是基于NDEF格式的捆绑数据，从标签可获取到NFC设备数据；这里有待确认！*

## NFC逻辑封装

由于NFC相关是独立于Activity的，所以将NFC的逻辑全部封装在了一个叫做`NfcManager`的类中，注意该类并不需要做成一个单例；

- 获取权限

在`AndroidManifest.xml`文件中添加NFC权限：


```
<uses-permission android:name="android.permission.NFC"/>
```

另外获取NFC设备数据需要在`<activity/>`内添加如下内容：

```
<intent-filter>
    <action android:name="android.nfc.action.TECH_DISCOVERED"/>
</intent-filter>

<meta-data
	android:name="android.nfc.action.TECH_DISCOVERED"
	android:resource="@xml/nfc_tech_filter"/>
```

上面的`nfc_tech_filter`是在res/xml文件下的自定义xml文件，用于对NFC服务的筛选：

```
<?xml version="1.0" encoding="utf-8"?>

<resources>
    <tech-list>
        <tech>android.nfc.tech.IsoDep</tech>
    </tech-list>
    <tech-list>
        <tech>android.nfc.tech.NfcA</tech>
    </tech-list>
</resources>

```

- Intent

>>Intent是Android中的一个用于传递信息的封装类，可以理解为不同组件通信的媒介或者信使。

>在进行`Intent`的查询过程中了解到Android开发的四大组件，分别是*Activity*,*Service*,*Broadcast*,*ContentProvider*，而`Intent`可作为前三者的传递者；

>在SDK中给出了Intent作用的表现形式为：

>- 通过Context.startActivity() orActivity.startActivityForResult() 启动一个Activity；

>- 通过 Context.startService() 启动一个服务，或者通过Context.bindService() 和后台服务交互；
>- 通过广播方法(比如 Context.sendBroadcast(),Context.sendOrderedBroadcast(),  Context.sendStickyBroadcast()) 发给broadcast receivers。

本例中，我们的NFC卡片信息就是从Intent中读取到的；

- 初始化NFC

自定义`NFCActivity`，并在其中声明并定义一个实例变量：

```
NfcManager  nfcManager_  = new NfcManager();
```

这里要说一下从谷歌开源项目风格中吸收到的一种命名规则，私有实例变量会在名称后加下划线，而OC的风格是在前面加，不管哪种命名风格，都会有可能性的增加程序的易读性，易用，宜用；

接下来初始化nfc模块，在`onCreat()`函数中：

```
nfcManager_.initAdapter(this);
```

`NFCManager`声明：

```

public class NfcManager{

	//NFC
    private NfcAdapter nfcAdapter_;
    private PendingIntent pendingIntent_;
    private NFCActivity activity_;
    
    
	//初始化
    public void initAdapter(NFCActivity activity){

        System.out.println ("初始化NFC");
        //初始化nfc适配器
        nfcAdapter_ = NfcAdapter.getDefaultAdapter(activity);
        //初始化卡片信息
        pendingIntent_ = PendingIntent.getActivity(activity, 0,
                            new Intent(activity, activity.getClass()).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP), 0);
        //保留外部变量
        activity_ = activity;
    }
}
```

从这里可以看到，`NFCActivity`保留了`NfcManager`的实例变量，而反过来`NfcManager`也保留了`NFCActivity`的实例变量，这如果是在OC中会造成循环引用问题的；

- 接收Intent

同样，在`onCreat()`中：

```
onNewIntent (getIntent ());
```

这里这个貌似不用主动调用，`onNewIntent()`方法也会初调用；这个`onNewIntent()`是`Activity`的重写方法，Activity检测到有新的Intent时就会调用该方法，我们的NFC事件也是通过这个方法被传送回来的。

接下来：

```
//处理NFC触发
    @Override
    protected void onNewIntent(Intent intent) {
        //读取数据
        nfcManager_.readData(intent);
    }
```

我们再来看看这个`readData()`：

```
	 private IsoDep isodep_; //ISO14443-4 NFC操作
	 //从Intent中读卡
    public void readData(Intent intent){

        if (!NfcAdapter.ACTION_TECH_DISCOVERED.equals(intent.getAction())){
        		//这里我们做了一个判断，即如果返回的不是NFC事件，直接返回，不做处理；
            return;
        }

        System.out.println ("从intent中获取标签信息！");
        
        //从intent中获取标签信息
        Parcelable p = intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
        if (p != null) {
            Tag tag = (Tag) p;
            isodep_ = IsoDep.get(tag);
            if (isodep_ != null){
                readData();
            }
        }else {
            //那么这里就是没有获取到Intent喽
        }
    }
    private void readData() {
    	//毫无疑问，这里就是读卡的操作了
    	//如果想要了解读卡的具体细节，那么这就与外围的NFC设备有关了，Tag里的逻辑将是由NFC设备厂商定义
    	//本工程中的是调用NFC卡厂商的sdk进行读卡的，在实际工程中具体问题需要具体分析，本文中只讨论过程
    	//如果读者有兴趣，稍后会贴出本工程git地址，本例读卡写卡处理sdk为 package com.broadstar.nfccardsdk;
    }
```

另外在activity生命周期函数内：

```
	//程序恢复
    @Override
    protected void onResume() {
        super.onResume();
        nfcManager_.enableForegroundDispatch(this);
    }

    //程序暂停
    @Override
    protected void onPause() {
        super.onPause();
        nfcManager_.disableForegroundDispatch(this);
    }
```

同样`NfcManager`内部实现：

```
	 public static String[][] TECHLISTS; //NFC技术列表
    public static IntentFilter[] FILTERS; //过滤器

    static {
        try {
            TECHLISTS = new String[][] { { IsoDep.class.getName() }, { NfcA.class.getName() } };

            FILTERS = new IntentFilter[] { new IntentFilter(NfcAdapter.ACTION_TECH_DISCOVERED, "*/*") };
        } catch (Exception ignored) {
        }
    }	
    
    public void enableForegroundDispatch(NFCActivity activity){
        if (nfcAdapter_ != null) {
            nfcAdapter_.enableForegroundDispatch(activity, pendingIntent_, FILTERS, TECHLISTS);
        }
    }
    
    public void disableForegroundDispatch(NFCActivity activity){
        if (nfcAdapter_ != null)
            nfcAdapter_.disableForegroundDispatch(activity);
    }

```

## 一些其他的问题

- String parseInt(,)

```
 String str="123";
 int i = Integer.parseInt(str,8);
```
`parseInt(,)`后面的参数表示当str被看作是多少进制时，i所得到的值(i 是10进制)

- instanceOf关键字

判断某个子类对象是否属于某个子类的方法：

```

public class CardInfo{}
public class ReadCardInfo extends CardInfo{}

public void someMethod(CardInfo info) {
    if (info instanceof ReadCardInfo) {
    	//是否是ReadCardInfo的实例
    }
}
```

- 手机访问网络权限

出现java.net.SocketException: socket failed: EACCES (Permission denied)抱错时，AndroidManifest.xml中：

```
<!--网络访问权限-->
<uses-permission android:name="android.permission.INTERNET" />
```

- Android Studio第三方Sdk无法识别的问题

安卓工程的第三方sdk都是放在libs文件夹下的，当无法识别时，点击工程树目录处点击Project，右键libs里的jar包，点击Add as a library，然后再点击同步工程即可解决；

- 不要在子线程中更新UI，切记，网上有方法可以调用，如果想这样做，那么请自行研究


- 外部类中new另外一个类的内部类

例如本例中，`NFCActivity`中有一个`CardHandler`的实例：

`CardHandler`中有一个内部公共类：

```
public class CardHandler{

	//内部类
	public class sendCommand implements Runnable {
	
        private Map<String, Object> param_ = null;
        private Message msg = null;

        public sendCommand(Map<String, Object> param) {
            sendCommand.this.param_ = param;
        }

        //子线程中不可以操作UI，使用Handler进行消息传递
        @Override
        public void run() {
            
        }
    }
}
```

`NFCActivity`中`operateCard()`函数想要实例化一个`sendCommand`的内部类对象，那么：


```
CardHandler cardHandler_ = new CardHandler(this,nfcManager_);
private void operateCard(Map<String, Object> param) {
        //内部类的用法
        ThreadPoolUtils.execute(cardHandler_.new sendCommand(param));
        //上面的这个方法把sendCommnad操作放在了子线程中
}
```