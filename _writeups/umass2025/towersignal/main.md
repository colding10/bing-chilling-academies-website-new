---
title: "Tower Signal"
ctfName: "UMass CTF 2025"
date: "2025-04-20"
tags: ["misc"]
description: "use minimodem to extract data from beep bloop with music over it"
author: "cold & appllo & tien"
---

## Challenge Description

A glitched tower is still transmitting bursts of scrambled config data through its last known soundtrack. The signal isn’t digital — it’s modulated. Different baud rates. One forgotten directive.

Files:

[last_output.wav](/api/writeup-assets/umass2025/towersignal/last_output.wav)

## Solvepath

Listening to the audio, we do hear some music, then a unique beeping sound. Looking at the additional tags on the challenge, we see there is a mention of `minimodem`. A quick search gives us this [helpful youtube video](https://www.youtube.com/watch?v=pwuyMJfyNmY).

So, **the solvepath we visualized is cleaning up the audio to extract the minimodem sounds, then using the minimodem program to decode the flag**.

### attempting to decode

If you just try to use `minimodem`, we get a lot of junk. This is because there's some music playing over the minimodem sounds.

But at least during initial testing I figured out to use `minimodem`, you just do this: `minimodem --rx 100 -f freq2_1a.wa`. And, it's important to note that **the baud rate** must be adjusted to match the baud rate of the transmission. *it's 100 in the example command*

### Processing the audio

since I suck at manipulating audio, appllo can carry me here:
![iamge1](/api/writeup-assets/umass2025/towersignal/image1.png)

after a bit of trial and error, he actually fed me the cleaned up audio from the first and second transmissions in the wav.

### decoding

after fiddling with baud rate, we extracted this

* `XzA0ID0gWDNSdmR3bz0KVEFHXzAxID0gVTN0bWJBbz0KVEFHXzA2ID0gWlhKMGVnbz0KVEFHXzAz` *baud rate 50*
* `VEFHXzA1ID0gWlhKZmFBbz0KVEFHXzAyID0gWV=�3bz0KVEFHXzAwID0gVlUxQlV3bz0KVEFH` *baud rate 100*

these are cleary **base64**, but the second one is slightly corrupted (due to unclean filtering), but ChatGPT or AI can help to guess what it should have been, and we get these snippets:

```
TAG_00 = VU1BUwo= UMAS
TAG_01 = U3tmbAo=        S{fl
TAG_04 = X3Rvdwo=           _tow
TAG_05 = ZXJfaAo= er_h
TAG_06 = ZXJ0ego=         ertz
TAG_03 
```

we honestly could probably try harder to clean it up, but we can begin flagguess:
![image2](/api/writeup-assets/umass2025/towersignal/image2.png)

## flag

`UMASS{flash_asmr_tower_hertz}`

credits to tien & appllo to helping a lot, im js the guy writing it up
