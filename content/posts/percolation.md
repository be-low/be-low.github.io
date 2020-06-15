---
date: 2019-10-05 09:34:07
title: Percolation
---

`isOpen` whether or not that space has been excavated(挖掘，变成空洞)

`isFull` has water reached it from the top.

所以明白了这两个方法的作用就可以完成下面这个

```java
public class Percolation {
   public Percolation(int N){}
   public void open(int row, int col){}
   public boolean isOpen(int row, int col){}
   public boolean isFull(int row, int col){}
   public int numberOfOpenSites(){}
   public boolean percolates(){}
   public static void main(String[] args){}
}
```

后面都没什么难度

### 这是 Percolation Statistics 的结果

#### 1. 使用 `WeightedQuickUnionUF`

```log
30 1000 time:0.179
30 2000 time:0.283
300 10 time:1.708
600 10 time:32.378
```

#### 2. 使用 `QuickFindUF`

```log
30 1000 time:0.372
30 2000 time:0.608
300 10 time:13.59
600 10 time:218.983
```

#### 4. 使用 `UF`

```log
30 1000 time:0.178
30 2000 time:0.248
300 10 time:1.728
600 10 time:32.496
```

#### 3. 使用我写的 Weighted QuickUnionUF with path compression

```log
30 1000 time:0.173
30 2000 time:0.252
300 10 time:1.721
600 10 time:31.921
```

可以看出路径压缩对这个问题没有什么性能上的提升

### 算法分析

#### 对于 `WeightedQuickUnionUF` 和 `Weighted QuickUnionUF with path compression`

在 N=300 时，count = $300^2$ = 90000, 平均执行时间大约为 $\frac{1.7}{10}=0.17s$

在 N=600 时，count = $300^2$ = 360000, 平均执行时间大约为 $\frac{32}{10}=3.2s$

而每一个 period 里，

```java
while (!percolation.percolates()) {
      k = StdRandom.uniform(blocked.size());
      percolation.open(blocked.get(k));
      blocked.remove(k);
      x++;
}
```

这里应该会消耗主要的时间，因为 $p^*\approx0.59$ 所以大约迭代 $0.59 count$ 次，

然后每次迭代，除了 `percolation.open(blocked.get(k));`都是常量时间的操作，

```java
public void open(int[] v) {
   int pointIndex = v2ToIndex(v, n);
   if (v[0] == 0) {uf.union(topIndex, pointIndex);}
   if (v[0] == n - 1) {uf.union(bottomIndex, pointIndex);}
   for (int[] d : Directions) {
      int[] p1 = v2Plus(v, d);
      if (v2Valid(p1, n) && isOpen(p1)) {
            int p1i = v2ToIndex(p1, n);
            uf.union(pointIndex, p1i);
      }
   }
   g[v[0]][v[1]] = 1;
}
```

`Weighted QuickUnionUF` 的 union

```java
public void union(int v1, int v2) {
   int r1 = find(v1), r2 = find(v2);
   int s1 = sizeOf(v1), s2 = sizeOf(v2);
   if (s1 >= s2) {
      size[r2] += size[r1];
      data[r2] = r1;
   }
   else {
      size[r1] += size[r2];
      data[r1] = r2;
   }
}
```

find 的时间复杂度 $\leq$ 于树的高度，其他都为常量时间。

而对于有 count 个元素的`WeightedQuickUnionUF` ，高度 $\leq \log_2{count}$

$$
R(union) = \mathcal{O}(2\log{}count)\\
$$

而 `open` 最多会调用 6 次 union

$$
R(open) = \mathcal{O}(12\log{}count)
$$

再乘 $0.59count$ 次迭代 : $\mathcal{O}(7.08count\log{}count)$

而 $count = N^2$ 所以算法的复杂度为

$$
\mathcal{O}(7.08N^2\log{}N^2)
$$

代入上面的数据看一下

$$
\mathcal{O}(7.08N^2\log{}N^2)(N=300)=0.17\\
\mathcal{O}(7.08N^2\log{}N^2)(N=600)=3.2
$$

$$
7.08\times300^2 \times \log{}300^2x=0.17\\
x=2.33873*10^{-8}\\
7.08\times600^2 \times \log{}600^2x = 3.2\\
x=9.81325*10^{-8}
$$

~~好像也是一个数量级？~~

#### 对于`QuickFindUF`

而对于 `QuickFindUF` ,它的树的高度总是 2，但是 union 需要遍历所以节点，所以是

$$
\Omega(3.54N^4)
$$

```log
300 10 time:13.59
600 10 time:218.983
```

$$
\begin{cases}
\frac{13.59}{10}=1.359, N=300\\
\frac{218.983}{10}=21.898, N=600
\end{cases}
$$

$$
300^4*3.54*x=1.359\\
x=4.73949*10^{-11}\\
600^4*3.54*x=21.898\\
x=4.77305*10^{-11}
$$

这个还挺准确的

我想了一下，`QuickFindUF` 之所以准确是因为在 union 的时候总是得遍历一遍，而 `Weighted QuickUnionUF` 之所以差了 4-5 倍，是因为 union 的时候，复杂度算的是树高度 ($\log{}N^2$)，但是节点不会总是在树的底部，所以只能以树高度来表示它的最坏情况，这样的话，小于 10 倍的误差我觉得是可以理解的。

### 路径压缩为什么没有提高算法的性能

路径压缩在第一次 find(x) 的时候与 `WeightedQuickUnionUF` 时间复杂度是一样的，只有在后面再 find(x) 的时候才会降低复杂度到 $\Omega(1)$

```java
while (!percolation.percolates()) {
      k = StdRandom.uniform(blocked.size());
      percolation.open(blocked.get(k));
      blocked.remove(k);
      x++;
}
```

而这里他会 `open` $0.59count$ 个不同的节点。我分析不下去了，就这样吧。猜测是因为同一个节点重复 find 的操作不多？但是这样才算不多呢?
