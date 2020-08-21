---
title: 'csapp bomb wripteup'
date: '2020-08-21'
---

只是很粗糙的日志

## phase 2

### `read_six_numbers(char*,?)`

```assemble
0x000000000040145c <+0>:     sub    $0x18,%rsp
0x0000000000401460 <+4>:     mov    %rsi,%rdx
0x0000000000401463 <+7>:     lea    0x4(%rsi),%rcx
0x0000000000401467 <+11>:    lea    0x14(%rsi),%rax
0x000000000040146b <+15>:    mov    %rax,0x8(%rsp)
0x0000000000401470 <+20>:    lea    0x10(%rsi),%rax
0x0000000000401474 <+24>:    mov    %rax,(%rsp)
0x0000000000401478 <+28>:    lea    0xc(%rsi),%r9
0x000000000040147c <+32>:    lea    0x8(%rsi),%r8
0x0000000000401480 <+36>:    mov    $0x4025c3,%esi
0x0000000000401485 <+41>:    mov    $0x0,%eax
0x000000000040148a <+46>:    callq  0x400bf0 <__isoc99_sscanf@plt>
0x000000000040148f <+51>:    cmp    $0x5,%eax
0x0000000000401492 <+54>:    jg     0x401499 <read_six_numbers+61>
0x0000000000401494 <+56>:    callq  0x40143a <explode_bomb>
0x0000000000401499 <+61>:    add    $0x18,%rsp
0x000000000040149d <+65>:    retq
```

### `phase2(char*)`

```assemble
0x0000000000400efc <+0>:     push   %rbp
0x0000000000400efd <+1>:     push   %rbx
0x0000000000400efe <+2>:     sub    $0x28,%rsp
0x0000000000400f02 <+6>:     mov    %rsp,%rsi
0x0000000000400f05 <+9>:     callq  0x40145c <read_six_numbers>
0x0000000000400f0a <+14>:    cmpl   $0x1,(%rsp)
0x0000000000400f0e <+18>:    je     0x400f30 <phase_2+52>
0x0000000000400f10 <+20>:    callq  0x40143a <explode_bomb>
0x0000000000400f15 <+25>:    jmp    0x400f30 <phase_2+52>
0x0000000000400f17 <+27>:    mov    -0x4(%rbx),%eax
0x0000000000400f1a <+30>:    add    %eax,%eax
0x0000000000400f1c <+32>:    cmp    %eax,(%rbx)
0x0000000000400f1e <+34>:    je     0x400f25 <phase_2+41>
0x0000000000400f20 <+36>:    callq  0x40143a <explode_bomb>
0x0000000000400f25 <+41>:    add    $0x4,%rbx
0x0000000000400f29 <+45>:    cmp    %rbp,%rbx
0x0000000000400f2c <+48>:    jne    0x400f17 <phase_2+27>
0x0000000000400f2e <+50>:    jmp    0x400f3c <phase_2+64>
0x0000000000400f30 <+52>:    lea    0x4(%rsp),%rbx
0x0000000000400f35 <+57>:    lea    0x18(%rsp),%rbp
0x0000000000400f3a <+62>:    jmp    0x400f17 <phase_2+27>
0x0000000000400f3c <+64>:    add    $0x28,%rsp
0x0000000000400f40 <+68>:    pop    %rbx
0x0000000000400f41 <+69>:    pop    %rbp
0x0000000000400f42 <+70>:    retq
```

### sixty registers

six argument register

1. rdi
2. rsi
3. rdx
4. rcx
5. r8
6. r9

- rax: return value
- rbx: callee saved
- rbp: base reg; callee saved
- rsp: stack ptr
- r10-11: temporary reg
- r12-15: callee saved

在 `__isoc99_sscanf@plt` 中断，观察到

```c
(gdb) printf "%s\n", $rsi
%d %d %d %d %d %d
```

```
   0x000000000040148a <+46>:    callq  0x400bf0 <__isoc99_sscanf@plt>
   0x000000000040148f <+51>:    cmp    $0x5,%eax
   0x0000000000401492 <+54>:    jg     0x401499 <read_six_numbers+61>
=> 0x0000000000401494 <+56>:    callq  0x40143a <explode_bomb>
   0x0000000000401499 <+61>:    add    $0x18,%rsp
```

所以第一个参数就是输入的第二个字符串，而且需要匹配到6整数

6个数的位置

