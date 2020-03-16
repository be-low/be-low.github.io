---
layout: post
title: Galgame 美少女万华镜解包记录
date: 2020-03-03 11:52:24 +0800
categories: [Galgame, Reverse]
---

### 一篇可能没什么帮助的美少女万华镜4解包记录

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
DPNG         �             X   0t         
......
\x89PNG IHDR 
```

打开正常的 png 文件，头部是

```
\x89 P N G \x0d \x0a \x1a \x0a
```

把 `\x89PNG`  之前的删除就是正常的 png 文件了。

写一个脚本来自动处理:

```python
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

不对，我的多线程程序没有执行完成就退出了，才发现输出目录没有东西。

传的参数不对，但已经是我尝试过N种错误的方法后了，然后就是 timeit 好像测不出来执行时间，

```
beg = time()
executor.map(convert_file, in_files)
duration = time() - beg
```

用这种朴实的方法也不行，明显感觉到在输出最后一句后还执行了一段时间。

用 idea 的  profile 工具可以测得处理 701 个文件的时间是 1067 ms，算是还可以吧。

然后的话，需要把所有的不完整的图片合并完整。先用 GIMP 看看怎么摆？（虽然 ps 更专业，但是越来越难下载了）

唉，这拼图好难啊，我还以为顺序有用的。让我看下答案。

然后我发现，GARbro的每个文件都是一整张图，而我这里只有一部分？

然后把文件读进来，查找 png 的文件头：

```python
In [21]: re.findall(rb'\x89PNG',cnt)
Out[21]:
[b'\x89PNG',
 b'\x89PNG',
 b'\x89PNG',
 b'\x89PNG',
 b'\x89PNG',
 b'\x89PNG',
 b'\x89PNG',
 b'\x89PNG']
```

所以之前我只把第一部分取出来了，其实一共有8个切片。真是糟糕的设计！

想换个语言玩了。不如 C# 或者 kotlin ?

算了咱还是快点完成吧，还有很多事情呢。

看到 PNG 的 Specification 文档真是让人望而生畏啊，太长了。

真的，无心看这个 png 规范了，除非我需要写一个 png viewer。

感觉翻 GARbro 的代码反而更简单。但是用VS连成功编译代码都做不到。

如果说不能编译的原因话，就是依赖的奇怪问题。比如 一个文件 `using System.Linq` 但VS显示 `未能找到引用的组件"System.Linq"` 然后 `using` 这句也是红的。太难了。CS 领域就是这样，用的操作系统肯定是有bug，IDE有bug，PL也有bug，就看什么时候遇到了。

但这常常让我心情很糟。好像找到原因了，它这里引用的dll都是这样的

