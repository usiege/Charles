title: git checkout 与 reset
date: 2017-08-18 17:34:00
categories: coder
tags: [git]
-----------


公司最近的一次App提交过程中遇到的一些问题，现贴在这里，有检索到本篇的朋友们可借鉴。

首先是上传到iTunes Connect构建版本，点击以下蓝色按钮，之后会有苹果为你的代码进行检查：

![image_1bu7k3nt22m3cmearq636qua9.png-14.8kB][1]

本人在ios11上做了提交，发现问题进行分类：
1. 第一个是第三方库存在x86_64,i386的链接库，有以下问题：

```
iTunes Store Operation Failed
ERROR ITMS-90087: "Unsupported Architectures. The executable for LeWaiJiao.app/Frameworks/GCDWebServers.framework contains unsupported architectures '[x86_64, i386]'."
```

PS:以下所有翻译来源于欧路词典，粘贴过来的，仅供参考；
```
iTunes Store Operation Failed
ERROR ITMS-90209: "Invalid Segment Alignment. The app binary at 'LeWaiJiao.app/Frameworks/GCDWebServers.framework/GCDWebServers' does not have proper segment alignment. Try rebuilding the app with the latest Xcode version."
无效段对齐。应用程序二进制的“lewaijiao。应用程序/框架/ gcdwebservers。框架/ gcdwebservers”没有正确对齐。尝试用新的Xcode版本重建应用程序。
```

```
iTunes Store Operation Failed
ERROR ITMS-90125: "The binary is invalid. The encryption info in the LC_ENCRYPTION_INFO load command is either missing or invalid, or the binary is already encrypted. This binary does not seem to have been built with Apple's linker."
“二进制无效。在lc_encryption_info负荷指令加密信息丢失或无效，或是已经加密的二进制。这个二进制文件似乎没有用苹果的链接器构建。”
```
```
iTunes Store Operation Failed
WARNING ITMS-90080: "The executable 'Payload/LeWaiJiao.app/Frameworks/GCDWebServers.framework' is not a Position Independent Executable. Please ensure that your build settings are configured to create PIE executables. For more information refer to Technical Q&A QA1788 - Building a Position Independent Executable in the iOS Developer Library."
“可执行的有效载荷/ lewaijiao。应用程序/框架/ gcdwebservers。框架”不是一个独立的可执行文件的位置。请确保您的构建设置配置为创建饼可执行文件。更多信息请参阅技术问答qa1788在iOS开发者库位置独立的可执行的建筑。”
```

```
ERROR ITMS-90362: "Invalid Info.plist value. The value for the key 'MinimumOSVersion' in bundle ***.app/Frameworks/SDK.framework is invalid. The minimum value is 8.0"
```
后面这个**90362**貌似是连带问题，定位的时候发现与最小版本无关，所以一同被解决了；

解决方法呢是在该工程里添加脚本处理这些被添加进来的第三方库，如下：
![image_1bu7kmq06140t1nmhkf11sfq1civm.png-235.5kB][2]
```
APP_PATH="${TARGET_BUILD_DIR}/${WRAPPER_NAME}"

# This script loops through the frameworks embedded in the application and
# removes unused architectures.
find "$APP_PATH" -name '*.framework' -type d | while read -r FRAMEWORK
do
FRAMEWORK_EXECUTABLE_NAME=$(defaults read "$FRAMEWORK/Info.plist" CFBundleExecutable)
FRAMEWORK_EXECUTABLE_PATH="$FRAMEWORK/$FRAMEWORK_EXECUTABLE_NAME"
echo "Executable is $FRAMEWORK_EXECUTABLE_PATH"

EXTRACTED_ARCHS=()

for ARCH in $ARCHS
do
echo "Extracting $ARCH from $FRAMEWORK_EXECUTABLE_NAME"
lipo -extract "$ARCH" "$FRAMEWORK_EXECUTABLE_PATH" -o "$FRAMEWORK_EXECUTABLE_PATH-$ARCH"
EXTRACTED_ARCHS+=("$FRAMEWORK_EXECUTABLE_PATH-$ARCH")
done

echo "Merging extracted architectures: ${ARCHS}"
lipo -o "$FRAMEWORK_EXECUTABLE_PATH-merged" -create "${EXTRACTED_ARCHS[@]}"
rm "${EXTRACTED_ARCHS[@]}"

echo "Replacing original executable with thinned version"
rm "$FRAMEWORK_EXECUTABLE_PATH"
mv "$FRAMEWORK_EXECUTABLE_PATH-merged" "$FRAMEWORK_EXECUTABLE_PATH"
done
```
以上代码来源于Google，解决方法经确认iOS11 + Xcode9.0有效；

2. 项目有icon不合规定的错误
```
iTunes Store Operation Failed
ERROR ITMS-90717: "Invalid App Store Icon. The App Store Icon in the asset catalog in 'LeWaiJiao.app' can't be transparent nor contain an alpha channel."
无效应用程序商店图标。在资产目录中的lewaijiao App Store图标，应用程序不能透明也包含alpha通道。”
```
该错误原因是上传的icon不符合苹果规定，公司项目存在的问题是1.使用了圆角；2.有透明alpha通道；
解决方法自然容易了，找设计重新做，自己解决的话第二个可以DIY，如下：

![image_1bu7l6vhrvhm51b13pjvrlc0p13.png-100.4kB][3]

用系统预览打开icon图片，点掉Alpha的勾，再保存就可以了；
![image_1bu7l8bt61p6v1mp11csi15ri1dmg1g.png-128.6kB][4]

3. 提交上传结束后又出现了一个问题

```
App Installation failed, No code signature found.
```
真机无法运行了！这个问题纯属偶然，所以继续解决；打开终端，输入

```
sudo chmod -R 777 /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS.sdk 
```

修改文件权限，然后修改字段属性，打开：

**/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS.sdk/SDKSettings.plist**

，修改 **CODE_SIGNING_REQUIRED** 字段为 **YES** ，保存；



  [1]: http://static.zybuluo.com/usiege/n72bt0t4wwh45zw5c0kjcv01/image_1bu7k3nt22m3cmearq636qua9.png
  [2]: http://static.zybuluo.com/usiege/mqh6ttzi6hsixpddv5nmcu03/image_1bu7kmq06140t1nmhkf11sfq1civm.png
  [3]: http://static.zybuluo.com/usiege/xtde6py269a5m4iusbumms4p/image_1bu7l6vhrvhm51b13pjvrlc0p13.png
  [4]: http://static.zybuluo.com/usiege/yql5tndy4d612fhqfsi9n4l2/image_1bu7l8bt61p6v1mp11csi15ri1dmg1g.png