```
0x0000000000401460 <+4>:     mov    %rsi,%rdx
0x0000000000401463 <+7>:     lea    0x4(%rsi),%rcx
0x0000000000401467 <+11>:    lea    0x14(%rsi),%rax
0x000000000040146b <+15>:    mov    %rax,0x8(%rsp)
0x0000000000401470 <+20>:    lea    0x10(%rsi),%rax
0x0000000000401474 <+24>:    mov    %rax,(%rsp)
0x0000000000401478 <+28>:    lea    0xc(%rsi),%r9
0x000000000040147c <+32>:    lea    0x8(%rsi),%r8
```

rdx-r9 4个寄存器，加上两个 stack 的 ptr

而 $rsp == $rsi-0x18

1. $rdx = $rsi
2. $rcx = $rsi+4
3. $r8 = $rsi+8
4. $r9 = $rsi+0xc
5. ($rsp) = $rsi+0x10
6. ($rsp+8) = $rsi+0x14

```
0x0000000000400f0a <+14>:    cmpl   $0x1,(%rsp)
0x0000000000400f0e <+18>:    je     0x400f30 <phase_2+52>
0x0000000000400f10 <+20>:    callq  0x40143a <explode_bomb>
```

第一个限定为 1

```
0x0000000000400f30 <+52>:    lea    0x4(%rsp),%rbx
0x0000000000400f35 <+57>:    lea    0x18(%rsp),%rbp
0x0000000000400f3a <+62>:    jmp    0x400f17 <phase_2+27>
```

$rbx = $rsp + 0x4
$rbp = $rsp + 0x18

```
=> 0x0000000000400f17 <+27>:    mov    -0x4(%rbx),%eax
   0x0000000000400f1a <+30>:    add    %eax,%eax
   0x0000000000400f1c <+32>:    cmp    %eax,(%rbx)
   0x0000000000400f1e <+34>:    je     0x400f25 <phase_2+41>
   0x0000000000400f20 <+36>:    callq  0x40143a <explode_bomb>
```

这里 rsi 被赋值为0了，但它应该等于现在的 $rsp

$eax == ($rbx-4) = ($rsp)

{
    $eax = 2 * $eax
    $eax - ($rbx) = 0
}

2 * ($rsp) - ($rsp+4) == 0

($rsp) = 1

2 - x = 0

第二个数

x = 2

$rbx += 0x4
$rbp - $rbx
= $rsp + 0x18 - $rsp + 0x8
= 0x10

```
=> 0x0000000000400f17 <+27>:    mov    -0x4(%rbx),%eax
   0x0000000000400f1a <+30>:    add    %eax,%eax
   0x0000000000400f1c <+32>:    cmp    %eax,(%rbx)
   0x0000000000400f1e <+34>:    je     0x400f25 <phase_2+41>
   0x0000000000400f20 <+36>:    callq  0x40143a <explode_bomb>
   0x0000000000400f25 <+41>:    add    $0x4,%rbx
   0x0000000000400f29 <+45>:    cmp    %rbp,%rbx
   0x0000000000400f2c <+48>:    jne    0x400f17 <phase_2+27>
```

容易看出，这是个循环
每次迭代都希望 后一个数 y 与前一个数 x，满足

2*x - y = 0
y = 2*x

一共五次迭代

所以得出: "1 2 4 8 16 32"

## phase 3

