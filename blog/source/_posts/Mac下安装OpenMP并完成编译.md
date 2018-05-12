title: Mac下安装OpenMP并完成编译
date: 2018-05-13 00:47:28
categories: coder
tags: [Mac, OpenMP]
---

OpenMP在Mac上的安装，涉及到一些编译器的历史。。。
<!-- more -->

## OpenMP环境添加(Mac)

```bash
$ brew reinstall gcc --without-multilib
# 安装支持openmp的clang
$ brew install clang-omp #有错
```

## 安装错误
```
# Problem: No available formula with the name "clang-omp"

ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" < /dev/null 2> /dev/null
```
[安装错误参考](http://macappstore.org/clang-omp/)，用以上方法发现未解决问题；

> fatal: unable to access 'https://github.com/Homebrew/homebrew-core/': LibreSSL SSL_read: SSL_ERROR_SYSCALL, errno 54
Error: Fetching /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core failed!
Error: Could not link:
/usr/local/share/man/man1/brew.1

> Please delete these paths and run `brew update`.
Error: Could not link:
/usr/local/share/doc/homebrew

```
# 删除  /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core 文件夹

$ brew update
$ brew install clang-omp
```

>fatal: unable to access 'https://github.com/Homebrew/homebrew-core/': LibreSSL SSL_read: SSL_ERROR_SYSCALL, errno 54
Error: Failure while executing: git clone https://github.com/Homebrew/homebrew-core /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core --depth=1
Error: Failure while executing: /usr/local/bin/brew tap homebrew/core

```
brew doctor
```

>Error: No available formula with the name "clang-omp" 
==> Searching for a previously deleted formula (in the last month)...
Warning: homebrew/core is shallow clone. To get complete history run:
  git -C "$(brew --repo homebrew/core)" fetch --unshallow

>Error: No previously deleted formula found.
==> Searching for similarly named formulae...
==> Searching local taps...
Error: No similarly named formulae found.
==> Searching taps...
==> Searching taps on GitHub...
Error: No formulae found in taps.

```
'''
You need a recent version of llvm and libomp which you can get with
'''
$ brew install llvm
# brew install libomp
```

>On Apple Clang, you need to add several options to use OpenMP's front end
instead of the standard driver option. This usually looks like
  -Xpreprocessor -fopenmp -lomp

>You might need to make sure the lib and include directories are discoverable
if /usr/local is not searched:
-L/usr/local/opt/libomp/lib -I/usr/local/opt/libomp/include

> For CMake, the following flags will cause the OpenMP::OpenMP_CXX target to
be set up correctly:
> -DOpenMP_CXX_FLAGS="-Xpreprocessor -fopenmp -I/usr/local/opt/libomp/include" 
-DOpenMP_CXX_LIB_NAMES="omp"
-DOpenMP_omp_LIBRARY=/usr/local/opt/libomp/lib/libomp.dylib

接下来发现libomp已经在我的lib库里了，定位：*/usr/local/opt/libomp*；
下面要做的事情就是终端到你写的.c文件下，输入以下命令编译；
```
clang -Xclang -fopenmp openmp_test.c -I /usr/local/opt/libom/include -L /usr/local/opt/libomp/lib -lomp
```
上面这个命令会链接头文件和动态库，我们想办法把这两个路径添加到环境变量里，每次都写路径很麻烦；

## Compiler

```bash
$ export OMP_NUM_THREADS=4
$ gcc -fopenmp filename.c
```
因为我们要用clang来编译，所以上面的这个编译过程应该写为；

```
$ export OMP_NUM_THREADS=4
$ clang -fopenmp filename.c -o filename

# clang: error: unsupported option '-fopenmp'
```

最终解决方案，Homebrew安装的GCC存放在 /usr/local/bin/gcc-5 中（GCC5.2.0版）。此时，系统中依然有 /usr/bin/gcc ，然而这个GCC是clang的链接。所以在编译时，需要使用类似 gcc-5 xxx.c -o xxx -fopenmp 进行编译，而不是使用默认的gcc。

所以只要我们用下面的编译方法就可以了：
```
$ gcc-6 -fopenmp filename.c -o filename
$ ./filename #执行吧！
```
真的是绕了一圈，原来是llvm 与 gcc的历史问题；

## PS

附1：测试程序

```c
#include <omp.h>
#include <stdio.h>

int main() 
{
	#pragma omp parallel
	printf("Hello from thread %d, nthreads %d\n", omp_get_thread_num(), omp_get_num_threads());
}
```

附2： 继续找发现一个在Xcode上安装clang-omp安装的方法，未测试通过，慎用；

```bash
$ brew install llvm
$ echo 'export PATH="/usr/local/opt/llvm/bin:$PATH"' >> ~/.bash_profile
```
![image_1cdaaol7q1a32nov11t4108hg4vm.png-115.1kB][1]

  [1]: http://static.zybuluo.com/usiege/voi9cducaj6qxf9gyj22j7o5/image_1cdaaol7q1a32nov11t4108hg4vm.png
 