---
title: install-kvm
date: 2019-03-23 15:43:22
tags:
---
# 首先我看了下 arch 的 [kvm wiki](https://wiki.archlinux.org/index.php/KVM)，执行了以下步骤

## 1. 开启嵌套虚拟化

### 检测该特性是否开启

  执行 `systool -m kvm_intel -v | grep nested`，如果输出 "nested = "Y"", 就是已经开启了
  否则需要执行以下命令

```shell
sudsystool -m kvm_intel -v | grep nestedo echo "options kvm_intel nested=1" > /etc/modprobe.d/kvm_intel.conf
modprobe -r kvm_intel
modprobe kvm_intel
```

## 2. 开启 huge pages （这是翻译成【巨/大】页？感觉怪怪的）

- 使 kvm 组拥有 /dev/hugepages 的权限，添加下面这行到 /etc/fstab

`hugetlbfs       /dev/hugepages  hugetlbfs       mode=1770,gid=78        0 0`

然后重新挂载 /dev/hugepages

```shell
umount /dev/hugepages
mount /dev/hugepages
```

## 3. 上面好像作了一番无用工，其实只用执行这一步就好了

- install required pkg
```shell
sudo pacman -Syy
sudo pacman -S qemu libvirt virt-manager
```
- enable libvirt service
```shell
sudo systemctl enable libvirtd
sudo systemctl start libvirtd
```

> now 应该可以用 virt-manager 创建虚拟机了
> 以后用 english 算了 中英文切换好麻烦，而且半角符号全角符号混搭也不美

## 4. 然后在我创建虚拟机的时候碰到了一些问题，找到了 [libvirt](https://wiki.archlinux.org/index.php/libvirt)

她会在创建网络连接时报错，需要安装一些包

`sudo pacman - S bridge-utils openbsd-netcat ebtables dnsmasq`

然后重启 libvirtd 服务

`sudo systemctl restart libvirtd`

> 接下来应该正常了