```
Dump of assembler code for function phase_3:
   0x0000000000400f43 <+0>:     sub    $0x18,%rsp
   0x0000000000400f47 <+4>:     lea    0xc(%rsp),%rcx
   0x0000000000400f4c <+9>:     lea    0x8(%rsp),%rdx
   0x0000000000400f51 <+14>:    mov    $0x4025cf,%esi
=> 0x0000000000400f56 <+19>:    mov    $0x0,%eax
   0x0000000000400f5b <+24>:    callq  0x400bf0 <__isoc99_sscanf@plt>
   0x0000000000400f60 <+29>:    cmp    $0x1,%eax
   0x0000000000400f63 <+32>:    jg     0x400f6a <phase_3+39>
   0x0000000000400f65 <+34>:    callq  0x40143a <explode_bomb>
   0x0000000000400f6a <+39>:    cmpl   $0x7,0x8(%rsp)
   0x0000000000400f6f <+44>:    ja     0x400fad <phase_3+106>
   0x0000000000400f71 <+46>:    mov    0x8(%rsp),%eax
   0x0000000000400f75 <+50>:    jmpq   *0x402470(,%rax,8)
   0x0000000000400f7c <+57>:    mov    $0xcf,%eax
   0x0000000000400f81 <+62>:    jmp    0x400fbe <phase_3+123>
   0x0000000000400f83 <+64>:    mov    $0x2c3,%eax
   0x0000000000400f88 <+69>:    jmp    0x400fbe <phase_3+123>
   0x0000000000400f8a <+71>:    mov    $0x100,%eax
   0x0000000000400f8f <+76>:    jmp    0x400fbe <phase_3+123>
   0x0000000000400f91 <+78>:    mov    $0x185,%eax
   0x0000000000400f96 <+83>:    jmp    0x400fbe <phase_3+123>
   0x0000000000400f98 <+85>:    mov    $0xce,%eax
   0x0000000000400f9d <+90>:    jmp    0x400fbe <phase_3+123>
   0x0000000000400f9f <+92>:    mov    $0x2aa,%eax
   0x0000000000400fa4 <+97>:    jmp    0x400fbe <phase_3+123>
   0x0000000000400fa6 <+99>:    mov    $0x147,%eax
   0x0000000000400fab <+104>:   jmp    0x400fbe <phase_3+123>
   0x0000000000400fad <+106>:   callq  0x40143a <explode_bomb>
   0x0000000000400fb2 <+111>:   mov    $0x0,%eax
   0x0000000000400fb7 <+116>:   jmp    0x400fbe <phase_3+123>
   0x0000000000400fb9 <+118>:   mov    $0x137,%eax
   0x0000000000400fbe <+123>:   cmp    0xc(%rsp),%eax
   0x0000000000400fc2 <+127>:   je     0x400fc9 <phase_3+134>
   0x0000000000400fc4 <+129>:   callq  0x40143a <explode_bomb>
   0x0000000000400fc9 <+134>:   add    $0x18,%rsp
   0x0000000000400fcd <+138>:   retq
```

开始还是有一样的套路，开始是两个整数

1. %rsp+0x8
2. $rsp+0xc

0x7 - ($rsp+0x8) <= 0
jmp (($rsp+0x8)*8 + 0x402470)

```
(gdb) x/8x 0x402470
0x402470:       0x0000000000400f7c      0x0000000000400fb9
0x402480:       0x0000000000400f83      0x0000000000400f8a
0x402490:       0x0000000000400f91      0x0000000000400f98
0x4024a0:       0x0000000000400f9f      0x0000000000400fa6
```

```
   0x0000000000400f7c <+57>:    mov    $0xcf,%eax
   0x0000000000400f81 <+62>:    jmp    0x400fbe <phase_3+123>
   0x0000000000400f83 <+64>:    mov    $0x2c3,%eax
   0x0000000000400f88 <+69>:    jmp    0x400fbe <phase_3+123>
   0x0000000000400f8a <+71>:    mov    $0x100,%eax
   0x0000000000400f8f <+76>:    jmp    0x400fbe <phase_3+123>
   0x0000000000400f91 <+78>:    mov    $0x185,%eax
   0x0000000000400f96 <+83>:    jmp    0x400fbe <phase_3+123>
   0x0000000000400f98 <+85>:    mov    $0xce,%eax
   0x0000000000400f9d <+90>:    jmp    0x400fbe <phase_3+123>
   0x0000000000400f9f <+92>:    mov    $0x2aa,%eax
   0x0000000000400fa4 <+97>:    jmp    0x400fbe <phase_3+123>
   0x0000000000400fa6 <+99>:    mov    $0x147,%eax
   0x0000000000400fab <+104>:   jmp    0x400fbe <phase_3+123>
   0x0000000000400fad <+106>:   callq  0x40143a <explode_bomb>
   0x0000000000400fb2 <+111>:   mov    $0x0,%eax
   0x0000000000400fb7 <+116>:   jmp    0x400fbe <phase_3+123>
=> 0x0000000000400fb9 <+118>:   mov    $0x137,%eax
```

根据 ($rsp+0x8) 的值来选择 $eax 的值

(%rsp+0xc) - $eax == 0

0 0xcf
1 0x137
2 0x2c3
3 0x100
4 0x185
5 0xce
6 0x2aa
7 0x147

0 207
1 311
2 707
3 256
4 389
5 206
6 682
7 327

## phase 4

