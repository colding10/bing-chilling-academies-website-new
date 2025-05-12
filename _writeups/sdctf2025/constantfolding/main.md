---
title: "Constant Folding"
ctfName: "SDCTF 2025"
date: "2025-05-11"
tags: ["reverse"]
description: "reverse-engineering constant-folding"
author: "cold"
---

## Challenge Description

> I just finished writing my very own super secret encryption program. I'm so confident in its security that I'll give you the binary and the output of my program! Bet you can't figure out the secret I gave it >:)
>
> Output of the program: bypkrpihayqo
>
> Note: put the input to the program inside sdctf{} before submitting
> [provided binary here](/api/writeup-assets/sdctf2025/constantfolding/constant_folding)

## Solvepath

We were given a program script and asked to find an input string such that:

```python
encrypt(input) == "bypkrpihayqo"
```

## Summary of the Script

### Dissassembly

```cpp
000017c5  int32_t main(int32_t argc, char** argv, char** envp)
000017f1      int64_t var_70 = 0xc
00001808      int64_t rax_1 = 0x1c
00001810      int64_t rdx = 0
0000181c      void* buf = &var_78 - divu.dp.q(rdx:rax_1, 0x10) * 0x10
00001835      printf(format: "Enter your secret: ", argv, modu.dp.q(rdx:rax_1, 0x10), 0x10)
00001852      fgets(buf, n: 0xd, fp: __TMC_END__)
0000186c      int64_t var_60 = 0x54
000018b6      void* rsp = buf - divu.dp.q(0:0x64, 0x10) * 0x10
000018c7      gen_padding(rsp)
000018da      int64_t var_50 = 0x60
00001905      void* rsp_1 = rsp - divu.dp.q(0:0x70, 0x10) * 0x10
0000191d      strcpy(rsp_1, buf)
00001930      strcat(rsp_1, rsp)
00001943      int64_t var_40 = 0x60
0000196e      void* rsp_2 = rsp_1 - divu.dp.q(0:0x70, 0x10) * 0x10
00001986      shuffle(rsp_1, rsp_2)
00001999      int64_t var_30 = 0xc
000019c4      void* rsp_3 = rsp_2 - divu.dp.q(0:0x1c, 0x10) * 0x10
000019dc      fold(rsp_2, rsp_3)
000019f7      printf(format: "Your processed secret: %s\n", rsp_3)

00001189  int64_t gen_padding(int64_t arg1)

00001195      void* fsbase
00001195      int64_t rax = *(fsbase + 0x28)
000011ae      int64_t var_1d
000011ae      __builtin_strcpy(dest: &var_1d, src: "jvucsiwfaebq")
000011ae
00001255      for (int32_t i = 0; i s<= 6; i += 1)
0000124b          for (int32_t j = 0; j s< 0xc; j += 1)
0000123d              *(sx.q(j + 0xc * i) + arg1) = ((sx.d(*(&var_1d + sx.q(j))) - 0x61) * j * (i + 3) s% 0x1a).b + 0x61

00001272  char* shuffle(void* arg1, void* arg2)
0000127e      int32_t var_c = 0
0000127e
000012ca      for (int32_t i = 0; i s< 0x60; i += 1)
000012bc          *(arg2 + sx.q(i)) = *(arg1 + sx.q(mods.dp.d(sx.q(i * 0x11), 0x60)))
000012bc
000012db      *(arg2 + 0x60) = 0
000012e0      return arg2 + 0x60


000012e1  int64_t fold(char* arg1, void* arg2)
000012fb      int64_t rax = *(fsbase + 0x28)
0000131e      int32_t var_ac = 0x30
00001333      int32_t var_a8 = 0x18
00001348      int32_t var_a4 = 0xc
0000135b      int64_t var_a0 = 0x2f
00001381      void* rsp = &var_c8 - divu.dp.q(0:0x3f, 0x10) * 0x10
0000139b      int64_t var_90 = 0x2f
000013c1      void* rsp_1 = rsp - divu.dp.q(0:0x3f, 0x10) * 0x10
000013d8      int64_t var_80 = 0x2f
000013fb      void* rsp_2 = rsp_1 - divu.dp.q(0:0x3f, 0x10) * 0x10
00001422      strncpy(rsp, arg1, 0x30)
0000144d      strncpy(rsp_1, &arg1[sx.q(var_ac)], sx.q(var_ac))
0000144d
000014d7      for (int32_t i = 0; i s< var_ac; i += 1)
000014c1          *(rsp_2 + sx.q(i)) = ((sx.d(*(rsp_1 + sx.q(i))) - 0x61 + sx.d(*(rsp + sx.q(i))) - 0x61) s% 0x1a).b + 0x61
000014c1
000014e6      int64_t var_70 = sx.q(var_a8) - 1
00001509      void* rsp_3 = rsp_2 - divu.dp.q(0:(sx.q(var_a8) + 0xf), 0x10) * 0x10
00001520      int64_t var_60 = sx.q(var_a8) - 1
00001543      void* rsp_4 = rsp_3 - divu.dp.q(0:(sx.q(var_a8) + 0xf), 0x10) * 0x10
00001549      char* var_58 = rsp_4
0000155a      int64_t var_50 = sx.q(var_a8) - 1
0000157d      void* rsp_5 = rsp_4 - divu.dp.q(0:(sx.q(var_a8) + 0xf), 0x10) * 0x10
0000159e      strncpy(rsp_3, rsp_2, sx.q(var_a8))
000015c6      strncpy(var_58, sx.q(var_a8) + rsp_2, sx.q(var_a8))
000015c6
0000164d      for (int32_t i_1 = 0; i_1 s< var_a8; i_1 += 1)
00001637          *(rsp_5 + sx.q(i_1)) = ((sx.d(var_58[sx.q(i_1)]) - 0x61 + sx.d(*(rsp_3 + sx.q(i_1))) - 0x61) s% 0x1a).b + 0x61
00001637
0000165c      int64_t var_40 = sx.q(var_a4) - 1
0000167f      void* rsp_6 = rsp_5 - divu.dp.q(0:(sx.q(var_a4) + 0xf), 0x10) * 0x10
00001696      int64_t var_30 = sx.q(var_a4) - 1
000016bf      char* var_28 = rsp_6 - divu.dp.q(0:(sx.q(var_a4) + 0xf), 0x10) * 0x10
000016da      strncpy(rsp_6, rsp_5, sx.q(var_a4))
00001702      strncpy(var_28, sx.q(var_a4) + rsp_5, sx.q(var_a4))
00001702
0000178f      for (int32_t i_2 = 0; i_2 s< var_a4; i_2 += 1)
0000177a          *(var_c8 + sx.q(i_2)) = ((sx.d(var_28[sx.q(i_2)]) - 0x61 + sx.d(*(rsp_6 + sx.q(i_2))) - 0x61) s% 0x1a).b + 0x61
0000177a
000017a4      *(var_c8 + sx.q(var_a4)) = 0
000017ba      __stack_chk_fail()
000017ba      noreturn
```

