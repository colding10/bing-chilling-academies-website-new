---
title: "Scrambled Packets"
ctfName: "TexSAW CTF 2025"
date: "2025-04-13"
tags: ["forensics"]
description: "yet another wireshark challenge, find the exfiltrated data"
author: "cold"
---

## Challenge description

> I accidentally broke my message and it got all mixed up with everything else. Can you help me get it back?
>
> flag format: TexSAW{flag}
>
> [download pcap here](/api/writeup-assets/texsaw2025/scrambledpackets/cap.pcap)

## solvepath

we look in wireshark to see that there are a lot of **ICMP** pings.
looking through a few of them, we see that some of them have sussy **1 byte data** so we extract those using `tshark`, and realize that its junk :(.

lmao it was scrambled, so we sort it by **sequence number** using this command:
`tshark -r cap.pcap -Y "icmp && data.len == 1" -T fields -e icmp.seq -e data | sort -n -k1`

## flag

and by using that (and converting to ASCII) we get the flag

`TexSAW{not_the_fake_one}`