```
Dump of assembler code for function phase_4:
=> 0x000000000040100c <+0>:     sub    $0x18,%rsp
   0x0000000000401010 <+4>:     lea    0xc(%rsp),%rcx
   0x0000000000401015 <+9>:     lea    0x8(%rsp),%rdx
   0x000000000040101a <+14>:    mov    $0x4025cf,%esi
   0x000000000040101f <+19>:    mov    $0x0,%eax
   0x0000000000401024 <+24>:    callq  0x400bf0 <__isoc99_sscanf@plt>
   0x0000000000401029 <+29>:    cmp    $0x2,%eax
   0x000000000040102c <+32>:    jne    0x401035 <phase_4+41>
   0x000000000040102e <+34>:    cmpl   $0xe,0x8(%rsp)
   0x0000000000401033 <+39>:    jbe    0x40103a <phase_4+46>
   0x0000000000401035 <+41>:    callq  0x40143a <explode_bomb>
   0x000000000040103a <+46>:    mov    $0xe,%edx
   0x000000000040103f <+51>:    mov    $0x0,%esi
   0x0000000000401044 <+56>:    mov    0x8(%rsp),%edi
   0x0000000000401048 <+60>:    callq  0x400fce <func4>
   0x000000000040104d <+65>:    test   %eax,%eax
   0x000000000040104f <+67>:    jne    0x401058 <phase_4+76>
   0x0000000000401051 <+69>:    cmpl   $0x0,0xc(%rsp)
   0x0000000000401056 <+74>:    je     0x40105d <phase_4+81>
   0x0000000000401058 <+76>:    callq  0x40143a <explode_bomb>
   0x000000000040105d <+81>:    add    $0x18,%rsp
   0x0000000000401061 <+85>:    retq
```

开始还是有一样的套路，开始是两个整数

1. %rsp+0x8
2. $rsp+0xc

0xe - (%rsp+0x8) <= 0
<= 14

fun4((%rsp+0x8),0x0,0xe) = 0
(%rsp+0xc) = 0

```
Dump of assembler code for function func4:
=> 0x0000000000400fce <+0>:     sub    $0x8,%rsp
   0x0000000000400fd2 <+4>:     mov    %edx,%eax
   0x0000000000400fd4 <+6>:     sub    %esi,%eax
   0x0000000000400fd6 <+8>:     mov    %eax,%ecx
   0x0000000000400fd8 <+10>:    shr    $0x1f,%ecx
   0x0000000000400fdb <+13>:    add    %ecx,%eax
   0x0000000000400fdd <+15>:    sar    %eax
   0x0000000000400fdf <+17>:    lea    (%rax,%rsi,1),%ecx
   0x0000000000400fe2 <+20>:    cmp    %edi,%ecx
   0x0000000000400fe4 <+22>:    jle    0x400ff2 <func4+36>
   0x0000000000400fe6 <+24>:    lea    -0x1(%rcx),%edx
   0x0000000000400fe9 <+27>:    callq  0x400fce <func4>
   0x0000000000400fee <+32>:    add    %eax,%eax
   0x0000000000400ff0 <+34>:    jmp    0x401007 <func4+57>
   0x0000000000400ff2 <+36>:    mov    $0x0,%eax
   0x0000000000400ff7 <+41>:    cmp    %edi,%ecx
   0x0000000000400ff9 <+43>:    jge    0x401007 <func4+57>
   0x0000000000400ffb <+45>:    lea    0x1(%rcx),%esi
   0x0000000000400ffe <+48>:    callq  0x400fce <func4>
   0x0000000000401003 <+53>:    lea    0x1(%rax,%rax,1),%eax
   0x0000000000401007 <+57>:    add    $0x8,%rsp
   0x000000000040100b <+61>:    retq
```

瞎猜一下 "0 0", 竟然过了
不过也是根据已有的信息， a <= 14, b = 0

```
function fun4(a, b, c){
   val0 = c - b
   val1 = val0 >> 0x1f
   val0 += val1
   val0 >>>= 1
   val1 = val0 + b

   if a <= val1 {
      val0 = 0
      if a >= val1 {
         return val0;
      }
      b = val1 + 1
      func()
      val0 = 1
      return val0
   } else {
      c = val1 - 1
      func()
      val0 += val0
      return val0
   }

   return val0
}
```

```
val0 = c - b
val1 = val0 >> 0x1f
val0 += val1
val0 >>>= 1
val1 = val0 + b
```

也是看一会不知道是干嘛，以为是很复杂，突然想起来了。其实就是相当于 /2
CSAPP 里浮点数表示之前有一节讲过， val1 取出符号位，作为 /2 的一个偏移。
val0 再用算术位移，就可以同时支持正数和负数的 floor。

so val0 = floor((c-b)/2)， val1 = floor((b+c)/2)

可以看出， a == val1 时，就可以直接返回 0

