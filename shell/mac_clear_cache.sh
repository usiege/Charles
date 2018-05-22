#!/bin/bash

# 移除系统噪音文件，该系统可以使文字转语音功能，如果你不需要，那么请删除
sudo rm -rf /System/Library/Speech/Voices/*；

# 删除所有系统日志，系统日志文件是用来调试和排除故障
sudo rm -rf /private/var/log/*；

# 删除临时文件;
sudo rm -rf /private/var/tmp/*;

# 手动删除iOS DevelopSupport，只保留自己需要的版本
# sudo rm -rf ~/Library/Developer/Xcode/iOS DeviceSupport/*;

# 删除模拟器文件，运行模拟器会重新生成
# sudo rm -rf ~/Library/Developer/CoreSimulator/Devices/*;

'''
# 删除xcode app编译，定期清理
# sudo rm -rf ~/Library/Developer/Xcode/DerivedData/*;
'''

# 删除缓存
sudo rm -rf ~/Library/Caches/*;
