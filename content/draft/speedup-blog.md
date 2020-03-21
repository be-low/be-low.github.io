---
title: "Speedup Blog"
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
