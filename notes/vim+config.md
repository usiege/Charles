# Mac VIM环境配置全过程

[TOC]

## vim-plug

安装：

`$ curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim`

使用：

打开`~/.vim`，在顶部添加如下代码，代码的中间部分是我们所要用到的插件：

```shell
call plug#begin('~/.vim/plugged')
Plug 'itchyny/lightline.vim'
call plug#end()
```

在 vim 配置文件中添加上面的行后，通过输入以下命令重新加载：

`:source ~/.vimrc`

或者，只需重新加载 Vim 编辑器。

现在，打开 vim 编辑器：

`$ vim`

使用以下命令检查状态：

`:PlugStatus`

然后输入下面的命令，然后按回车键安装之前在配置文件中声明的插件。

`:PlugInstall`

要更新插件，请运行：

`:PlugUpdate`

有时，更新的插件可能有新的 bug 或无法正常工作。要解决这个问题，你可以简单地回滚有问题的插件。输入 `:PlugDiff` 命令，然后按回车键查看上次 `:PlugUpdate`的更改，并在每个段落上按 `X` 将每个插件回滚到更新前的前一个状态。

删除一个插件删除或注释掉你以前在你的 vim 配置文件中添加的 `plug` 命令。然后，运行 `:source ~/.vimrc` 或重启 Vim 编辑器。最后，运行以下命令卸载插件：`:PlugClean`



## vimtex

use vim-plug:

```powershell
Plug 'lervag/vimtex'
```



## ultisnips

为vim添加snippets:

```shell
" vim-plug配置插件方式
" supertab用来防止使用tab展开snippet与youcompleteme的tab补全发生冲突
Plug 'ervandew/supertab'
" ultisnips是引擎
Plug 'SirVer/ultisnips'
" 所有常用snippet都在vim-snippets里
Plug 'honza/vim-snippets'
```

插件设置：

```shell
" make YCM compatible with UltiSnips (using supertab)
let g:ycm_key_list_select_completion = ['<C-n>', '<Down>']
let g:ycm_key_list_previous_completion = ['<C-p>', '<Up>']
let g:SuperTabDefaultCompletionType = '<C-n>'

let g:UltiSnipsSnippetDirectories = ['~/.vim/UltiSnips', 'UltiSnips']

" better key bindings for UltiSnipsExpandTrigger
let g:UltiSnipsExpandTrigger="<c-e>"
let g:UltiSnipsJumpForwardTrigger="<c-j>"
let g:UltiSnipsJumpBackwardTrigger="<c-k>"

let g:UltiSnipsEditSplit="vertical"
```

将写好的`.snippets`文件放到上面写好的路径下：`~/.vim/bundle/UltiSnips/markdown.snippets`

上面这个按键冲突的问题还需要再搞一下，网上找的，实验不通过；



## PS: Sublime + snippets

xml文件，添加方式在tools->developer->new;

具体添加语法请自行解决；