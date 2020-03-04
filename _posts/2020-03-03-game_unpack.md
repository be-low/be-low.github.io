---
layout: post
title: Galgame 美少女万华镜解包记录
date: 2020-03-03 11:52:24 +0800
categories: [Galgame, Reverse]
---

### 一篇可能没什么帮助的美少女万华镜解包记录

一开始，只知道搜索 [Galgame, unpack, 美少女万华镜, 解包]，  找到了这个页面：

https://blog.ztjal.info/acg/acg-data/galgame-unpack-record-2011-4th

一些别人的解包记录，但是里面只提到了 exfp3, 和作者的名字 asmodean ->

exfp3: http://asmodean.reverse.net/pages/exfp3.html

然而这个 exfp3， 提供了三个版本，每个版本只有需要的参数不一样，我以为需要 keyfile ->

Resource Hacker: http://www.angusj.com/resourcehacker

用 Resource Hacker 打开游戏执行文件，提取了里面的 RESKEY.bin, 但是还是没能成功用 exfp3 解包，执行过程没有输出？我开始尝试编译提供的代码，发现少了一部分，并不能编译成功。->

as-util.h: https://raw.githubusercontent.com/lennylxx/pksgnpa/master/as-util.h (x)

```
'get_file_prefix': is not a member of 'as'
'stringf': is not a member of 'as'
'guess_file_extension': is not a member of 'as' //这怎么猜？
```

又一个 as-util.h:

https://github.com/Inori/FuckGalEngine/blob/master/Minori/Minori/fuckpaz/as-util.h

和原始版本都不一样？自己写吧，决定先让 `guess_file_extension` 都返回 `${file.basename}.guess`

缺少的函数：

```cpp
string as::get_file_prefix(const string&);
string as::stringf(const string&, ...);
string guess_file_extension(unsigned char*, unsigned long);
unsigned long get_file_size(const int&);
```

第二部分：

```cpp
int open(const char*,const int&);
int access(const char*, const int&);
void mkdir(const char*);
void read(const int&, void*, const unsigned long&);
void close(const int&);
```

草，原来是 `io.h` 和 `direct.h`

然后函数都返回默认值，成功跑了起来,只是输出乱码。

```
        game index = 0 -> JK�ƈ��s���t2�`�s���d�ԕҁ`
        game index = 1 -> Soul Link ULTIMATE
        game index = 2 -> JK�ƈ��s���t3�`�����������ҁ`
        game index = 3 -> �H��ɕ����R���t�F�e�B
        game index = 4 -> JK�ƈ��s���t4�`�Ȃ܂������f�������ҁ`
        game index = 5 -> �Ȍ���`�����̃��C�t�Ɖ��̉Ł`
        game index = 6 -> JK�ƈ��s���t5�`�؋�o���ҁ`
        game index = 7 -> JK�ƈ��s���t6�`���u���u�J�b�v���Q���ҁ`
        game index = 8 -> JK�ƈ��s���tSP�`�n�鐢�Ԃ̓G�����t�΂���`
        game index = 9 -> ���u���L�X
        game index = 10 -> JK�ƃG�����[�}���`����Â��qJK����u�z�ɘA�ꍞ��Ń�����������`
        game index = 11 -> JK�ƃG���R���r�j�X���`�A���o�C�g���̎�݂�����ă�����������`
        game index = 12 -> �����L���[�����}���c�F
        game index = 13 -> �p�p���u�`�p�p�ƃC�`���G�����������B�ƈ�����̉��Ł`
        game index = 14 -> ���̕s�v�c�̏I���Ƃ�
        game index = 15 -> ���������؋�
        game index = 16 -> JK�ƃG���c���Z���Z�C�`���Ƃ̂���lJK����l�ɂ��ă�����������`
```

原始代码文件是 eucjp 编码的，转换成了 utf8,解决乱码问题，完成了缺少的函数，但是程序的运行还是有问题

```cpp
char* toc_buff = new unsigned char[toc_len];
(fd, trl.toc_offset, SEEK_SET);
read(fd, toc_buff, toc_len);

char* p = toc_buff;
const unsigned short filename_len = *reinterpret_cast<unsigned short*>(p);
```

把 p 从 `char*` 类型转换成 `unsigned short*` 有什么意义吗？删掉这个类型转换工作正常，好像？

很糟糕，访问越界了，在 `crc_or_something` 这里, 我能有什么办法呢？不过至少知道了 `FilePackVer3.1` 这个字符串？->

https://github.com/hz86/filepack/blob/master/filepack31.c

代码更工整一些，但是解密部分不像手写的。我好想知道怎么反编译这种程序获得想要的东西啊！

https://zenhax.com/viewtopic.php?t=8115

据说这是 qlie format？

https://github.com/vn-tools/arc_unpacker

https://github.com/morkt/GARbro

找到几个支持多种格式的工具，暂且先达成目的再考虑别的吧。

一篇关于 qlie disassembly 的记录。

https://sudonull.com/post/9841-Qlie-visual-story-engine-disassembly

在 arc_unpacker 说明页面发现它是支持 qlie 的

```
qlie/pack: added automatic searching for game keys
qlie/pack: improved .exe key retrieval
````

但是因为未知原因, 不能识别出来，尝试手动指定 format, 也失败了。->

用 GARbro 可以直接打开 .pack， 但是提取速度很慢，别人 arc_unpacker 都可以多线程提取！

还有就是 GARbro 的游览器界面是可以查看图片的，但是提取出来的 png 不能正常打开。

- data4 立绘
- data5 效果音
- data6 脚本
- data7 更多脚本
- data8 脚本+一张立绘？
- data3 像是CG的图？每帧都有
- data2 角色的配音？
- data1 背景音+一个movie?
- data0 脚本+配置？

待续...
