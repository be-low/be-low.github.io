---
date: 2020-06-04 19:36:24
title: 前端方向的面试经历2
---

记录一次前端方向的面试经历（其实是第三次，其实很多问题都重叠了，但我还是答不上来）。

1. JavaScript 原型链， `__proto__` 关键字

   答：眼熟 `__proto__`，但我不知什么意思（大意）。

   ***

   对象的原型对应 `__proto__` ，函数的原型对应 `prototype`

   肤浅的证明：

   ```jsx
   function Foo() {}
   const bar = new Foo()
   bar.__proto__ === Foo.prototype
   // true
   ```

   [继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)

   `__proto__` 不是 JS 的标准属性，但却是事实标准。

   标准的方式是用 `Object.getPrototypeOf(obj)` 和 `Object.setPrototypeOf(obj)` 。不过据说性能反而会降低？

   [Object.getPrototypeOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)

   看来 JS 根本没有类这种东西？类实际上都是函数。 不过 Java 这种，到 JVM bytecode 层面也许也没有类的概念了？

2. HTTP 缓存

   答：只眼熟 `Last-Modified` ，具体作用不知，别的也不知（

   ***

   一手的信息 RFC 文档还挺长的，43 页...

   Hypertext Transfer Protocol (HTTP/1.1): Caching

   [](https://tools.ietf.org/pdf/rfc7234.pdf)

   [HTTP 缓存](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching_FAQ)

   [HTTP 缓存 | Web Fundamentals | Google Developers](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching?hl=zh-cn)

   简要来说，就是每个请求的资源的缓存控制都通过 `Cache-Control` 的 HTTP 头来制定。

   - `no-store` 不缓存资源
   - `no-cache` 每次请求都对缓存资源进行验证（所以并不是 'no-cache' 的字面意思？）
   - `public` 可被中间人（CDN，中间代理）缓存
   - `private` 与上条相反
   - `max-age` 制定过期时间
   - `must-revalidate` 必须重新验证，那不合 'no-cache' 一样吗？

   验证的机制

   MDN 上说 `ETags` 是强校验器，而 `Last-Modified` 可以作为一种弱校验器，但没说强和弱在哪里？(看到了，我大概眼睛不好使。`Last-Modified`说它弱是因为有效期只有 1s)

   - `ETags` 资源的指纹（比如哈希）。总之就是缓存过了有效期限之后，向服务端发送请求并附带 `If-None-Match` 头(值为 ETags 的值)，服务端进行验证。如果通过则 304 (Not Modified)，同时更新过期时间; 否则 200(OK) 并附带更新的资源。
   - `Last-Modified` 对应`If-Modified-Since`，与上述类似的逻辑。

   还有 `Vary` 也算是缓存控制吧，指定某个（头|属性），比如 `Vary: User-Agent` 第一次请求缓存了 `User-Agent: Firefox` 的某资源，第二次请求用 `User-Agent: Chrome` 请求同一资源就不会用第一次的缓存。

3. TCP 三次握手四次挥手

   答：C: Hello, S: Recvice, ...

   ***

   三次握手其实也差不多，大意：C: Hello, S: Recvice, C: Ack

   四次挥手，C:Fin, S: ACK, S: Fin, C: ACK

   客户端发起结束连接的报文，所以它不再需要发送数据了。但是服务端可能还有数据没有发送完成，可以在 “S: ACK, S: Fin” 之间继续发送。

4. CSS 垂直水平居中

   答：水平居中可以用 `margin: 0 auto;`, 锤子的话我一般用 Flex Box 或者 Grid，（还知道别的方式吗？）不知...

   ***

   ![imagesCSS-vertical-center.webp](https://raw.githubusercontent.com/imbillow/image-storage/master/imagesCSS-vertical-center.webp)

   ...这不和

   > 你可知茴字有几种写法？

   一样吗？一直觉得用 table 来布局怪怪的。

   12 种写法大部分都挺 tricky, 感觉除了 Flex box 和 Grid 外，只用记一个 line-height = height （其实我知）和 绝对定位 + `top:50%` + (`margin-top: -height/2` | `transform: translate(0, -50%)`)

   然后兼容性：

   ![imagescompatible-flex.webp](https://raw.githubusercontent.com/imbillow/image-storage/master/imagescompatible-flex.webp)

   ![imagescompatible-transform.webp](https://raw.githubusercontent.com/imbillow/image-storage/master/imagescompatible-transform.webp)

5. 数据结构 堆

   答：只记得堆是压扁的树（仅存的印象），其它的就不知了。（然后又问了啥链表、数组、栈、队列）

   ***

   实际上堆只是父节点比子节点小（或大）的树而已，我之所以有压扁的印象是因为 cpp 的堆是用数组实现的（也没有了解太多，只对那张图有点印象）。
   它也有别的名字，比如优先队列？或者说一般优先队列都是用的堆来实现的。
   优先队列和普通的先进先出有点不同就是，每个元素都有个优先级，优先级高（或低）的可以直接插队到前面。
