---
title: install-kvm
date: 2019-03-23 15:43:22
tags:
---
# 首先我看了下 arch 的 [kvm wiki](https://wiki.archlinux.org/index.php/KVM)，执行了以下步骤

## Optional 1. 开启嵌套虚拟化

### 检测该特性是否开启

  执行 `systool -m kvm_intel -v | grep nested`，如果输出 "nested = "Y"", 就是已经开启了
  否则需要执行以下命令

```shell
sudsystool -m kvm_intel -v | grep nestedo echo "options kvm_intel nested=1" > /etc/modprobe.d/kvm_intel.conf
modprobe -r kvm_intel
modprobe kvm_intel
```

## Optional 2. 开启 huge pages （这是翻译成【巨/大】页？感觉怪怪的）

- 使 kvm 组拥有 /dev/hugepages 的权限，添加下面这行到 /etc/fstab

`hugetlbfs       /dev/hugepages  hugetlbfs       mode=1770,gid=78        0 0`

然后重新挂载 /dev/hugepages

```shell
umount /dev/hugepages
mount /dev/hugepages
```

## Real 1. 安装一些包

```shell
sudo pacman -Syy
sudo pacman -S qemu libvirt virt-manager
```

## Real 2. 启动服务

```shell
sudo systemctl enable libvirtd
sudo systemctl start libvirtd
```

> 现在应该可以用 virt-manager 创建虚拟机了

## Real 3. 此时本以为万事大吉了, 但是还会在创建网络连接时报错，可以看这个 wiki [libvirt](https://wiki.archlinux.org/index.php/libvirt)

`sudo pacman - S bridge-utils openbsd-netcat ebtables dnsmasq`

然后重启 libvirtd 服务

`sudo systemctl restart libvirtd`

## Real 4. 重启后又出现了一个问题 `network 'default' is not active`

`sudo virsh net-start default`

也可以自动启动

`sudo virsh net-autostart default`
