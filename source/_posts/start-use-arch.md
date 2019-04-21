---
title: start-use-arch
date: 2019-03-22 20:51:03
tags: linux,arch
---

前天 marjaro deepin 崩了 

我靠我怎么打不出来一个符号？(现在可以了)

因为 optimus manager 这个工具让我对驱动显卡有了信心所以就换成了 archlinux

arch 倒是折腾好多次了 但是一直没有正式的使用过 每次到最后总是 nvidia 显卡让整个系统都出故障

> 这句感觉没什么逻辑

但是我又不想放弃双屏 所以还是折腾吧！

optimus manager 这东西完美适配 archlinux，驱动独显只需要几行命令 你值得拥有

安装命令在这里

首先 她是个 aur 的包 那么不能直接 `pacman -S xxx` 需要从 github 上拿下来 然后编译成 pacman 的包 再使用 pacman 安装

但是我这么懒的人，怎么能做这么麻烦的事情。当然是用 yay 了 有了 yay 就可以 `yay -S xxx` 安装任何 aur 的包了

so 可以可以选择手动安装

```shell
git clone https://aur.tuna.tsinghua.edu.cn/optimus-manager.git
cd optimus-manager
makepkg -si
```

或者先来个 yay， 然后再安装

```shell
git clone https://aur.tuna.tsinghua.edu.cn/yay.git
cd yay
makepkg -si
```

`yay -S optimus-manager` 我觉得不用清华的 mirrors 肯定太慢了

所以使用 mirror 的命令是这个 `yay --save --aururl "https://aur.tuna.tsinghua.edu.cn" optimus-manager` --save 参数可以把镜像的配置保存下来，以后就会默认使用镜像了。

这里如果既用镜像 && 使用了全局代理的话，会出现一个奇怪的问题
