---
title: Speed Up Blog
date: 2020-03-21T15:41:32+08:00
draft: true
---

最近逛了[Nova的blog](https://nova.moe), 被这个速度惊呆了! 相比之下,我这博客就有点蜗牛的感觉. 而且图片的路径还是错的? 所以我想要优化我博客的速度, 但是我想,我得先把图片的问题解决掉.

图片在我本地是可以正常显示的,但是传到 github 上之后, 相对路径(../assert/image/*)让它们都显示不出来. 我首先是想到用图床,但是免费的图床都各有各的限制, 比如 10M 以下,一年 120 次上传, imgur 甚至要验证手机号码?但我还是想白嫖,于是找到了 [PicGo](https://github.com/PicGo/PicGo-Core), 看起来还不错, 但它不能自动进行 webp 转换, 所以我就写一个 webp 转换插件好了.

文档翻了几遍,基本上还是不懂, 看了它的源代码才大致懂了.

> 文档真的垃圾

首先 transformer 是在 [这里](https://github.com/PicGo/PicGo-Core/blob/deec252167e59eff4971cbe089bf25670f0a6979/src/core/Lifecycle.ts#L47-L58) 被调用的

```javascript
private async doTransform (ctx: PicGo): Promise<PicGo> {
  this.ctx.emit('uploadProgress', 30)
  this.ctx.log.info('Transforming...')
  let type = ctx.getConfig('picBed.transformer') || 'path'
  let transformer = this.ctx.helper.transformer.get(type)
  if (!transformer) {
    transformer = this.ctx.helper.transformer.get('path')
    ctx.log.warn(`Can't find transformer - ${type}, swtich to default transformer - path`)
  }
  await transformer.handle(ctx)
  return ctx
}
```

而且一次只能选择一个 transformer, 我还以为可以有多个 transformer?, 不过真要那样就得关心起执行的顺序了. 不过别的生命周期 hook 却可以有多个?

所以我把 `path` 这个默认 transformer 改改就完成了?感觉太快了.

果然没这么简单, 第一次update 我以为成功了,因为上传的文件确实是 webp 后缀. 但是其实是 `picgo u *.webp`

再次上传一个 .png 就是原样上传了. 设置的 transfomer 像是没有作用, --debug 也没给出更多的信息. 只好把代码拉下来调试, 看看哪里出了问题.

用 vscode 调试也有问题, readme 只写了怎么用, 却没写怎么调试? /bin/picgo 启动不了, 下断点也没用.

发现得改 tsconfig.json

```json
"sourceMap": true,
```

然后可以正确在断点处中断.

同时开一个 `npm run dev` (tsc -w -p), 让它自动编译. 代码快把我看哭了, 不过总算找到了原因, 是我的 config 写错了.

它这里明明是 `picBed.transformer`,我写在 `transformer`.真糟糕

报错了 `"read file C:\Users\i\Source\PicGo-Core\african-head-512x512.png error"`

我好菜啊, 原来 fs 我都没有 import

好难受, nodejs 根本找不到错误在哪, 只有一个莫名其妙的报错.

`cnpm i .\picgo-plugin-webp`

```
Error: [@.\picgo-plugin-webp\] resolved target C:\Users\i\.picgo\picgo-plugin-webp error: undefined
    at module.exports (C:\Users\i\scoop\persist\nodejs\bin\node_modules\cnpm\node_modules\npminstall\lib\download\local.js:30:11)
    at module.exports.throw (<anonymous>)
    at onRejected (C:\Users\i\scoop\persist\nodejs\bin\node_modules\cnpm\node_modules\co\index.js:81:24)
npminstall version: 3.27.0
npminstall args: C:\Users\i\scoop\apps\nodejs\current\node.exe C:\Users\i\scoop\persist\nodejs\bin\node_modules\cnpm\noaobao.org/mirrors/node --registry=https://r.npm.taobao.org .\picgo-plugin-webp\
```

用 npm 后安装好了, 但是再次安装就是这个错误

```
npm ERR! Invalid package name "_@babel_code-frame@7.8.3@@babel": name cannot start with an underscore; name can only contain URL-friendly characters
```

然后我用 yarn

```
success Saved lockfile.
Done in 152.06s.
```

搞笑

然后 `picgo -v`

```
TypeError: require(...) is not a function
```

真的不懂, 用 typescript 的编译器也没找到错误.

麻了

好像可以了,上传的拓展名没有变成 `webp` ,但是大小小得多. 应该是转成了 `webp` 编码.

之前得错误主要还是对 export 没搞懂, 我一直以为 export default 就可以了, 实在没见过 export  = () => {} 这种

我还发现把一个 100+ KB 的 jpg 图片转换成 webp 后, 大小变成了 900KB, 我是懵逼的.应该做个配置文件, 让它有可选的目标格式.

下一步就把 js 和 css 之类得用 webpack 压缩一下把,整成一个文件?

> 3.21

现在我转到 hugo 了, 果然速度很快-指 build 整个静态站点. 样式都删掉了, 图片专门建了一个 [GitHub 的 repo](https://github.com/iovw/image-storage) 来存, 用 picgo 和 typora 自动上传. 用 google 的 Speed Insight  分析有 100 分 (此处应有\滑稽

![image-20200321170258934](https://raw.githubusercontent.com/iovw/image-storage/master/images/image-20200321170258934.webp)

![image-20200321170352992](https://raw.githubusercontent.com/iovw/image-storage/master/images/image-20200321170352992.webp)

我写的 picgo 插件完善了一些, 现在可以选择用别的格式. 不过我好像误会 webp 了, 如果设定了无损转换那大小确实比不过 jpg, 但是保留 80% 的图像质量的有损压缩的话,比 jpg 更小.

接下来我应该会把样式调一下, 大概会手写?(为了速度的话)

还是感觉太慢,

![image-20200321171424590](https://raw.githubusercontent.com/iovw/image-storage/master/images/image-20200321171424590.webp)

这样全部都已 cached 的页面, 第一个 document 也需要 7.+s 才能加载出来

应该是特例, 平均都是 300+ ms, 还行吧. nova 那边是 100ms, 嗯..差距

很诡异，本地和 GitHub Runner 用一样的命令 build 出来的竟然不一样？我还专门 upload-artifact 再下下来看了的。

主要是 `<code>...</code>` 里面， 本地的版本生成了一些 span 和 class, 用于语法高亮， 但是远端就是一块字符串。

好像发现了点什么：

local

```
➜  Source (master) ✔ hugo version  
Hugo Static Site Generator v0.68.0/extended linux/amd64 BuildDate: unknown
```

remove

```
Preparing to unpack .../hugo_0.40.1-1_amd64.deb ...
Unpacking hugo (0.40.1-1) ...
Setting up hugo (0.40.1-1) ...
Processing triggers for man-db (2.8.3-2ubuntu0.1) ...
```

所以版本差了这么多？罪恶的 ubuntu

好了，用 snap 版本的 hugo 修复了这个问题。

然后 import katex 就让 main.bundle 增加到了 800+ kb, 感觉不太行，应该让 katex 在服务端渲染。

hugo 还是太菜了，拓展性太差，所以我要回到 hexo 了。

### 为什么我不再用 hugo?

优点：

- 速度快
- 二进制包，没有额外依赖

缺点：

- 优点也成为缺点，由于是二进制包，所以拓展性差(我能想到的只有加载 dll?, 但是官方也没有说明)
- 自定义pipeline, 我想要能够自定义每一个流程，每个过程都可替换，比如 markdown -> html 的过程, code block ->  `<span>...</span>` 的过程 

所以我想回到 hexo 了，忘了之前不用 hexo 的原因。

Hexo migrate rss 好有问题啊， rss 里面的内容不完整，它就让让我以为是好的？

尝试了两天 gatsby, 初见时挺惊艳的. 又是 React Jsx 式的组件, 又是 GraphQL 获取数据, 还自带一个 GraphIQL 的前端来查看数据 (因为只看到了美好的部分吧)

但是随着对它的了解更深, 我觉得它不太符合我的要求.

### 为什么我不再用 Gatsby ?

- 重型武器, `yarn install` 得跑好久
- 载入(初次)太慢, 生产模式 build 出来的 JS bundle 挺大的, 而之所以有这么多 JS, 是因为生成的页面不是纯静态的 HTML, 而只是把所有数据打包成了 Json, 然后估计还有 React router 之类的库来处理路由.(太粗暴了)
- 在禁用 JS 的环境下,完全不能正常运行.

然后优点也是有的,比如它使用 GraphQL, 就不只是为了查询个 Markdown 而设计的, 据说可以用于不同的数据源, 只要支持.

待续... 

