---
layout: post
title: read-fbx-file
date: 2019-04-21 13:50:31 +0800
categories: []
---

昨天由于要写一个关于 Direct3D 的东东，这个过程中就碰到关于模型的问题。
虽然这次只用到一些简单的模型，但是我还是想通过加载模型文件的方式。然后的话，由于没有 maya， 3ds max 这样的专业软件，这时我又想起来了 windows 上的 3D查看器。这个东西虽然不是那么专业，但是确实能够从里面的 3D资源库 里找到一些可用的模型。

这时出现第一个困扰我的问题，这个 3D查看器 是可以把模型导出来没错，但是只有 GLTG 这种格式，本来听都没听说过， 一搜索找到了这个 [Geometry formats](https://github.com/Microsoft/DirectXMesh/wiki/Geometry-formats)
发现关于 GLTF 确实有个 Microsoft.glTF.CPP 可以用。 然而这时候我想的是怎么把  GLTF 转成 X File,又找了半天，并没有找到答案。这时候我发现 windows 上的 画图3D 可以打开 GLTF 文件， 并能够导出 [glb,fbx,3mf] 三种格式。一看 fbx 我认识啊，这就开始了这篇文章的主题 read-fbx-file。

到自动桌的官网下了 fbx-sdk 装了，准备跑 sample。 又掉进坑里。

在 VS Commond Prompt 运行

```bat
cmake -G "NMake Makefiles" ..
nmake
```

会报错，无法生成 “C:\Program Files\Autodesk\FBX\FBX SDK\2019.2\lib\\x64\\libfbxsdk-md.lib” 大概这么个意思。
这时候不知道我怎么想的，以为是 VS 版本的问题，毕竟下 sdk 的时候是 `fbx20192_fbxsdk_vs2017_win.exe` 是吧？
赶紧把这 2019 卸了（早就看这货不爽了），装 2017 版（一下，3个小时过去了，（毕竟网速慢））。

//TODO