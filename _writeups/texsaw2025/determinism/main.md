---
title: "Determinism"
ctfName: "TexSAW CTF 2025"
date: "2025-04-13"
tags: ["misc", "math"]
description: "a formal proof that the small-step operational semantics for simply-typed lambda calculus (STLC) is deterministic"
author: "tien"
---

## Challenge description

Write a formal proof that the small-step operational semantics for simply-typed lambda calculus (STLC) is deterministic.

- Assume call-by-value semantics
- "Deterministic" means that if a program at state `X` can step into state `Y1`, and it can step into state Y2, then it must be that `Y1 = Y2`. For example,
  `X = (lambda x:Nat. x + 3) 5`
  It is clear that `X` can only step to the state `5 + 3` after beta-reduction. If you had assumed that `X` stepped to some arbitrary state `Y1`, or to another arbitrary state `Y2`, it is necessary that `Y1 = Y2 = 5 + 3`.

- Submissions deemed to be the output of a large language model will result in all further submissions for this challenge being ignored

## solution

tien did this so im js gonna upload his pdf here
[download here](/api/writeup-assets/texsaw2025/determinism/determinism.pdf)

orz math orz tien