![vs1](https://raw.githubusercontent.com/iovw/iovw.github.io/image/vs.webp)

正常的是这些

![vs2](https://raw.githubusercontent.com/iovw/iovw.github.io/image/vs1.webp)

根据自觉，咱在 {project}.csproj 里找到了重要信息

```xml
 <PropertyGroup>
    <PreBuildEvent>perl "$(SolutionDir)inc-revision.pl" "$(ProjectPath)" $(ConfigurationName)
exit 0</PreBuildEvent>
  </PropertyGroup>
  <Import Project="$(SolutionDir)\.nuget\NuGet.targets" Condition="Exists('$(SolutionDir)\.nuget\NuGet.targets')" />
  <Target Name="EnsureNuGetPackageBuildImports" BeforeTargets="PrepareForBuild">
    <PropertyGroup>
      <ErrorText>This project references NuGet package(s) that are missing on this computer. Enable NuGet Package Restore to download them.  For more information, see http://go.microsoft.com/fwlink/?LinkID=322105. The missing file is {0}.</ErrorText>
    </PropertyGroup>
    <Error Condition="!Exists('$(SolutionDir)\.nuget\NuGet.targets')" Text="$([System.String]::Format('$(ErrorText)', '$(SolutionDir)\.nuget\NuGet.targets'))" />
  </Target>
```

是原作者写的一个 perl 脚本，但是在我这里不能运行，它是操作 git 的。所以把这段代码注释，项目就正常了。每个被以来的项目都需要这样操作。（其实不懂为啥不用 cmd 脚本，更简单不是吗？）

而且作者根本没在 ReadMe 里讲怎么 build 这个项目？

接下来，错误改变了，**找不到清单签名证书**。应该好解决。

成功编译运行，奇怪的知识增加了。

找到的关键部分的代码，期间困难重重，我得克服不改那些红色波浪线的冲动，去一个函数一个函数的往下跳，

而且看到这部分代码，很感动，因为一开始就找到了这里，只是不太明白，经过这么个过程，大致明白了程序的一部分逻辑后，更明白了？接下来就需要把这部分 CSharp 代码复刻到 Python 了。

```csharp
public override ImageMetaData ReadMetaData(IBinaryStream file)
{
    file.Position = 8;
    var tileCount = file.ReadInt32();
    if (tileCount <= 0)
        return null;

    var metaData = new DpngMetaData
    {
        BPP = 32,
        TileCount = tileCount,
        Width = file.ReadUInt32(),
        Height = file.ReadUInt32()
    };
    return metaData;
}
```

```csharp
public override ImageData Read(IBinaryStream stream, ImageMetaData metaData)
{
    var meta = (DpngMetaData) metaData;
    var bitmap = new WriteableBitmap((int) metaData.Width, (int) metaData.Height,
        ImageData.DefaultDpiX, ImageData.DefaultDpiY,
        PixelFormats.Pbgra32, null);
    long next_tile = 0x14;
    for (var i = 0; i < meta.TileCount; ++i)
    {
        stream.Position = next_tile;
        var x = stream.ReadInt32();
        var y = stream.ReadInt32();
        var width = stream.ReadInt32();
        var height = stream.ReadInt32();
        var size = stream.ReadUInt32();
        stream.Seek(8, SeekOrigin.Current);
        next_tile = stream.Position + size;
        if (0 == size)
            continue;
        using (var streamRegion = new StreamRegion(stream.AsStream, stream.Position, size, true))
        {
            var decoder = new PngBitmapDecoder(streamRegion,
                BitmapCreateOptions.None, BitmapCacheOption.OnLoad);
            var frame = new FormatConvertedBitmap(decoder.Frames[0], PixelFormats.Pbgra32, null, 0);
            var stride = frame.PixelWidth * 4;
            var pixels = new byte[stride * frame.PixelHeight];
            frame.CopyPixels(pixels, stride, 0);
            var rect = new Int32Rect(0, 0, frame.PixelWidth, frame.PixelHeight);
            bitmap.WritePixels(rect, pixels, stride, x, y);
        }
    }
    
    bitmap.Freeze();
    return new ImageData(bitmap, metaData);
}
```

我想要不要直接去改 GARbro 了，它支持的格式很多，我只需要加一个多线程或者异步的导出功能就好了？虽然原作者好像不活跃了，但是程序本身不是很复杂，没有什么困难的算法？

一开始是用的 pillow, 一般的操作还是没问题，而且还有 `Image.frombytes` 这样的接口，但是和我想的不一样，我这种包含元数据的`png`原始字节流好像并不支持？

原来可以把 `bytes` 转成 `BytesIO` 可以当成文件打开？(file like object)

看来 pillow 还是不太行，不能操作 ROI (Region of Interest), 而这可是 opencv 的基础操作？不过我优点还是小吧，手动操作也不是不行，就是觉得会很慢。

看来不太行，换用 cv 了。太糟糕了。开始怀念 matlab 的图像操作了。

cv 由于只是一个 c++ 库的 python 绑定，错误信息根本看不到，只能看到  `SystemError: <built-in function imwrite> returned NULL without setting an error`, 很难 debug。

好了，我已经开始改 GARbro 了，先是用 reshaper 把所有代码的难看的红色波浪线干掉（才发现可以直接干掉一整个项目/解决方案，不过很慢就是了，期间我甚至下完了一个不小的游戏？）

找到了我要改的代码，但是感觉无从下手，它有这样一个函数 `ExtractFilesFromArchive` 但是这些 extract 的操作都是在那个进度条控件的 `doWork` 里，然而 C# 的 `ThreadPool` 好像只有发送任务的接口，任务完成后不知道怎么获得反馈，这样和进度条不能协同工作啊！

难难难！头秃。

这种 WPF 的应用，事件绑定好像是一般都在 XAML 文件里？刚又忘了，在 .cs 里找半天，不过更好的方法应该是用 IDE 的查找方法调用功能吧？

很想放弃了。试了下 async 就发现它的缺点，这个项目代码太多， async 又必须更改函数的接口，改一个地方就得改所有地方。

真的放弃了。

最后再在 Python 那条路上挣扎一下。（主要是Python连阻塞式的单线程的处理现在都不能实现）

好了，我的 Python 代码成功了，经过大概十多次错误之后。

过程大概就是用 numpy 生成一个随机数据的矩阵，用 imread 竟然可以成功保存？

然后控制变量，比如大小，数据类型，数据应该是无关的，最后发现唯一不同只是我传了一个 `libpath.Path` 到 path 里，而对照组是 `str` ？至此，Python 这条路应该是没有问题了。

顺序执行用了 58.854 s， 而并发执行的版本不太正常，700 张图只输出了不到100张？日志里倒是说都完成了.

莫名其妙的好了？14.150 s 11.617 s (把设的8个worker，删了，发现默认是  `min(32, (os.cpu_count() or 1) + 4)` 感觉直接默认值会更好？

又解决一个小问题，有俩很恐怖的图(`c_笑う夕摩_01.png`)，不是 RGBA 的png，矩阵的形状不一样了？

而且还不能广播(broadcast)？所以咱统一转成 RGBA。

这个章节就暂时这样吧，现在做了

- 一个用一系列图片生成gif动画的脚本
- 一个把 dpng 这种专有憨憨格式转成通用的png的脚本。

然而从 .pack 中提取文件的功能还是用的 GARbro。（而且它也支持直接转换 dpng 到 png）

没什么成果，踩了很多坑。

Links:

- [ZTJ的GalGame解包记录](https://blog.ztjal.info/acg/acg-data/galgame-unpack-record-2011-4th)
- [asmodean 的 exfp3](http://asmodean.reverse.net/pages/exfp3.html)
- [Resource Hacker](http://www.angusj.com/resourcehacker)
- [lennylxx 的 as-util.h](https://raw.githubusercontent.com/lennylxx/pksgnpa/master/as-util.h)
- [Inori 的 as-util.h](https://github.com/Inori/FuckGalEngine/blob/master/Minori/Minori/fuckpaz/as-util.h)
- [hz86 的 filepack](https://github.com/hz86/filepack/blob/master/filepack31.c)
- [PC ero game .pack archive](https://zenhax.com/viewtopic.php?t=8115)
- [arc_unpacker](https://github.com/vn-tools/arc_unpacker)
- [GARbro](https://github.com/morkt/GARbro)
- [Qlie visual story engine disassembly](https://sudonull.com/post/9841-Qlie-visual-story-engine-disassembly)
- [Portable Network Graphics (PNG) Specification (Second Edition)](https://www.w3.org/TR/PNG)
- [Portable Network Graphics ](https://en.wikipedia.org/wiki/Portable_Network_Graphics)
- [Dotnet Task Parallel Library ](https://docs.microsoft.com/en-us/dotnet/standard/parallel-programming/task-parallel-library-tpl?redirectedfrom=MSDN)
