#!/bin/bash -l
export LANG=en_US.UTF-8
export LANGUAGE=en_US.UTF-8
export LC_ALL=en_US.UTF-8

pod install --verbose --no-repo-update
open LeWaiJiao.xcworkspace

project_path="/Users/user/.jenkins/workspace/LeWaiJiao"

#指定项目地址
workspace_path="$project_path/LeWaiJiao.xcworkspace"

#取当前时间字符串添加到文件夹结尾
now=$(date +"%Y_%m_%d_%H_%M_%S")

#指定项目的scheme名称
scheme="LeWaiJiao"
#指定要打包的配置名
configuration="Release"
#指定打包所使用的输出方式，目前支持app-store, package, ad-hoc, enterprise, development, 和developer-id，即xcodebuild的method参数
export_method='enterprise'


#指定输出路径
output_path="$project_path/build/LeWaiJiao${now}"
#指定输出归档文件地址
archive_path="$output_path/LeWaiJiao.xcarchive"
#指定输出ipa名称
ipa_name="LeWaiJiao_${now}.ipa"
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
# gym --workspace ${workspace_path} --scheme ${scheme} 
# --clean --configuration ${configuration} 
# --include_bitcode n --archive_path ${archive_path} 
# --export_method ${export_method} --output_directory ${output_path} --output_name ${ipa_name}
#上一句命令导出ipa失败，无法配置导出参数
xcodebuild clean -workspace ${workspace_path} -scheme ${scheme} -configuration ${configuration}
xcodebuild archive -workspace ${workspace_path} -scheme ${scheme} -archivePath ${archive_path}
xcodebuild -exportArchive -archivePath ${archive_path} 
-exportPath ${output_path} 
-exportOptionsPlist ${export_plist_path} -allowProvisioningUpdates




