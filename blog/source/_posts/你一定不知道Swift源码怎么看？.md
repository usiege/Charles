title: 你一定不知道Swift源码怎么看？
date: 2018-05-03 23:19:00
categories: coder
tags: [swift, UTC]
-----------
我想你一定是在开玩笑。
源码怎么看，打开看呗！说这话的时候请收下我的轻蔑，哈哈。不过就这个问题我今天在知乎搜索了一通。不要问我为什么在知乎搜索，鬼知道知乎什么都有。
那么，请收下我的提问：
<!-- more -->

我想你一定是在开玩笑。
源码怎么看，打开看呗！说这话的时候请收下我的轻蔑，哈哈。不过就这个问题我今天在知乎搜索了一通。不要问我为什么在知乎搜索，鬼知道知乎什么都有。
那么，请收下我的提问：
> [如何阅读Swift源码](https://www.zhihu.com/question/38215419)

知乎果然没有让我失望，结果教程如下；
> [# [如何阅读 Swift 标准库中的源码](http://swift.gg/2016/12/30/how-to-read-the-swift-standard-libray-source/ "如何阅读 Swift 标准库中的源码")
](http://swift.gg/2016/12/30/how-to-read-the-swift-standard-libray-source/)

顺便提一下，这次搜索还让我发现了一个比较不错的swift网站，有心的同学请收下：[swift.gg](http://swift.gg)

于是今天搞了下源码的编译，并了解到一个叫做 *GYB* 的东西，这个东西今天先放一下。源碼編譯的過程無非就是用 *brew* 下了一些命令行軟件，然後使用 *build* 腳本跑一下過程，在此也不多說。但是今天的重點當然是我們要從源碼出發搞一些事情。
续：今天又build，发现也并没有得出什么重要的东西，只是把gyb文件生成为swift文件，其他过程不知道它经历了什么，对我想看源码没有任何作用，还跑了整整一个下午；对于只是想看代码的同学，还是用官网给出的gyb.py脚本做处理吧；

1. hashable

前两天写Dictionary时发现想用枚举做key，自定义一个Dictionary，value是#selector，但是在写的过程中发现说key值需要遵循hashable协议。可以看源码来理解一下。
首先要找到Hashable文件，发现swift的标准核心库被放在 **stdlib/public/core** 下，有一个 **Hashable.swift** 文件，打开文件先是一大段的描述，大体内容就是hashable协议作用的场景，以及给出了一个小例子；

一个Hash类型，提供了一个 hashValue 的属性，它是一个整型常量， 如果有两个相同类型的a，b，如果 a == b，那么 a.hashValue == b.hashValue；但是反过来，如果两个hash值相同，并不表示a 就一定等于 b；
还有一点非常重要，就是在两次不同的程序执行中hash值并不保证相等，所以不要把hash值用在你的程序中；
Hashable协议可用于struct, enum, class，它继承于 Equatable，所以遵循Hashable协议需要同时实现Hashable协议方法，以及 Equatable 协议方法；

```
/// A point in an x-y coordinate system.
    struct GridPoint {
        var x: Int
        var y: Int
    }

     extension GridPoint: Hashable {
         var hashValue: Int {
            return x.hashValue ^ y.hashValue &* 16777619
        }

        static func == (lhs: GridPoint, rhs: GridPoint) -> Bool {
            return lhs.x == rhs.x && lhs.y == rhs.y
        }
    }

       var tappedPoints: Set = [GridPoint(x: 2, y: 3), GridPoint(x: 4, y: 1)]
       let nextTap = GridPoint(x: 0, y: 1)
       if tappedPoints.contains(nextTap) {
          print("Already tapped at (\(nextTap.x), \(nextTap.y)).")
       } else {
          tappedPoints.insert(nextTap)
          print("New tap detected at (\(nextTap.x), \(nextTap.y)).")
       }
      // Prints "New tap detected at (0, 1).")
```
在实现的代码里有一些奇怪的符号，暂时还有点摸不清头脑，有些是一些编译符号，大体能看懂点意思，但有些像`@_silgen_name("_swift_stdlib_Hashable_isEqual_indirect")`就完全看不懂，回头找人再请教；
这里还要说的一个就是一个`UnsafePointer<T>`:
>在 Swift 中，指针都使用一个特殊的类型来表示，那就是 UnsafePointer<T>。遵循了 Cocoa 的一贯不可变原则，UnsafePointer<T> 也是不可变的。当然对应地，它还有一个可变变体，UnsafeMutablePointer<T>。绝大部分时间里，C 中的指针都会被以这两种类型引入到 Swift 中：C 中 const 修饰的指针对应 UnsafePointer (最常见的应该就是 C 字符串的 const char * 了)，而其他可变的指针则对应 UnsafeMutablePointer。除此之外，Swift 中存在表示一组连续数据指针的 UnsafeBufferPointer<T>，表示非完整结构的不透明指针 COpaquePointer 等等。另外你可能已经注意到了，能够确定指向内容的指针类型都是泛型的 struct，我们可以通过这个泛型来对指针指向的类型进行约束以提供一定安全性。

需要具体了解的看这篇：[UnsafePointe<T>](https://onevcat.com/2015/01/swift-pointer/)

顺便吐槽句哈，apple的代码也还有这种东西，也不知道是修改过的没有；
![FIXME](https://upload-images.jianshu.io/upload_images/1429775-225ee3ef5a38e747.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

2. Equatable

* 它是一种可用于值比较的类型；
* 在序列和集合操作中，可以将一个遵循了`Equatable`协议的对象传递给`contaions(_:)`方法，来确定是否包含，用法如下：

```swift
let students = ["Nora", "Fern", "Ryan", "Rainer"]

let nameToCheck = "Ryan"
if students.contains(nameToCheck) {
    print("\(nameToCheck) is signed up!")
} else {
    print("No record of \(nameToCheck).")
}
   // Prints "Ryan is signed up!"

/// Conforming to the Equatable Protocol
```

* 本地类型继承自`Equatable`协议需要注意：
  1. 对于一个`struct`类型，它的所有存储属性都需要遵循`Equatable`协议；
  2. 对于一个`enum`类型，它的所有关联值都需要遵循`Equatable`协议；
  3. 如果上述标准不符合，需要在扩展中实现`==`静态方法；
例如：

```
class StreetAddress {
    let number: String
    let street: String
    let unit: String?
    init(_ number: String, _ street: String, unit: String? = nil) {
        self.number = number
        self.street = street
        self.unit = unit
    }
}

extension StreetAddress: Equatable {
    static func == (lhs: StreetAddress, rhs: StreetAddress) -> Bool {
        return
            lhs.number == rhs.number &&
            lhs.street == rhs.street &&
            lhs.unit == rhs.unit
    }
}

let addresses = [StreetAddress("1490", "Grove Street"),
                 StreetAddress("2119", "Maple Avenue"),
                 StreetAddress("1400", "16th Street")]
let home = StreetAddress("1400", "16th Street")
print(addresses[0] == home)
// Prints "false"
print(addresses.contains(home))
// Prints "true"
```

* 另外我在这个实现里面看到了以前数学课知识的身影：
- `a == a` is always `true` (Reflexivity)   # 自反性
- `a == b` implies `b == a` (Symmetry)  # 对称性
- `a == b` and `b == c` implies `a == c` (Transitivity)  # 传递性
所以我们定义的`==`(两对象相等)完全取决于我们自己实现的静态方法：

```
class IntegerRef: Equatable {
    let value: Int
    init(_ value: Int) {
        self.value = value
    }
    static func == (lhs: IntegerRef, rhs: IntegerRef) -> Bool {
        return lhs.value == rhs.value
    }
}
let a = IntegerRef(100)
let b = IntegerRef(100)
print(a == a, a == b, separator: ", ")
// Prints "true, true"
```

而不相等的定义则完全是，自实现的相等操作取反：

```
extension Equatable {
  /// Returns a Boolean value indicating whether two values are not equal.
  ///
  /// Inequality is the inverse of equality. For any values `a` and `b`, `a != b`
  /// implies that `a == b` is `false`.
  ///
  /// This is the default implementation of the not-equal-to operator (`!=`)
  /// for any type that conforms to `Equatable`.
  ///
  /// - Parameters:
  ///   - lhs: A value to compare.
  ///   - rhs: Another value to compare.
  @inlinable // FIXME(sil-serialize-all)
  @_transparent
  public static func != (lhs: Self, rhs: Self) -> Bool {
    return !(lhs == rhs)
  }
}
```
这个实现是已经定义好的！！!

* `==`与`===`的区别
看一下这两者的区别：

```
public protocol Equatable {
  /// Returns a Boolean value indicating whether two values are equal.
  ///
  /// Equality is the inverse of inequality. For any values `a` and `b`,
  /// `a == b` implies that `a != b` is `false`.
  ///
  /// - Parameters:
  ///   - lhs: A value to compare.
  ///   - rhs: Another value to compare.
  static func == (lhs: Self, rhs: Self) -> Bool
}
```
```
@inlinable // FIXME(sil-serialize-all)
public func === (lhs: AnyObject?, rhs: AnyObject?) -> Bool {
  switch (lhs, rhs) {
  case let (l?, r?):
    return ObjectIdentifier(l) == ObjectIdentifier(r)
  case (nil, nil):
    return true
  default:
    return false
  }
}
```
从以上可以看出，`==`只是由实现好的静态函数决定，而`===`则是可以判断两个对象是否完全相等，这有点像判断两个指针相等一样，同样，我们要注意，如果两个可选对象都是nil，则也是`===`的；

3. 搞清楚两个问题

* UTC 与 GMT
UTC(Coordinated Universal Time)标准时间参照，协调时间时，世界标准时间;
GMT(Greenwich Mean Time)时区，即格林尼治时间，位于本初子午线的标界处时间，世界计算时间和经度的起点，GMT是个时区，等同于世界时，所以GMT = UTC + 0，我们国家所在时间均以北京时间计算，北京位于东八区，所以时区为GMT + 8；

* Locale
 网上找了一圈，最后还是swift源码文档里给出的解释最靠谱：`Locale`封装了有关语言，文化和技术规范和标准的信息。由语言环境封装的信息示例包括，用于数字中小数点分隔符的符号以及格式化日期的方式。区域设置通常用于根据用户的习俗和偏好提供，格式化和解释信息。它们经常与格式化程序一起使用。虽然可以使用很多语言环境，但通常使用与当前用户关联的语言环境。
语言环境跟系统的环境设置有关，会涉及到操作系统语言环境设置，个人理解就是一个国际化的东西。
区域设置中的概念 LANGID & LCID：
![LANGID & LCID](https://upload-images.jianshu.io/upload_images/1429775-04ff650284a51b6c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


