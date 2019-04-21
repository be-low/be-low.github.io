---
title: sys-probs
date: 2019-04-21 13:50:31
tags: linux,arch
---

自从把 nixos 卸了，用了一段时间的 windows10 后,我又装了 archlinux ![arch](./screen-fetch.png)

记录一下遇到的几个问题。

## 关于 Grub

### 多系统启动项

在以前用过的 ubuntu deepin 之类的发行版中通过执行 `sudo update-grub` 就可以自动扫描并添加其他已经安装的系统的启动项，而这在 arch 上并没有这么简单 。

1. 如果只安装了 grub 和 efibootmgr , 那么 `update-grub` 这个命令并不存在 。实际上 
   
   `# update-grub`  1.1
   
   等同于 
   
   `# grub-mkconfig -o /boot/grub/grub.cfg`  1.2
   
   或者可以 安装 `update-grub` 这个 aur 包

2. 这时你会发现，通过执行 1.1 or 1.2 并不能自动扫描到其他 efi 系统引导文件 ， 通过在 [arch wiki](https://wiki.archlinux.org/) 上搜索 grub ，找到了这里 [GRUB#Detecting_other_operating_systems](https://wiki.archlinux.org/index.php/GRUB#Detecting_other_operating_systems) 。要达到 自动扫描引导文件并添加启动项的目的 ，必须安装 os-prober 这个包，确保存在其他系统引导文件的分区已经挂载, 然后运行 1.1 or 1.2 。或者你也可以自己更改 grub 配置文件 。

### 保存选择的启动项并设为默认

这个很简单,只需要更改 grub 配置文件 `/etc/default/grub`:

```powershell
GRUB_DEFAULT=saved
GRUB_SAVEDEFAULT=true
```

更多选项可以参考 [grub manual](http://www.gnu.org/software/grub/manual/grub/grub.html#Simple-configuration)

> 这么简单的问题描述起来费了好费劲 。

## 关于 emacs

### 中文输入法输入不了内容

需要更改环境变量，可以更改 `~/.xprofile`

```
export LANG=en_US.UTF-8
export LC_CTYPE=zh_CN.UTF-8
```

不过这里我也不懂为什么 LANG 就是 en 而 LC_CTYPE 就是 zh 。不过还好能输入中文了 。

但是输入法的一些符号（`，`,`。`），在刚输入完汉字后打不出来 ，然而再输入一个空格或者其他字符就可以，而且目前就发现只有逗号和句号有这个问题。真是奇怪的问题 。

> 所以你会发现这些段落里面会有一些奇怪的空格 。
