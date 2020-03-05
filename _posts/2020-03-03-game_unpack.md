---
layout: post
title: Galgame 美少女万华镜解包记录
date: 2020-03-03 11:52:24 +0800
categories: [Galgame, Reverse]
---

### 一篇可能没什么帮助的美少女万华镜解包记录

一开始，只知道搜索 [Galgame, unpack, 美少女万华镜, 解包] ->

通过ZTJ的GalGame解包记录，了解到 asmodean 的 exfp3 可以解包这个游戏，然而这个 exfp3， 提供了三个版本，每个版本只有需要的参数不一样，我以为需要 keyfile ->

用 Resource Hacker 打开游戏执行文件，提取了里面的 RESKEY.bin, 但是还是没能成功用 exfp3 解包，执行过程没有输出？我开始尝试编译提供的代码，发现少了一部分，并不能编译成功。->

lennylxx 的 as-util.h 缺少了一些函数

```
'get_file_prefix': is not a member of 'as'
'stringf': is not a member of 'as'
'guess_file_extension': is not a member of 'as' //这怎么猜？
```

我觉得自己写，先让 `guess_file_extension` 都返回 `${file.basename}.guess`

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

第二部分是是 `io.h` 和 `direct.h` 里的函数，据说是 posix API, 在 windows 上也有

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

hz86 的 filepack, 然而我没有尝试这一个

> 代码更工整一些，但是解密部分不像手写的。我好想知道怎么反编译这种程序获得想要的东西啊！

->

找到几个支持多种格式的工具(arc_unpacker, GARbro)，暂且先达成目的再考虑别的吧。

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
- data1 背景音乐+一个movie?
- data0 脚本+配置？

GARbro 的提取选项里只要不选保持原样都可以正常打开。

3/5 更新：

GARbro 提取的原始格式的 png 文件不能直接打开，用2/16进制编辑器打开后，头部有 

```
DPNG         �             X   0t         �PNG

   
IHDR 
```

打开正常的 png 文件，头部是

```
�PNG

   
IHDR 
```

```
89 50 4e 47 0d 0a 1a 0a 20 20 20 0d 49 48 44 52
```

把 `�PNG`  之前的删除就是正常的 png 文件了。

写一个脚本来自动处理:

```python
#  Copyright (c) 2020 iovw.
#  All rights reserved.

import argparse
from pathlib import Path


def convert_file(inp_path, out_path):
    with open(inp_path, mode='rb') as inp:
        inp.seek(16 * 3)
        with open(out_path, 'wb') as out:
            out.write(inp.read())


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="""Convert DPNG format file to normal png file""")
    parser.add_argument("input", type=str,
                        help="Full path to the input directory.")
    parser.add_argument("output", type=str, default=str(Path.cwd()),
                        help="Full path to the output directory. "
                             "It would be a script parent directory if not specified.")

    args = parser.parse_args()
    in_dir = Path(args.input)
    out_dir = Path(args.output)

    for file in in_dir.glob('*.png'):
        print(f'convert {file.name}')
        convert_file(file, out_dir.joinpath(file.name))
```

但是太慢了，我有多个线程可用，但是只能用一个线程来处理，真是浪费呢。

用 timeit 测试了一下，处理100个 png 平均需要 0.19 s, 一秒钟 500 ？好像也不算慢了。

但是ev 里有700+的文件，跑了 34.8682508 s，难道我选的 100 张都是最小的那种？

改成随机选好了。然而，随机选择的100个文件也是 0.19+ s，200个是大约0.5s

```
2020-03-05 16:08:33,649 - process 100 file time: 0.1718941
2020-03-05 16:08:33,983 - process 200 file time: 0.34112460000000006
2020-03-05 16:08:34,470 - process 300 file time: 0.48815339999999996
2020-03-05 16:08:35,509 - process 400 file time: 1.0346279999999999
2020-03-05 16:08:36,926 - process 500 file time: 1.4165533999999997
2020-03-05 16:08:38,756 - process 600 file time: 1.8242625000000006
2020-03-05 16:08:40,569 - process 700 file time: 1.8237256000000004
2020-03-05 16:08:42,781 - process 701 files completed, duration: 2.2004572000000007
```

改了下之后像是正常了？

8 workers 的线程池

```
2020-03-05 16:07:28,215 - process 100 file time: 0.004936099999999999
2020-03-05 16:07:28,215 - process 200 file time: 0.00488559999999999
2020-03-05 16:07:28,231 - process 300 file time: 0.0058112999999999915
2020-03-05 16:07:28,246 - process 400 file time: 0.006451200000000018
2020-03-05 16:07:28,246 - process 500 file time: 0.007458199999999998
2020-03-05 16:07:28,262 - process 600 file time: 0.008884200000000009
2020-03-05 16:07:28,278 - process 700 file time: 0.00949259999999999
2020-03-05 16:07:28,293 - process 701 files completed, duration: 0.009794200000000003
```

效果显著！

Links:

- [ZTJ的GalGame解包记录](https://blog.ztjal.info/acg/acg-data/galgame-unpack-record-2011-4th)

- [asmodean 的 exfp3](http://asmodean.reverse.net/pages/exfp3.html)

- [Resource Hacker](http://www.angusj.com/resourcehacker)

- [lennylxx 的 as-util.h](https://raw.githubusercontent.com/lennylxx/pksgnpa/master/as-util.h)

- [Inori 的 as-util.h](https://github.com/Inori/FuckGalEngine/blob/master/Minori/Minori/fuckpaz/as-util.h)

- [hz86 的 filepack](https://github.com/hz86/filepack/blob/master/filepack31.c)

- [PC ero game .pack archive](https://zenhax.com/viewtopic.php?t=8115)

- [arc_unpacker](https://github.com/vn-tools/arc_unpacker)

- [GARbr](https://github.com/morkt/GARbro)

- [Qlie visual story engine disassembly](https://sudonull.com/post/9841-Qlie-visual-story-engine-disassembly)
