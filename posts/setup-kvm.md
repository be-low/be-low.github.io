---
date: 2019-03-23 15:43:22
title: Setup Kvm
---

## 1. 安装必需的包

```shell
sudo pacman -Syu
sudo pacman -S qemu libvirt dmidecode bridge-utils openbsd-netcat ebtables dnsmasq
```

然后启动 `libvirtd` 服务

```shell
sudo systemctl enable --now libvirtd
```

## 2. 一个问题

```shell
network 'default' is not active
```

那么把他启动就行了

```shell
sudo virsh net-start default
```

自动启动

```shell
sudo virsh net-autostart default
```

**可选的功能:**

### 1. 使用 `Virtio` 进行半虚拟化（Para-virtualization with Virtio）

- 检测核心是否支持 `VIRTIO`

```shell
zgrep VIRTIO /proc/config.gz
```

如果支持的话，所有的选项应该都为 `y` 或者 `m`, 就像这样:

```shell
CONFIG_BLK_MQ_VIRTIO=y
CONFIG_VIRTIO_VSOCKETS=m
CONFIG_VIRTIO_VSOCKETS_COMMON=m
CONFIG_NET_9P_VIRTIO=m
CONFIG_VIRTIO_BLK=m
# CONFIG_VIRTIO_BLK_SCSI is not set
CONFIG_SCSI_VIRTIO=m
CONFIG_VIRTIO_NET=m
CONFIG_CAIF_VIRTIO=m
CONFIG_VIRTIO_CONSOLE=m
CONFIG_HW_RANDOM_VIRTIO=m
CONFIG_DRM_VIRTIO_GPU=m
CONFIG_VIRTIO=m
CONFIG_VIRTIO_MENU=y
CONFIG_VIRTIO_PCI=m
CONFIG_VIRTIO_PCI_LEGACY=y
CONFIG_VIRTIO_BALLOON=m
CONFIG_VIRTIO_INPUT=m
CONFIG_VIRTIO_MMIO=m
CONFIG_VIRTIO_MMIO_CMDLINE_DEVICES=y
CONFIG_RPMSG_VIRTIO=m
CONFIG_CRYPTO_DEV_VIRTIO=m
```

- 检测核心模块 (kernel modules) 是否已加载

```shell
lsmod | grep virtio
```

如果没有输出任何东西的话，表示没有加载这个 `virtio` 这个模块

这样加载模块

```shell
modprobe virtio
```

自动加载，添加到 `/etc/modules-load.d/<module>.conf`, `<module`> 替换为模块的名字

例如:

`/etc/modules-load.d/virtio.conf`

```shell
virtio
virtio-net
virtio-blk
virtio-scsi
virtio-balloon
```

还有一个 `virtio-serial` 会这样

```shell
modprobe: FATAL: Module virtio_serial not found in directory /lib/modules/4.19.75-1-lts
```

### 2. 嵌套虚拟化(Nested virtualization)

检查 `kvm_intel` 是否支持 `nested`

```shell
systool -m kvm_intel -v | grep nested
```

如果输出 `nested = "Y"`, 就是已经开启了,否则需要执行以下命令

```shell
echo "options kvm_intel nested=1" | sudo tee -a /etc/modprobe.d/kvm_intel.conf
sudo modprobe -r kvm_intel
sudo modprobe kvm_intel
```

### 3.  使用 huge pages 改善性能

看了下，最新版的 Arch 是会自动开启的，检查是否有`/dev/hugepages` 这个目录。如果没有的话，需要手动创建并：

- 使 kvm 组拥有 /dev/hugepages 的权限

  （Now we need the right permissions to use this directory. The default
  permission is root's uid and gid with 0755, but we want anyone in the
  kvm group to have access to hugepages.）

  添加到你的 `/etc/fstab`

```shell
hugetlbfs       /dev/hugepages  hugetlbfs       mode=1770,gid=78        0 0
```

这个 `gid` 应该是 `kvm` 组 的 id, 但是我的机器上它是 992, 所以应该用这个？

```shell
hugetlbfs       /dev/hugepages  hugetlbfs       mode=1770,gid=992        0 0
```

- 然后重新挂载 `/dev/hugepages`

```shell
sudo umount /dev/hugepages
sudo mount /dev/hugepages
```

### 4.  使用`libvirt` 的图形化管理工具 `virt-manager`

```shell
sudo pacman -S virt-manager
```

## See also

- [Arch wiki libvirt](https://wiki.archlinux.org/index.php/libvirt)
- [Arch wiki kvm](https://wiki.archlinux.org/index.php/KVM)
- [Arch woki Kernel module](https://wiki.archlinux.org/index.php/Kernel_module)