而 val1 一开始是7, 而且会一直做类似二分搜索类似的递归。

所以输入 "[0-7] 0" 都可以过

我把 cmp 的参数顺序搞反， 但是这样竟然得出了正确的结论，真神奇

## phase 5

```
Dump of assembler code for function phase_5:
=> 0x0000000000401062 <+0>:     push   %rbx
   0x0000000000401063 <+1>:     sub    $0x20,%rsp
   0x0000000000401067 <+5>:     mov    %rdi,%rbx
   0x000000000040106a <+8>:     mov    %fs:0x28,%rax
   0x0000000000401073 <+17>:    mov    %rax,0x18(%rsp)
   0x0000000000401078 <+22>:    xor    %eax,%eax
   0x000000000040107a <+24>:    callq  0x40131b <string_length>
   0x000000000040107f <+29>:    cmp    $0x6,%eax
   0x0000000000401082 <+32>:    je     0x4010d2 <phase_5+112>
   0x0000000000401084 <+34>:    callq  0x40143a <explode_bomb>
   0x0000000000401089 <+39>:    jmp    0x4010d2 <phase_5+112>
   0x000000000040108b <+41>:    movzbl (%rbx,%rax,1),%ecx
   0x000000000040108f <+45>:    mov    %cl,(%rsp)
   0x0000000000401092 <+48>:    mov    (%rsp),%rdx
   0x0000000000401096 <+52>:    and    $0xf,%edx
   0x0000000000401099 <+55>:    movzbl 0x4024b0(%rdx),%edx
   0x00000000004010a0 <+62>:    mov    %dl,0x10(%rsp,%rax,1)
   0x00000000004010a4 <+66>:    add    $0x1,%rax
   0x00000000004010a8 <+70>:    cmp    $0x6,%rax
   0x00000000004010ac <+74>:    jne    0x40108b <phase_5+41>
   0x00000000004010ae <+76>:    movb   $0x0,0x16(%rsp)
   0x00000000004010b3 <+81>:    mov    $0x40245e,%esi
   0x00000000004010b8 <+86>:    lea    0x10(%rsp),%rdi
   0x00000000004010bd <+91>:    callq  0x401338 <strings_not_equal>
   0x00000000004010c2 <+96>:    test   %eax,%eax
   0x00000000004010c4 <+98>:    je     0x4010d9 <phase_5+119>
   0x00000000004010c6 <+100>:   callq  0x40143a <explode_bomb>
   0x00000000004010cb <+105>:   nopl   0x0(%rax,%rax,1)
   0x00000000004010d0 <+110>:   jmp    0x4010d9 <phase_5+119>
   0x00000000004010d2 <+112>:   mov    $0x0,%eax
   0x00000000004010d7 <+117>:   jmp    0x40108b <phase_5+41>
   0x00000000004010d9 <+119>:   mov    0x18(%rsp),%rax
   0x00000000004010de <+124>:   xor    %fs:0x28,%rax
   0x00000000004010e7 <+133>:   je     0x4010ee <phase_5+140>
   0x00000000004010e9 <+135>:   callq  0x400b30 <__stack_chk_fail@plt>
   0x00000000004010ee <+140>:   add    $0x20,%rsp
   0x00000000004010f2 <+144>:   pop    %rbx
   0x00000000004010f3 <+145>:   retq
```

首先 断言了输入长度为6
然后是一个循环

```
   0x000000000040108b <+41>:    movzbl (%rbx,%rax,1),%ecx
   0x000000000040108f <+45>:    mov    %cl,(%rsp)
   0x0000000000401092 <+48>:    mov    (%rsp),%rdx
   0x0000000000401096 <+52>:    and    $0xf,%edx
   0x0000000000401099 <+55>:    movzbl 0x4024b0(%rdx),%edx
   0x00000000004010a0 <+62>:    mov    %dl,0x10(%rsp,%rax,1)
   0x00000000004010a4 <+66>:    add    $0x1,%rax
   0x00000000004010a8 <+70>:    cmp    $0x6,%rax
   0x00000000004010ac <+74>:    jne    0x40108b <phase_5+41>
```

%cl 和 $dl 还挺迷惑的，其实他们是通用寄存器的低8位部分

eax -> ah al
ebx -> bh bl
ecx -> ch cl
edx -> dh dl

x 是32bit, h 是 16, l 是 8。 感觉也都是历史遗留，rsi rdi r8-15 这种就没有符合规则

$0x40245e = "flyers"
然后比较字符串，需要他们相等