The binary contains a few key functions:

- `generate_padding()`: produces a fixed 84-character padding string from a hardcoded source "jvucsiwfaebq".
- `shuffle(buffer)`: reorders a 96-character buffer based on some indices, call that `SHUFFLE_INDICES`.
- `fold(buffer)`: compresses the buffer from 96 → 48 → 24 → 12 characters using mod-26 character addition.
- `main(input)`: applies padding, shuffle, then fold to return a final 12-character string.

It's trivial to attempt a brute force. But, the brute-force method is clearly inefficient, so we analyze and reverse the operations.

## Understanding Shuffle

`SHUFFLE_INDICES[i] = (i * 17) % 96` for `i` in `0..95`

Since 17 is coprime to 96, the mapping is bijective and thus reversible. To invert:

```python
reverse_shuffle[i] = j # where SHUFFLE_INDICES[j] = i
# that is:
reverse_shuffle[SHUFFLE_INDICES[i]] = i
```

More compactly, since 17 \* 17 ≡ 1 mod 96, the modular inverse of 17 mod 96 is 17. So to reverse:

```python
original[j] = shuffled[(j * 17) % 96]
```

This lets us reconstruct the original input+padding buffer from a shuffled one.

## Understanding Fold

Folding is a 3-step reduction:

1. Fold 96 → 48:
   `folded[i] = (ord(S[i]) + ord(S[i+48]) - 194) % 26 + 97`
