title: Swift Currying(柯里化)
date: 2018-01-06 16:34:00
categories: coder
tags: [swift]
-----------

1. 函数式编程思想

先举一个小例子：
```
func addOne(count: Int) -> Int {
    return count + 1
}
//上面这个代码我们是返回一个加和，和是使参数增加1；
//一个更加灵活的方法，我们可以取消上面的硬编码1；

func add(count: Int, addition: Int) -> Int {
    return count + addition
}
//然而这个函数还并不是那么友好，我们用另外一种方法实现看一下：
func add(_ addition: Int) -> (Int) -> Int {
    return {
        count in 
        return count + addition
    }
}

//调用一下以上方法，看看有什么区别：
let number = add(count: 10, addition: 2)    //函数2

let add2 = add(2)           //函数3
let number = add2(10)

let number = add(2)(10)     //函数3调用连起来是
//是不是觉得这种调用方式很熟悉，有点类似于
//classname.property.subproperty，点语法链

```
显然这种编程方式更加灵活，所展现的内容更加直观，可以减少函数写N多的参数；当然函数式编程有的可不只是这些，更多内容不在本篇所讨论之内；
    
基于上例我们来写一个方法：
```
func greaterThan(_ comparer: Int) -> (Int) -> Bool {
    return { $0 > comparer }
}

let compareResult = greaterThan(10)(11)
```
很明显下面这个式子的调用直观的表达了参数10和参数11的大小；

2. target-action例子

我们来看国外网上的一个例子：
```
protocol TargetAction {
    func performAction()
}

struct TargetActionWrapper<T: AnyObject>: TargetAction {
    weak var target: T?
    let action: (T) -> () -> (Void)
    
    func performAction() -> (Void) {
        if let t = target {
            action(t)()
        }
    }
}
//
enum ControlEvent {
    case TouchUpInside
    case ValueChanged
    // ...
}              

class Control {

    var actions = [ControlEvent: TargetAction]()
    
    convenience init<T: AnyObject>(_ target: T, action: @escaping (T) -> () -> (Void), controlEvent: ControlEvent) {
        actions[controlEvent] = TargetActionWrapper(
            target: target, action: action)
    }
    
    func setTarget<T: AnyObject>(target: T, action: @escaping (T) -> () -> (Void), controlEvent: ControlEvent) {
            
            actions[controlEvent] = TargetActionWrapper(target: target, action: action)
    }
    
    func removeTargetForControlEvent(controlEvent: ControlEvent) {
        actions[controlEvent] = nil
    }
    
    func performActionForControlEvent(controlEvent: ControlEvent) {
        actions[controlEvent]?.performAction()
    }
}

//我们来使用一下我们的模板

func viewDidLoad() {
    Control().setTarget(self, action: ViewController.tapAction, controlEvent: .touchUpInside)
    }
}

func tapAction() {
    print("单击了")
}

//如果我们不是用实例方法调用而是自定义构造函数的话
//我们能看到更好的表现方式

func viewDidLoad() {
    Control.init(self, action: ViewController.tapAction controlEvent: .touchUpInside)
}

//当然这个便利构造函数的例子用在这里并不是很合逻辑，但是我们只是想展现一下柯里化的内容
```