0x10(%rsp) == $0x40245e
$0x4024b0 = "maduiersnfotvbylSo you think you can stop the bomb with ctrl-c, do you?"

rax -> 0:6
(0x4024b0 + (inp[i] & 0xf)) == "flyers"[i]

```
In [1]: s = "maduiersnfotvbylSo you think you can stop the bomb with ctrl-c, do you?"

In [2]: t = "flyers"

In [3]: for i in range(len(t)):
   ...:     print(s.find(t[i]))
   ...:
9
15
14
5
6
7

In [4]: [s.find(t[i]) for i in range(len(t))]
Out[4]: [9, 15, 14, 5, 6, 7]
```

我找到了符合的字节序列，但是似乎不能编码成可见字符
也许可以加个偏移，反正有这个 inp[i] & 0xf

```
In [16]: [bytes(map(lambda x: x+0x10*i,result)).decode("ascii")  for i in range(8)]
Out[16]:
['\t\x0f\x0e\x05\x06\x07',
 '\x19\x1f\x1e\x15\x16\x17',
 ")/.%&'",
 '9?>567',
 'IONEFG',
 'Y_^UVW',
 'ionefg',
 'y\x7f~uvw']
```

## phase 6

最后一个，很长了

```
Dump of assembler code for function phase_6:
=> 0x00000000004010f4 <+0>:     push   %r14
   0x00000000004010f6 <+2>:     push   %r13
   0x00000000004010f8 <+4>:     push   %r12
   0x00000000004010fa <+6>:     push   %rbp
   0x00000000004010fb <+7>:     push   %rbx
   0x00000000004010fc <+8>:     sub    $0x50,%rsp
   0x0000000000401100 <+12>:    mov    %rsp,%r13
   0x0000000000401103 <+15>:    mov    %rsp,%rsi
   0x0000000000401106 <+18>:    callq  0x40145c <read_six_numbers>
   0x000000000040110b <+23>:    mov    %rsp,%r14
   0x000000000040110e <+26>:    mov    $0x0,%r12d
   0x0000000000401114 <+32>:    mov    %r13,%rbp
   0x0000000000401117 <+35>:    mov    0x0(%r13),%eax
   0x000000000040111b <+39>:    sub    $0x1,%eax
   0x000000000040111e <+42>:    cmp    $0x5,%eax
   0x0000000000401121 <+45>:    jbe    0x401128 <phase_6+52>
   0x0000000000401123 <+47>:    callq  0x40143a <explode_bomb>
   0x0000000000401128 <+52>:    add    $0x1,%r12d
   0x000000000040112c <+56>:    cmp    $0x6,%r12d
   0x0000000000401130 <+60>:    je     0x401153 <phase_6+95>
   0x0000000000401132 <+62>:    mov    %r12d,%ebx
   0x0000000000401135 <+65>:    movslq %ebx,%rax
   0x0000000000401138 <+68>:    mov    (%rsp,%rax,4),%eax
   0x000000000040113b <+71>:    cmp    %eax,0x0(%rbp)
   0x000000000040113e <+74>:    jne    0x401145 <phase_6+81>
   0x0000000000401140 <+76>:    callq  0x40143a <explode_bomb>
   0x0000000000401145 <+81>:    add    $0x1,%ebx
   0x0000000000401148 <+84>:    cmp    $0x5,%ebx
   0x000000000040114b <+87>:    jle    0x401135 <phase_6+65>
   0x000000000040114d <+89>:    add    $0x4,%r13
   0x0000000000401151 <+93>:    jmp    0x401114 <phase_6+32>
   0x0000000000401153 <+95>:    lea    0x18(%rsp),%rsi
   0x0000000000401158 <+100>:   mov    %r14,%rax
   0x000000000040115b <+103>:   mov    $0x7,%ecx
   0x0000000000401160 <+108>:   mov    %ecx,%edx
   0x0000000000401162 <+110>:   sub    (%rax),%edx
   0x0000000000401164 <+112>:   mov    %edx,(%rax)
   0x0000000000401166 <+114>:   add    $0x4,%rax
   0x000000000040116a <+118>:   cmp    %rsi,%rax
   0x000000000040116d <+121>:   jne    0x401160 <phase_6+108>
   0x000000000040116f <+123>:   mov    $0x0,%esi
   0x0000000000401174 <+128>:   jmp    0x401197 <phase_6+163>
   0x0000000000401176 <+130>:   mov    0x8(%rdx),%rdx
   0x000000000040117a <+134>:   add    $0x1,%eax
   0x000000000040117d <+137>:   cmp    %ecx,%eax
   0x000000000040117f <+139>:   jne    0x401176 <phase_6+130>
   0x0000000000401181 <+141>:   jmp    0x401188 <phase_6+148>
   0x0000000000401183 <+143>:   mov    $0x6032d0,%edx
   0x0000000000401188 <+148>:   mov    %rdx,0x20(%rsp,%rsi,2)
   0x000000000040118d <+153>:   add    $0x4,%rsi
   0x0000000000401191 <+157>:   cmp    $0x18,%rsi
   0x0000000000401195 <+161>:   je     0x4011ab <phase_6+183>
   0x0000000000401197 <+163>:   mov    (%rsp,%rsi,1),%ecx
   0x000000000040119a <+166>:   cmp    $0x1,%ecx
   0x000000000040119d <+169>:   jle    0x401183 <phase_6+143>
   0x000000000040119f <+171>:   mov    $0x1,%eax
   0x00000000004011a4 <+176>:   mov    $0x6032d0,%edx
   0x00000000004011a9 <+181>:   jmp    0x401176 <phase_6+130>
   0x00000000004011ab <+183>:   mov    0x20(%rsp),%rbx
   0x00000000004011b0 <+188>:   lea    0x28(%rsp),%rax
   0x00000000004011b5 <+193>:   lea    0x50(%rsp),%rsi
   0x00000000004011ba <+198>:   mov    %rbx,%rcx
   0x00000000004011bd <+201>:   mov    (%rax),%rdx
   0x00000000004011c0 <+204>:   mov    %rdx,0x8(%rcx)
   0x00000000004011c4 <+208>:   add    $0x8,%rax
   0x00000000004011c8 <+212>:   cmp    %rsi,%rax
   0x00000000004011cb <+215>:   je     0x4011d2 <phase_6+222>
   0x00000000004011cd <+217>:   mov    %rdx,%rcx
   0x00000000004011d0 <+220>:   jmp    0x4011bd <phase_6+201>
   0x00000000004011d2 <+222>:   movq   $0x0,0x8(%rdx)
   0x00000000004011da <+230>:   mov    $0x5,%ebp
   0x00000000004011df <+235>:   mov    0x8(%rbx),%rax
   0x00000000004011e3 <+239>:   mov    (%rax),%eax
   0x00000000004011e5 <+241>:   cmp    %eax,(%rbx)
   0x00000000004011e7 <+243>:   jge    0x4011ee <phase_6+250>
   0x00000000004011e9 <+245>:   callq  0x40143a <explode_bomb>
   0x00000000004011ee <+250>:   mov    0x8(%rbx),%rbx
   0x00000000004011f2 <+254>:   sub    $0x1,%ebp
   0x00000000004011f5 <+257>:   jne    0x4011df <phase_6+235>
   0x00000000004011f7 <+259>:   add    $0x50,%rsp
   0x00000000004011fb <+263>:   pop    %rbx
   0x00000000004011fc <+264>:   pop    %rbp
   0x00000000004011fd <+265>:   pop    %r12
   0x00000000004011ff <+267>:   pop    %r13
   0x0000000000401201 <+269>:   pop    %r14
   0x0000000000401203 <+271>:   retq
```

