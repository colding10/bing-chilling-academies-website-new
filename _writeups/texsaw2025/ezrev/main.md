---
title: "ez_rev"
ctfName: "TexSAW CTF 2025"
date: "2025-04-13"
tags: ["reverse"]
description: "ocaml binaries are cancerous - gdb carries"
author: "cold"
---

## Challenge Description

> easy-rev: functional edition (with all new (old) list module!)

_wow so helpful_
[download binary here](/api/writeup-assets/texsaw2025/ezrev/easy_rev)

## Solvepath

opening the binary in Ghidra, we see a lot of OCaml functions, so its quite hard to study it and reverse engineer. it even look a bit of time to find the main function, until i finally found this function (and realized that the binary functions start with `camlEasy_rev__entry`)

here is the dissassembly of the main function

```cpp
void camlEasy_rev__entry(void)

{
  undefined8 extraout_RAX;
  undefined8 extraout_RAX_00;
  undefined8 extraout_RAX_01;
  undefined8 *extraout_RAX_02;

  camlEasy_rev = &camlEasy_rev__10;
  DAT_001a5e20 = &camlEasy_rev__20;
  DAT_001a5e28 = &camlEasy_rev__30;
  camlStdlib__$40_198();
  camlStdlib__$40_198();
  DAT_001a5e38 = &camlEasy_rev__38;
  DAT_001a5e30 = extraout_RAX;
  camlStdlib__List__map_482();
  DAT_001a5e40 = extraout_RAX_00;
  camlStdlib__List__fold_left_521();
  DAT_001a5e48 = extraout_RAX_01;
  camlStdlib__Printf__fprintf_422();
  (*(code *)*extraout_RAX_02)();
  return;
}
```

also, when we run the binary, we see the output **sum of all flag elements: 2836**. this suggest that we have a list of the flag's ascii charcodes, and we are summing and outputting it.

so, the function `camlStdlib__List__fold_left_521` is hella sus. you probably cld continue w/ static dissassembly but atp i got bored and moved to gdb to write this script to solve

## gdb solve script

```cpp
set pagination off
break camlStdlib__List__fold_left_521
commands
  printf "---- FOLD ENTER ----\n"
  printf "RDI: 0x%lx\n", $rdi
  printf "RAX: 0x%lx\n", $rax
  continue
end

break *camlStdlib__List__fold_left_521+52
commands
  printf "Element: %d (0x%lx)\n", (($rbx - 1) >> 1), $rbx
  printf "New acc: %d (0x%lx)\n", (($rax - 1) >> 1), $rax
  continue
end

run
```

## flag

reading through and converting from char code we get the flag
`texsaw{a_b1t_0f_0c4ml_r3v3rs3}`
