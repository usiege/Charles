title: 为你的UIView添加一个动画Layer
date: 2018-05-21 22:37:00
categories: coder
tags: [swift,iOS]
-----------


我想你一定用过UIView， 我想你也一定知道CALayer是什么，具体细节的东西请自行谷歌，我们今天要用Layer搞一点事情；

<!--- more --->


[TOC]


## 总结几点性质
> 1. UIView继承自`UIResponder`，用于交互，那么这么看来师承自事件流，属于动作学派；
2. UIView有一个`CALayer`的属性，且CALayer继承自`NSObject`，并且根据苹果文档描述"The base layer class"，看来应该是一个layer体系，且layer用于渲染，属于CA阵营，属于图像学派；
3. layer的代理是view，这样看来真正用于显示的应该是CALayer，鬼知道CALayer是不是跟OpenGL有关系；
4. 所以如果你要是想做动画，那我给你的建议就是，最好在layer层上做；
5. 对于，你知道layer是有个叫做`anchorPoint`属性的，做过cocos2dx的应该知道，你说layer的display里难道没有点opengl的痕迹？
6. 还记得仿射变换吗，平移+线性变换，layer完全是可以做到的；
7. layer自身是有绘制能力的，只不过不支持事件响应，但有一点它可以做的到：layer遵从了一个`CAMediaTiming`的协议，而这个协议就厉害了，配合`CACurrentMediaTime`，跟系统时钟挂上勾，CPU的时钟周期`mach_absolute_time`转化成秒数的结果，是一个绝对时间；

## 上面的结论是瞎扯淡

## 我们来搞点看的见的

* 声明一个View:

```swift
class CircleView: UIView {
    //我要做一个绕圈的动画
    //我不会告诉你我是谷歌过的
    //我觉得你也应该学会
}
```

* 添加两个Layer，如果不够，那就多来几个：
```swift
    var backgroundLayer: CAShapeLayer?
    var animationLayer: CAShapeLayer?
    //我觉得你应该知道把它们放在哪
    //好吧我还是给你代码对齐吧，这很python
```

* 工厂一个方法啊哟喂，设计模式就出来了：
```swift
    //给我点颜色，我给你想要的
    //当然，我给你的并不多；
    //我只是一个CAShapeLayer，有形状的框框；
    //有边，有填充；
    func layer(lineColor: UIColor) -> CAShapeLayer {
        
        let layer = CAShapeLayer()
        
        let lineWidth: CGFloat = 5
        let rect = CGRect(x: 0, y: 0, width: self.bounds.width, height: self.bounds.height)
        layer.bounds = rect
        
        //这是个圆
        let path = UIBezierPath(roundedRect: rect, cornerRadius: rect.width / 2)
        layer.lineWidth = lineWidth
        layer.position = CGPoint(x: rect.width / 2, y: rect.height / 2)
        
        layer.path = path.cgPath
        layer.fillColor = UIColor.clear.cgColor
        layer.strokeColor = lineColor.cgColor
        
        layer.strokeStart = 0
        layer.strokeEnd = 1
        
        return layer
    }
```

* 加到view上来
```swift
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        let bgLayer = self.layer(lineColor: UIColor.green)
        self.layer.addSublayer(bgLayer)
        
        self.backgroundLayer = bgLayer
        
        let animationLayer = self.layer(lineColor: UIColor.orange)
        self.layer.addSublayer(animationLayer)
        animationLayer.isHidden = true
        //关于这个层，我们呆会还要做点其他事情；
        //暂时，它是不被看的到的；
        //所以你可以看到，一个View上是可以添加好多层的；
        //如果你把这些层分区块排列出来，那么我便不加那么多view了；
        //哈哈哈，上面这行我开个玩笑；
        
        self.animationLayer = animationLayer
        
        self.backgroundColor = UIColor.black
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
```

## 我们来加一个动画吧！

* 添加动画