`size_t read_six_numbers(char*, int*)`

6个数 < 6
互相都不相同

i > 0:6
inp[i] = 0x7 - inp[i]

感觉咱一下看不了那么长的

```
   0x000000000040116f <+123>:   mov    $0x0,%esi
   0x0000000000401174 <+128>:   jmp    0x401197 <phase_6+163>
   0x0000000000401176 <+130>:   mov    0x8(%rdx),%rdx
   0x000000000040117a <+134>:   add    $0x1,%eax
   0x000000000040117d <+137>:   cmp    %ecx,%eax
   0x000000000040117f <+139>:   jne    0x401176 <phase_6+130>
   0x0000000000401181 <+141>:   jmp    0x401188 <phase_6+148>
   0x0000000000401183 <+143>:   mov    $0x6032d0,%edx
   0x0000000000401188 <+148>:   mov    %rdx,0x20(%rsp,%rsi,2)
   0x000000000040118d <+153>:   add    $0x4,%rsi
   0x0000000000401191 <+157>:   cmp    $0x18,%rsi
   0x0000000000401195 <+161>:   je     0x4011ab <phase_6+183>
   0x0000000000401197 <+163>:   mov    (%rsp,%rsi,1),%ecx
   0x000000000040119a <+166>:   cmp    $0x1,%ecx
   0x000000000040119d <+169>:   jle    0x401183 <phase_6+143>
   0x000000000040119f <+171>:   mov    $0x1,%eax
   0x00000000004011a4 <+176>:   mov    $0x6032d0,%edx
   0x00000000004011a9 <+181>:   jmp    0x401176 <phase_6+130>
   0x00000000004011ab <+183>:   mov    0x20(%rsp),%rbx
```