2. Fold 48 → 24:
   same pattern on result
3. Fold 24 → 12:
   same again to produce final string

Each final output character is a linear combination of 8 shuffled characters:

```python
fold3[m] = (S[m] + S[m+12] + S[m+24] + S[m+36] + S[m+48] + S[m+60] + S[m+72] + S[m+84]) % 26
```

Each `S[i]` maps to either:

- An input character (if SHUFFLE_INDICES[i] < 12), or
- A known padding character (SHUFFLE_INDICES[i] ≥ 12 → padding[SHUFFLE_INDICES[i] - 12])

This allows us to express each fold3[i] (i.e., target character) as a linear sum of one unknown and 7 knowns.

## Solution Strategy

1. For each i in 0..11 (target character):

   - Identify the 8 contributing positions in the shuffled buffer: i, i+12, ..., i+84
   - For each, map SHUFFLE_INDICES[pos]
   - If SHUFFLE_INDICES[pos] < 12 → input[SHUFFLE_INDICES[pos]] is unknown
   - Otherwise → add padding value to sum

2. Each target character gives a direct equation:
   x_k = (target_val - sum_of_padding_contributions) % 26

3. Construct input string from x_0 .. x_11

## Solution Code

```python
import string

# Precomputed padding generation
def generate_padding():
    src = "jvucsiwfaebq"
    padding = []
    for i in range(7):  # 0-6 inclusive (7 rows)
        for j in range(12):
            c = ord(src[j]) - ord('a')
            val = (c * j * (i + 3)) % 26
            padding.append(chr(val + ord('a')))
    return ''.join(padding)

PADDING = generate_padding()
SHUFFLE_INDICES = [(i * 17) % 96 for i in range(96)]

def compute_input_vars(target):
    input_chars = [None] * 12
    target_nums = [ord(c) - ord('a') for c in target]

    for m in range(12):
        sum_padding = 0
        input_idx = None
        for k in range(8):
            i = m + 12 * k
            buffer_idx = SHUFFLE_INDICES[i]
            if buffer_idx < 12:
                input_idx = buffer_idx
            else:
                pad_val = ord(PADDING[buffer_idx - 12]) - ord('a')
                sum_padding += pad_val
        if input_idx is None:
            raise Exception("No input variable found")
        input_val = (target_nums[m] - sum_padding) % 26
        input_chars[input_idx] = chr(input_val + ord('a'))

    return ''.join(input_chars)

TARGET = "bypkrpihayqo"
secret = compute_input_vars(TARGET)
print("Secret:", secret)
```

## Result

Running the above returns the 12-character secret input that produces the encrypted target "brassicarulz".

_it's sure a hell of a lot faster than the probably 500 years needed to brute-force LMAO_
![image](/api/writeup-assets/sdctf2025/constantfolding/ss.png)

No brute-force required; we reverse-engineered the constant-folded structure mathematically.

**flag is:** `sdctf{brassicarulz}`.

## Final Thoughts

Instead of blindly brute-forcing, we recognize structure in the transformations (especially the fold’s linear nature and the shuffle's bijective mapping), and turn the encryption into a solvable system of modular equations.

Simple linear algebra over Z/26Z beats brute force.
