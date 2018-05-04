title: Jenkins 构建之脚本篇
date: 2017-12-12 20:53:00
categories: coder
tags: [jenkins]
-----------


之前一直纠结Xcode 9之后用Jenkins导出.ipa文件失败，后经朋友指点终于成功，在此结出终级解决之法；

大致思路是这样的：Jenkins在网页中的配置大多会在之后进行整理，最终在终端生成shell脚本，然后每完成一项就会在构建结果中显示成功，如有一步错，则整个构建过程将会失败，所以这就解释了之前构建一直卡在了Achiver成功之后。

基于上面的思路，则弃用之前的Jenkins配置，取消Jenkins项目中构建过程，Xcode配置全部清空，使用脚本配置，以下我会具体贴出，并适当讲解：

```
#!/bin/bash -l
export LANG=en_US.UTF-8
export LANGUAGE=en_US.UTF-8
export LC_ALL=en_US.UTF-8

#以下PROJECT_NAME为项目工程名称
pod install --verbose --no-repo-update
open PROJECT_NAME.xcworkspace

#以下USER_NAME为用户名
project_path="/Users/USER_NAME/.jenkins/workspace/PROJECT_NAME"

#指定项目地址
workspace_path="$project_path/PROJECT_NAME.xcworkspace"

#取当前时间字符串添加到文件夹结尾
now=$(date +"%Y_%m_%d_%H_%M_%S")

#指定项目的scheme名称
scheme="PROJECT_NAME"
#指定要打包的配置名
configuration="Release"
#指定打包所使用的输出方式，目前支持app-store, package, ad-hoc, enterprise, development, 和developer-id，即xcodebuild的method参数
export_method='enterprise'


#指定输出路径
output_path="$project_path/build/PROJECT_NAME{now}"
#指定输出归档文件地址
archive_path="$output_path/PROJECT_NAME.xcarchive"
#指定输出ipa名称
ipa_name="PROJECT_NAME{now}.ipa"

#指定输出ipa地址
ipa_path="$output_path/${ipa_name}"
#指定打包配置
export_plist_path="$project_path/ExportOptions.plist"
#获取执行命令时的commit message
#commit_msg="$(cat $project_path/build_log.txt)"

#输出设定的变量值
echo "===workspace path: ${workspace_path}==="
echo "===archive path: ${archive_path}==="
echo "===ipa path: ${ipa_path}==="
echo "===export method: ${export_method}==="
#echo "===commit msg: ${commit_msg}==="

#先清空前一次build
xcodebuild clean -workspace ${workspace_path} -scheme ${scheme} -configuration ${configuration}

#归档
xcodebuild archive -workspace ${workspace_path} -scheme ${scheme} -archivePath ${archive_path}

#导出
xcodebuild -exportArchive -archivePath ${archive_path} -exportPath ${output_path} -exportOptionsPlist ${export_plist_path}
```

依此上秘法，会获得Xcode 9下构建成功之案例，.ipa文件也会导出，至于之后上传到平台上，请到各平台下自行找文档整理，不做赘述。

今天新年，祝大家新年快乐，2018，代码不出bug，新技术很快上手，妹子泡到手软，工资涨的飞快，人生乐的飞起！！！