```swift
    let PLAY_ANIMATION_KEY = "animation_key"
    func startAnimation(totalTime: CGFloat) {
        guard totalTime > 0 else {
            return
        }
        guard ((self.animationLayer?.animation(forKey: PLAY_ANIMATION_KEY)) == nil) else {
            return
        }
        
        let animation = CABasicAnimation(keyPath: "strokeEnd")
        animation.duration = CFTimeInterval(totalTime)
        
        animation.delegate = self   //转到它开始动了
        
        animation.fromValue = 0
        animation.toValue = 1
        
        animation.isRemovedOnCompletion = true
        animation.fillMode = kCAFillModeForwards
        
        self.animationLayer?.add(animation, forKey: PLAY_ANIMATION_KEY)
    }
```
1. 上面的我们解释一下，首先我们说一个动画是有名字的，用key表示，像上面的`PLAY_ANIMATION_KEY`；
2. layer添加的动画是`CAAnimation`类型的，就是说，所有它的子类都可以添加为layer的动画，你可以去挖掘一下`CAAnimation`一族；
3. `CABasicAnimation`添加的动画是需要一个`keyPath`的，你还需要通过-setFromValue 和-setToValue 来指定一个开始值和结束值，这有点像一个补间动画，输入了起始帧和结束帧，其它马由动画帮你；
> ![image_1ce1gopv01m4lbd41tjr1nel6e39.png-165.6kB][1]
4. 我们可以指定CALayer的某个属性名为keyPath，并且对CALayer的这个属性的值进行修改，达到相应的动画效果，随着动画的进行，在长度为duration的持续时间内，keyPath相应属性的值从fromValue渐渐地变为toValue，keyPath内容是CALayer的可动画Animatable属性，关于这个可动画属性，我觉得我还可以去谷歌一车，回头再说吧；
5. 如果`fillMode == kCAFillModeForwards`同时`removedOnComletion == false`，那么在动画执行完毕后，图层会保持显示动画执行后的状态。但在实质上，图层的属性值还是动画执行前的初始值，并没有真正被改变；

## 它开始动了
加入到layer中它会自动开始，并且这开始和结束都有回调哦；
```swift
extension CircleView: CAAnimationDelegate {
    func animationDidStart(_ anim: CAAnimation) {
        self.startTime = CACurrentMediaTime()
    }
    
    func animationDidStop(_ anim: CAAnimation, finished flag: Bool) {
        
    }
}
```

## 暂停和恢复
我们来记录两个时间：
```swift
    var startTime: CFTimeInterval!  //动画开始时系统时钟
    var pastTime: CFTimeInterval!   //动画运行过的时间（除去暂停的时间）
```

* 暂停一下
```swift
    func pauseAnimation(layer: CALayer) {
        let pausetime = layer.convertTime(CACurrentMediaTime(), from: nil)
        layer.timeOffset = pausetime
        layer.speed = 0
        
        print(#function)
        print("start time: \(startTime)")
        print("pause time: \(pausetime)")
        print("系统时钟： \(CACurrentMediaTime())")
        print("以GMT为标准的，2001年一月一日00：00：00这一刻的时间绝对值: \(CFAbsoluteTimeGetCurrent())")
        let pasttime = pausetime - startTime
        print("past time: \(pasttime)")
        self.pastTime = pasttime
    }
```
所以你只需要搞清楚`timeOffset`，`speed`以及`convertTime`就可以了；
按我说的做，自己跑一跑，对比下时间，马上清楚，不要再记些什么公式了；

* 恢复动画
```swfit
    func resumeAnimation(layer: CALayer) {
        let pausetime = layer.timeOffset
        
        layer.timeOffset = 0
        layer.beginTime = 0
        layer.speed = 1
        
        let begintime = layer.convertTime(CACurrentMediaTime(), to: nil) - pausetime
        layer.beginTime = begintime
        
        print(#function)
        print("系统时钟： \(CACurrentMediaTime())")
        print("begin time: \(begintime)")
    }
```
那么上面说的需要知道的属性还需要添加一个`beginTime`；

* 最后你需要把动画移除掉吗？
```swift
    func stopAnimation() {
        guard self.animationLayer?.animation(forKey: PLAY_ANIMATION_KEY) != nil else {
            return
        }
        
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        self.animationLayer?.timeOffset = 0
        self.animationLayer?.speed = 1
        self.animationLayer?.beginTime = CACurrentMediaTime()
        self.animationLayer?.strokeStart = 0
        self.animationLayer?.strokeEnd = 1
        CATransaction.commit()
        
        self.animationLayer?.removeAnimation(forKey: PLAY_ANIMATION_KEY)
    }
```
移除我们能看的懂，那么`CATransaction`呢？

## CATransaction？
再去谷歌一车吧！！！

  [1]: http://static.zybuluo.com/usiege/cy71tbwdl9q3ckokbr8hbqhb/image_1ce1gopv01m4lbd41tjr1nel6e39.png