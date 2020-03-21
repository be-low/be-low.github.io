---
date: "2020-03-13T00:00:00Z"
title: C.G.magic
---

# Computer Graphics' s Magic

 本来还有计算机网络和机器视觉的一些事情要做，但是我很抗拒，游戏也不好玩了（或者没什么心情玩），所以来学习计算机图形学的魔法？（其实是填一个坑）

我的魔法之路就决定从[这里](https://github.com/ssloy/tinyrenderer/wiki/Lesson-0-getting-started)开始了。

一个小问题，生成的 tga 格式的图片，kde的默认图片查看器根本不支持，Clion 里也打不开，不过可以用 gimp 打开（虽然怪怪的）。

## 第一步，画直线

突然想起来我并不说没有学过这啊，当时还是用的 windows gdi， 在窗口绘制。现在已经忘得差不多了，而且我也没怎么听讲（上课无聊到想睡觉），老师也不可爱，反正总是有理由喏。那么就当没学过好了。

看完了 `Bresenham’s Line Drawing Algorithm` 但我还是不是很懂。而且还很累。也许它更适合作为一个参考吧，照着来还是不合适，也不方便，所以我决定按自己的想法来。

不如它为了不依赖任何库而选择 tga 格式，我就不太认同。因为太不通用，所以我决定用 `libpng` 用 Clion 作为 IDE，这样就能直接在 IDE 里查看输出的文件了。

说实话，在浏览器里看这种 txt 文档，体验极差，而且 firefox 的阅读模式也不能开。所以其实更推荐用 `man libpng` 的方式，在终端模拟器里看。

这文档也太长了吧，懒得看了()。咱明明只是想知道怎么 new 一个 X*Y 大小的画布，然后知道怎么在 (x,y) 点设置某个颜色值，然后怎么保存它为一个 png 格式的文件而已啊。不知道怎么搜索到了 `Beyond Linux® From Scratch (System V Edition)` 想起来这也是我以前挖的大坑。不对，以前那个是 LFS 这是 BLFS，嗯，更大的坑。大意就是教你怎么构建自己的 linux 发行版，完全自定义的 linux。不过也不能完全随心所欲，因为软件之间总有各种依赖，感觉是很麻烦的事情。

又忘了 cmake 是怎么链接没有提供 `.cmake` 文件的库了，不过至少记得是用的 `.pc`。比上次更快的找到了方法。咱需要先 `find_package(PkgConfig)` 然后用 `pkg_check_modules()` 或者 `pkg_search_module`。像这样：

```cmake
find_package(PkgConfig REQUIRED)
pkg_check_modules(PNG REQUIRED libpng)
target_link_libraries(tinyrenderer
        ${PNG_LIBRARIES}
)
```
然后, `pkg_check_modules` 和 `pkg_search_module` 有一点不同，首先它们都可以同时查找多个库，比如 

```cmake
pkg_check_modules (FOO glib-2.0>=2.10 gtk+-2.0)
```

Looks for both glib2-2.0 (at least version 2.10) and any version of gtk2+-2.0. Only if both are found will FOO be considered found. The FOO_glib-2.0_VERSION and FOO_gtk+-2.0_VERSION variables will be set to their respective found module versions.

`pkg_search_module`

The behavior of this command is the same as pkg_check_modules(), except that rather than checking for all the specified modules, it searches for just the first successful match.

懒得写了，这就是文档里复制过来的。

wsl，这库真劝退。基本上就把 png 的底层都暴露出来了，用它的时候，你看到的 png 而不是 image。很烦的。
决定用叶大的 svpng。

测试图:

![svpng test picture](https://raw.githubusercontent.com/iovw/image-storage/master/svpng-out.webp)

终于到了画直线的时候了(悲。

还是困难重重，很多抽象都还没有，比如点，颜色，Matrix, 算了都写一遍好了。

我 C++ 好菜啊，用 C++ 时就很多问题。比如用 `template<typename T>` 时，我应该怎么调用 T 的方法，应该把它强制转换成某个类型吗？我怎么对 T 进行限制，比如让它只能为某个类的子类(或者实现了某接口？，好吧，好像 C++ 没有接口)。

可怕的是我还不知道该搜索什么关键词？也许这就是菜吧。只记得一个 `C++模板元编程` 的概念，如果组合 C++ 和模板的话。找到一个叫 `type_trait` 的东西，应该可以做这些检测，但是没有 `extend` 或者 `implement`. 

> 这篇记录应该可以帮我记住这个状态吧，因为要递归调用了，先把状态保存起来，才不会 `StackOverflow`.


很烦，所以我想放弃写 C++ 的矩阵库了，而且我的库感觉很难用。我这 Matrix 终于可以用了，可以用于画线了，虽然写得挺糟糕的。

![first line](https://raw.githubusercontent.com/iovw/image-storage/master/first-line.webp)

突然想到我为什么不用 SMID？因为我记得在 DirectX 里 float4 向量，4X4 矩阵什么的都是用的 SMID，然后就找到了乌得勒支大学的高级图形学 Lecture，感觉是个很不错的路标。也许我会用 `std::experimental::simd` 来做这个。反正是魔法，用实验性特性更好？看了半天才发现我要手动从 github 上下载下来，然后用 `Install.sh` 安装.

然后的话，它的信息也太少了，官方的文档都不全。当然现在我的问题是怎么吧 `simd_native<float>` 类型的数据进行类型转换。看得我心态有点崩，放弃 `std::simd` 了，暂时也放弃使用 SIMD。

这代码还是写成了我讨厌的样子,不过至少落错有致？

```cpp
void line(int32_t x0, int32_t y0, int32_t x1, int32_t y1, Mat &m, const RGB &c) {
  int32_t xx = x1 - x0,
	  yy = y1 - y0;
  if (std::abs(xx) >= std::abs(yy)) {
	if (x0 > x1) {
	  std::swap(x0, x1);
	}
	float dy = static_cast<float>(yy) / static_cast<float>(std::abs(xx)),
		y = y0;
	for (float x = x0; x < x1;) {
	  m.setColor(x, y, c);
	  y += dy;
	  x++;
	}
  } else {
	if (y0 > y1) {
	  std::swap(y0, y1);
	}
	float dx = static_cast<float>(xx) / static_cast<float>(std::abs(yy)),
		x = x0;
	for (float y = y0; y < y1;) {
	  m.setColor(x, y, c);
	  x += dx;
	  y++;
	}
  }
}
```

为啥和那个版本差了好多，我不懂。这才是我学的那个版本。找到了以前收藏的 cs184, 看到还有视频，本来还挺高兴的，没想到有限制，我看不到。不过好歹看哪几本书，多少页的信息可以作参考, 然后还有他们的项目作业的 Skeleton。就发现他们的第一个作业也不是画直线这种，用的 OpenGL 写一个 SVG 的光栅化器。那我学的图形学是啥？反正和这个 Tiny Renderer 挺像的，从用描点画线开始，然后画三角形，画网格，忘了，最后画的茶壶，用 MFC 的 Timer 搞了个简单的动画。但是我都没学到，走了个过场。（记录中夹杂回忆和跑题？）

大体上看懂了 [ssloy 的代码](https://github.com/ssloy/tinyrenderer/wiki/Lesson-1-Bresenham%E2%80%99s-Line-Drawing-Algorithm),但是他做的这些所谓的优化都没有说是为什么要这么做?

> 之前用 Typora 打的一些字不见了?

1-3 是从错误的实现到正确的实现,4-5 是优化.

对这些优化的我的理解,

- 4 用加法替换了循环内的乘法, 提高了几倍的性能. (2.95s -> 0.93s)
- 5 用 trick 替换了几个循环里的类型转换. (0.93s -> 0.64s)

第二次写着已经之前的语气了,只有从记忆里掏出来的一些干巴巴的文字.

用所给的 `model.h` `model.cpp` 渲染人头时,有点小问题, `msvc` 总是报错 `vector` 访问越界, 但由于对 VS 的不熟悉导致浪费了不少的时间. 用 `msvc`  写 C++ 时, 应该经常会遇到这种断言失败的异常, 但我觉得其实它能帮你提早发现代码的 bug, 而且 debug 也很简单(怎么我之前没发现). 它这里说明得很清楚

> Press Retry to debug the application

重试之后可以知道中断到断言的那句代码, 然后根据调用栈找到出错的源头.

我发现它这个 model 解析和我这里的 Matrix 有不一致的地方,它的 Index 是从 1 开始, 而我的 Matrix 是从 0 开始, 所以... 所以还是我的 Matrix 说了算(谁让你学 `Matlab` 那一套了!).

不对, 这个 Retry to debug 的功能只有 Debug 模式 (`F5`) 有效, 而 Start Without Debugging (`Crtl+F5`) 并没有效果.

前面的 model 解析我根本没说到点上,其实是因为坐标转换的问题, 我改成这样就没问题了

```cpp
int x0 = (v0.X + 1.) / 2. * (w - 1);
int y0 = (v0.Y + 1.) / 2. * (h - 1);
int x1 = (v1.X + 1.) / 2. * (w - 1);
int y1 = (v1.Y + 1.) / 2. * (h - 1);
```

obj 文件里的顶点坐标是 [-1,1] 的浮点数,而我需要转换成 [0,w) or [0,h) 的整数. 但是原版,它的范围是 [0, {w,h}].

渲染?的 4096x4096 的 png 图片足有 48MB, 有些三角形没有闭合,而且是倒着的(总之很多问题).我放一个 512x512 的

[关联代码](https://github.com/iovw/tiny-renderer/tree/5f816afb50acbb77cf0c7249d830b70119c3d689) 

![african-head-512x512](https://raw.githubusercontent.com/iovw/image-storage/master/african-head-512x512.webp)

他的上下翻转操作是在写文件前才做的, 我一番操作还是没有成功,只好看下他的代码了.

这里又遇到了奇怪的问题,我还挺疑惑 Debug 是 -1024 怎么传到函数里就成了 一个很大的数呢?原来这个函数的参数类似是 `template <class T>` 而 -1024 是 -(1024: u32), 所以这就是隐式类型转换的坑喽~

成功翻转了,但是还是有这些汗毛一样的线条.好像是我的 `Line()` 的问题. 好难啊!

把 `Line()` 改成了印象中 ssloy 的样子,一样的 steep, 但是 steep 有处写错了,发了不少时间才发现. @[Repo](https://github.com/iovw/tiny-renderer/tree/f8c0d4863745883e05398b3dfb60b15e918134d2)

 正确的人头:

![true head](https://raw.githubusercontent.com/iovw/image-storage/master/african-head-1024-true.webp)

待续...

Links

- [PNG The Definitive Guide](http://www.libpng.org/pub/png/book/)
- [Linux® From Scratch](http://www.linuxfromscratch.org/)
- [svpng. miloyip](https://github.com/miloyip/svpng)
- [Advanced Graphics](http://www.cs.uu.nl/docs/vakken/magr)
- [布雷森汉姆直线算法(Bresenham's line algorithm)](https://zh.wikipedia.org/wiki/%E5%B8%83%E9%9B%B7%E6%A3%AE%E6%BC%A2%E5%A7%86%E7%9B%B4%E7%B7%9A%E6%BC%94%E7%AE%97%E6%B3%95)
- [CS184 Repo](https://github.com/cal-cs184)
