---
date: 2019-03-22 20:51:03
title: ArchLinux's nvidia intel graphics cards
tags: ['linux']
---

## 附加：

现在似乎不用 optimus-manager 也可以，如果直接安装 nvidia 和 gnome 的话，猜测是 gnome 对 xorg.conf 进行了配置？而且在 Wayland 下也能正常工作，但是需要安装整个 gnome group。

记得上次没有装全，X11 一直启动失败，然后装了 `optimus-manager` 

 参考 `optimus-manager` 在 github 上的 wiki：

- 改成  Xorg 模式， 因为据说 Wayland 不支持？

- 把 gdm 换成一个打了补丁的 `gdm-prime` Aur 包， 才得以正常使用 gnome (真是麻烦啊…

## 起因：

 marjaro deepin 崩了

因为 `optimus-manager` 这个工具让我对驱动显卡有了信心所以就换成了 archlinux

arch 折腾好多次了 但是每次到最后总是 nvidia 驱动不了，但是我又不想放弃双屏 …

## Procedure:

首先需要先有 `nvidia` 的驱动

```shell
sudo pacman -Sy
sudo pacman -S nvidia
```

安装 optimus-manager.git Aur 包

```shell
git clone https://aur.tuna.tsinghua.edu.cn/optimus-manager.git
cd optimus-manager
makepkg -si
```

或者使用 yay

```shell
git clone https://aur.tuna.tsinghua.edu.cn/yay.git
cd yay
makepkg -si
```

```shell
yay -S optimus-manager
```

使用 tuna 的 aur 镜像

```shell
yay --save --aururl "https://aur.tuna.tsinghua.edu.cn" optimus-manager
```

--save 参数可以把镜像的配置保存下来，以后就会默认使用镜像了。

yay如果在用镜像的同时使用了全局代理的话，会出现奇怪的网络问题，把代理暂时关掉就好了。

然后开启 `optimus-manager` 的服务

```shell
sudo systemctl enable --now optimus-manager
```

设置 mode

```shell
optimus-manager --set-startup nvidia
```

重启
