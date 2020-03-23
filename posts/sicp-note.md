---
date: 2019-10-07 09:34:07
title: sicp note
---

## 应用序与正则序

- 应用序： 先对过程的参数进行求值，然后将值作用到这个过程
- 正则序： 先将过程进行展开，用实参代换形参，再进行求值

举个例子：

```scheme
(define (add1 x y)
	(+ x y))
```

如果求值 `(add1 (+ 1 2) (* 2 3))`

应用序的话：

```scheme
(add1 3 6)
9
```

如果是正则序：

```
(+ (+ 1 2) (* 2 3))
(+ 3 6)
9
```

很明显正则序常常会有重复求值的问题，只要形参在过程中出现了多次，比如 `(define (square x) (* x x))` ,还有替换过程中的名字冲突的问题，比如

```scheme
(define (fun x)
  ((define y 1)
   (+ x y)))
```

```
(define y 2)
(fun (+ y 1))
```

```scheme
(+ 2 (+ y 1) y)
```

## 练习 1.6

```scheme
(define (nif pred then-exp else-exp)
  (cond (pred then-exp)
        (else else-exp)))

(define (nsqrt-iter guess x)
  (nif (good-enough? guess x)
       guess
       (nsqrt-iter (improve guess x)
                  x)))

(nsqrt-iter 1 2)
```

用 `nif` 改写 `sqrt-iter` 后，求值 `(nsqrt-iter 1 2)` 似乎陷入了死循环，而 `if` 版本的 可以瞬间获得结果。这是为什么呢？

感觉是应用序的原因，因为 `scheme` 是使用应用序求值的（`racket` 也是），而 `nif` 作为一个函数，需要对每个参数进行求值，才能执行函数体的内容，而在这里：

```scheme
  (nif (good-enough? guess x)
       guess
       (nsqrt-iter (improve guess x)
                  x))
```

问题在于，递归到 `good-enough? guess x` 为真的时候，如果是 `if` 他就会直接返回 `guess` 了, 但是 `nif` 由于他是一个函数，她还会继续求值 `nsqrt-iter` 。这样，`nif` 永远就中止不了（陷入死循环），只要他的参数里存在递归调用。

所以这个自定义的 `nif` 不能代换 `if` 。

## 练习 1.10

$$
A(x,y)=\begin{cases}
0,y=0\\
2y,x=0\\
A(x-1,A(x,y-1)),else
\end{cases}
$$

$$
\begin{align}
f(n)&=A(0,n)\\
&=2n\\
g(n)&=A(1,n)\\
&=A(0,A(1,n-1))\\
&=2A(1,n-1)\\
&=2A(0,A(1,n-2))\\
&=2^2A(1,n-2)\\
&...\\
&=2^{n-1}A(0,1)\\
&=2^n\\
h(n)&=A(2,n)\\
&=A(1,A(x,n-1))\\
&=A(0,A(x,n-2))\\
&=2A(x,n-2)\\
&...\\
&=2^{\frac n2}\\
\end{align}
$$



## ex 1.13

证明 $Fib(n)$ 是最接近 $\frac {\phi^n} {\sqrt 5}$ 的整数，其中 $\phi=\frac{1+\sqrt 5}2$
$$
Fib(n)=\begin{cases}
0 &\text{if }n=0\\
1 &\text{if }n=1\\
Fib(n-1)+Fib(n-2) &\text{else}
\end{cases}
$$

不会…
