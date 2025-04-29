---
title: "Weird Disk Image"
ctfName: "Incognito 6.0 CTF"
date: "2025-04-28"
tags: ["forensics"]
description: "linux attributes, strings best command"
author: "cold"
---

## Challenge Description

Think you got what it takes to crack this disk image that has been carefully crafted with layers of obfuscation, designed to mislead even the most seasoned player?

_not including file cuz that chall was not that good_

## Solvepath

so you could mount the filesystem, or use something like **thesleuthkit** to look at attributes, but im lazy.
so i just used `strings` command, from that we can find the encryption key `r3c0nn3ct_th3_gr1d`.

now, we just need to look for a ciphertext, there are bunch of ELF binaries, we use `strings` on all of them until we find some suspicious binary text.

decode binary -> xor with key `r3c0nn3ct_th3_gr1d` -> that's literally it.

## flag

`ictf{f477r_cr4ck3d_1n_s3c0nd5}`

_this ctf was pretty buns imo so rlly low effort wu_
