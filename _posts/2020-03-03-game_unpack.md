---
layout: post
title: Galgame 美少女万华镜解包记录
date: 2020-03-03 11:52:24 +0800
categories: [Galgame, Reverse]
---

### 一篇可能没什么帮助的美少女万华镜解包记录

https://blog.ztjal.info/acg/acg-data/galgame-unpack-record-2011-4th

exfp3: http://asmodean.reverse.net/pages/exfp3.html

Resource Hacker: http://www.angusj.com/resourcehacker

as-util.h: https://raw.githubusercontent.com/lennylxx/pksgnpa/master/as-util.h (x)

'get_file_prefix': is not a member of 'as'
'stringf': is not a member of 'as'
'guess_file_extension': is not a member of 'as' //这怎么猜？

又一个 as-util.h as-util.h: https://github.com/Inori/FuckGalEngine/blob/master/Minori/Minori/fuckpaz/as-util.h

一样不行，自己写吧，先让 `guess_file_extension` 都返回 `${file.basename}.guess`

缺少的函数：

```cpp
string as::get_file_prefix(const string&);
string as::stringf(const string&, ...);
string guess_file_extension(unsigned char*, unsigned long);
unsigned long get_file_size(const int&);
```

```cpp
int open(const char*,const int&);
int access(const char*, const int&);
void mkdir(const char*);
void read(const int&, void*, const unsigned long&);
void close(const int&);
```

草，原来是 `io.h` 和 `direct.h`

然后函数都返回默认值，成功跑了起来,只是乱码。

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

完成了缺少的函数，但是程序的运行还是有问题

```cpp
char* toc_buff = new unsigned char[toc_len];
(fd, trl.toc_offset, SEEK_SET);
read(fd, toc_buff, toc_len);

char* p = toc_buff;
const unsigned short filename_len = *reinterpret_cast<unsigned short*>(p);
```

把 p 从 `char*` 类型转换成 `unsigned short*` 有什么意义吗？删掉这个类型转换也工作正常，好像？

很糟糕，访问越界了，在 `crc_or_something` 这里, 我能有什么办法呢？不过至少知道了 `FilePackVer3.1` 这样的字符串？然后又找到

https://github.com/hz86/filepack/blob/master/filepack31.c

代码更工整一些，但是解密部分不像手写的。我好像知道怎么反编译这种程序获得想要的东西啊！

https://zenhax.com/viewtopic.php?t=8115

据说这是 qlie format ？

https://github.com/vn-tools

https://github.com/morkt/GARbro

暂且先达成目的再考虑别的吧。

一篇关于 qlie disassembly 的记录。

https://sudonull.com/post/9841-Qlie-visual-story-engine-disassembly

用 GARbro 可以直接打开 .pack， 但是提取速度很慢，别人vn-tools 都可以多线程提取。

- data4 立绘
- data5 效果音
- data6 脚本
- data7 更多脚本
- data8 脚本+一张立绘？
- data3 像是CG的图？每帧都有
- data2 角色的配音？
- data1 背景音+一个movie?
- data0 脚本+配置？
