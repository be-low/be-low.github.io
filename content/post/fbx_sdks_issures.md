---
categories: []
date: "2019-06-05T13:50:31Z"
title: 使用 FBX SDK 碰到的问题
---

昨天由于要写一个关于 Direct3D 的东东，这个过程中就碰到关于模型的问题。
虽然这次只用到一些简单的模型，但是我还是想通过加载模型文件的方式。然后的话，由于没有 maya， 3ds max 这样的专业软件，这时我又想起来了 windows 上的 3D查看器。这个东西虽然不是那么专业，但是确实能够从里面的 3D资源库 里找到一些可用的模型。

这时出现第一个困扰我的问题，这个 3D查看器 是可以把模型导出来没错，但是只有 GLTG 这种格式，本来听都没听说过， 一搜索找到了这个 [Geometry formats](https://github.com/Microsoft/DirectXMesh/wiki/Geometry-formats)
发现关于 GLTF 确实有个 Microsoft.glTF.CPP 可以用。 然而这时候我想的是怎么把  GLTF 转成 X File,又找了半天，并没有找到答案。这时候我发现 windows 上的 画图3D 可以打开 GLTF 文件， 并能够导出 [glb,fbx,3mf] 三种格式。一看 fbx 我认识啊，这就开始了这篇文章的主题 read-fbx-file。

到自动桌的官网下了 fbx-sdk 装了，准备跑 sample。 又掉进坑里。

在 VS Commond Prompt 运行

```shell
cmake -G "NMake Makefiles" ..
nmake
```

会报错：

> 无法生成 “C:\Program Files\Autodesk\FBX\FBXSDK\2019.2\lib\\\x64\\libfbxsdk-md.lib”

 大概这么个意思。这时候不知道我怎么想的，以为是 VS 版本的问题，毕竟下 sdk 的时候是 `fbx20192_fbxsdk_vs2017_win.exe` 是吧？
赶紧把这 2019 卸了（早就看这货不爽了），装 2017 版（一下，3个小时过去了，（毕竟网速慢））。

过去22小时又接着写。

装了 2017 后才正式开始解决问题。因为报错和上面一样的。(我想简写了，复现这个过程的代价也太高了)

1. 我找到上面所说的那个文件 它的真实路径应该是 

    > "C:\Program Files\Autodesk\FBX\FBX SDK\2019.2\lib\vs2017\x64\debug\libfbxsdk-md.lib"

    而 log 中是

    > “C:\Program Files\Autodesk\FBX\FBXSDK\2019.2\lib\\\x64\\\libfbxsdk-md.lib”

    会发现缺少了 "vs2017" 和 “debug” 而它们的位置是由于空而留下这个 “\\\”

2. 从 "CMakeLists.txt" 中发现它 `INCLUDE("../CMakeSettings.txt")` 进而跟踪到 

    > "C:\Program Files\Autodesk\FBX\FBX SDK\2019.2\samples\CMakeSettings.txt"

    在这里，找到这么一段 CMake 代码

    ```cmake
    IF(MSVC_VERSION EQUAL 1700)
        SET(FBX_COMPILER "vs2012")
    ELSEIF(MSVC_VERSION EQUAL 1800)
        SET(FBX_COMPILER "vs2013")
    ELSEIF(MSVC_VERSION EQUAL 1900)
        SET(FBX_COMPILER "vs2015")
    ELSEIF(MSVC_VERSION EQUAL 1911)
        SET(FBX_COMPILER "vs2017")
    ENDIF()
    ```

    然后获取我的这个 VS 的 MSVC_VERSION， 是 1916 (好像是吧)
    还在 CMake 的文档里找到了这个

    > MSVC_VERSION
    >
    > The version of Microsoft Visual C/C++ being used if any. If a compiler >simulating Visual C++ is being used, this variable is set to the toolset >version simulated as given by the _MSC_VER preprocessor definition.
    >
    > Known version numbers are:
    >
    > 1200      = VS  6.0
    > 1300      = VS  7.0
    > 1310      = VS  7.1
    > 1400      = VS  8.0 (v80 toolset)
    > 1500      = VS  9.0 (v90 toolset)
    > 1600      = VS 10.0 (v100 toolset)
    > 1700      = VS 11.0 (v110 toolset)
    > 1800      = VS 12.0 (v120 toolset)
    > 1900      = VS 14.0 (v140 toolset)
    > 1910-1919 = VS 15.0 (v141 toolset)

    所以改成了这样

    ```cmake
    IF(MSVC_VERSION EQUAL 1700)
        SET(FBX_COMPILER "vs2012")
    ELSEIF(MSVC_VERSION EQUAL 1800)
        SET(FBX_COMPILER "vs2013")
    ELSEIF(MSVC_VERSION EQUAL 1900)
        SET(FBX_COMPILER "vs2015")
    ELSEIF((MSVC_VERSION GREATER 1909) AND (MSVC_VERSION LESS 1920))
        SET(FBX_COMPILER "vs2017")
    ENDIF()
    ```

    这样就解决了第一个 "vs2017" 没有被插入到路径的问题 然而还有第二个 “debug”， 其实它也可以是 “release”
    这个的话定位到了这

    ```cmake
    SET(FBX_VARIANT "$(Configuration)")
    ```
    
    我把 Configuration 打印出来的话什么都没有。于是改成了这样

    ```cmake
    IF("${Configuration}" STREQUAL "")
        SET(FBX_VARIANT "debug")
    ELSE()
        SET(FBX_VARIANT "$(Configuration)")
    ENDIF()
    ```

    

所以说，为什么 Autodesk 的一个 SDK bug 这么多。
不过我直接卸 VS2019 的行为确实也没什么道理，要是发现了 log 的路径里多了两个 "\\" 的话，就能更快的解决问题了。