```
rsi 0x0:0x4:0x18 {
    ecx = (rsp+rsi) // inp[i]
    edx = 0x6032d0

    if ecx > 0x1 {
        eax = 0x1:ecx {
            rdx = (0x8+rdx)
            eax ++
        }
    }

    (rsp+0x20+rsi*2) = rdx
}
```

rdx = (0x8+rdx) 这像链表
(rsp+0x20+rsi*2) = rdx
rsp+0x20+0x0  = linklist.get(0x7-inp[0])
rsp+0x20+0x8  = linklist.get(0x7-inp[1])
rsp+0x20+0x10 = linklist.get(0x7-inp[2])
rsp+0x20+0x18 = linklist.get(0x7-inp[3])
rsp+0x20+0x20 = linklist.get(0x7-inp[4])
rsp+0x20+0x28 = linklist.get(0x7-inp[5])

```
(gdb) x/28wx 0x6032d0
0x6032d0 <node1>:       0x0000014c      0x00000001      0x006032e0      0x00000000
0x6032e0 <node2>:       0x000000a8      0x00000002      0x006032f0      0x00000000
0x6032f0 <node3>:       0x0000039c      0x00000003      0x00603300      0x00000000
0x603300 <node4>:       0x000002b3      0x00000004      0x00603310      0x00000000
0x603310 <node5>:       0x000001dd      0x00000005      0x00603320      0x00000000
0x603320 <node6>:       0x000001bb      0x00000006      0x00000000      0x00000000
```

+8 刚好可以访问到第三列的地址

```
   0x00000000004011ab <+183>:   mov    0x20(%rsp),%rbx
   0x00000000004011b0 <+188>:   lea    0x28(%rsp),%rax
   0x00000000004011b5 <+193>:   lea    0x50(%rsp),%rsi
   0x00000000004011ba <+198>:   mov    %rbx,%rcx
   0x00000000004011bd <+201>:   mov    (%rax),%rdx
   0x00000000004011c0 <+204>:   mov    %rdx,0x8(%rcx)
   0x00000000004011c4 <+208>:   add    $0x8,%rax
   0x00000000004011c8 <+212>:   cmp    %rsi,%rax
   0x00000000004011cb <+215>:   je     0x4011d2 <phase_6+222>
   0x00000000004011cd <+217>:   mov    %rdx,%rcx
   0x00000000004011d0 <+220>:   jmp    0x4011bd <phase_6+201>
   0x00000000004011d2 <+222>:   movq   $0x0,0x8(%rdx)
   0x00000000004011da <+230>:   mov    $0x5,%ebp
   0x00000000004011df <+235>:   mov    0x8(%rbx),%rax
   0x00000000004011e3 <+239>:   mov    (%rax),%eax
   0x00000000004011e5 <+241>:   cmp    %eax,(%rbx)
   0x00000000004011e7 <+243>:   jge    0x4011ee <phase_6+250>
   0x00000000004011e9 <+245>:   callq  0x40143a <explode_bomb>
   0x00000000004011ee <+250>:   mov    0x8(%rbx),%rbx
   0x00000000004011f2 <+254>:   sub    $0x1,%ebp
   0x00000000004011f5 <+257>:   jne    0x4011df <phase_6+235>
```

```
rbx = list[0]
rax = &list[1]
rsi = rsp+0x50 // may be end
rcx = rbx

rax = (rsp+0x28):0x8:(rsp+0x50) {
    rdx = (rax)
    (rcx+0x8) = rdx //? list[i].next = list[i+1]
    rcx = rdx
}

(rdx+8) = 0x0 //? listlast.next = null

ebp = 5:0 {
    rax = (rbx + 0x8)
    eax = (rax)
    if eax > (rbx) {
        explode_bomb()
    }
    rbx = (rbx + 0x8)
}

```

绕得有点心态崩

2 1 6 5 4 3

5 6 1 2 3 4

4 3 2 1 6 5

OK, 顺序还搞反了一遍

cmp 傻傻搞不清楚
