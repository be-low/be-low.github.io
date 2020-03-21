---
categories:
- Java
date: "2019-10-01T13:08:31Z"
title: Java Integer 的缓存机制
---

做 cs61b 的 lab3 时碰到的，需要解释 

```java
public static boolean isSameNumber(Integer a, Integer b) {
    return a == b;
}
```

用这个判断 0-499 的两个一样的 int 时，为什么到 128 就是 false 了，我觉得我这解释还可以。

```java
private static class IntegerCache {
    static final int low = -128;
    static final int high;
    static final Integer[] cache;
    static Integer[] archivedCache;

    private IntegerCache() {
    }

    static {
        int h = 127;
        String integerCacheHighPropValue = VM.getSavedProperty("java.lang.Integer.IntegerCache.high");
        if (integerCacheHighPropValue != null) {
            try {
                h = Math.max(Integer.parseInt(integerCacheHighPropValue), 127);
                h = Math.min(h, 2147483518);
            } catch (NumberFormatException var6) {
            }
        }

        high = h;
        VM.initializeFromArchive(Integer.IntegerCache.class);
        int size = high - -128 + 1;
        if (archivedCache == null || size > archivedCache.length) {
            Integer[] c = new Integer[size];
            int j = -128;

            for(int i = 0; i < c.length; ++i) {
                c[i] = new Integer(j++);
            }

            archivedCache = c;
        }

        cache = archivedCache;

        assert high >= 127;

    }
}

```

```java
public static Integer valueOf(int i) {
    return i >= -128 && i <= Integer.IntegerCache.high ? Integer.IntegerCache.cache[i + 128] : new Integer(i);
}
```

```java
public Integer(int value) {
    this.value = value;
}
```

从上面这几段代码来看, Integer 确实是有一个缓存的机制,所以：

$$
Integer.valueOf(x) == Integer.valueOf(x) =\\
\begin{cases}
true, &\text{if } -128 \leq x \leq high\\
false,&\text{if } x \leq -128 \text{ or } x \geq high\\
\notag
\end{cases}
$$

high 在大多时候都等于 127。

验证了我的推测，开心

然后搜索了一下，可以这样更改缓存的上界，

```java
-Djava.lang.Integer.IntegerCache.high=<size>
```

or JVM setting:

```java
-XX:AutoBoxCacheMax=<size>
```

但是下界目前( openjdk12 )还是硬编码的