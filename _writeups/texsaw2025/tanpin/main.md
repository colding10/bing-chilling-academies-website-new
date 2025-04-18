---
title: "Tanpin"
ctfName: "TexSAW CTF 2025"
date: "2025-04-13"
tags: ["osint"]
description: "japanese culture immersion to solve osint chall"
author: "cold"
---

## Challenge Description

I saved this screenshot of a video I liked, but I can't remember what it was! (image.png)

All I remember is that the video was a collaboration (合作) and that it was uploaded sometime last September.

Can you find the following information about the image?

    the YouTube video id of the collaboration (v=???)
    the audio source (english song title, all lowercase)
    the visual source (romanized name of the character in the image, all lowercase, given name then surname)
    the YouTube channel of the author of the part shown in the image (@???, note that this is not the channel that uploaded the full video!)

Flag format: texsaw{1,2,3,4}

If the image was example.png, then the flag would be: texsaw{dQw4w9WgXcQ,never gonna give you up,rick astley,RickAstleyYT}

![image.png](/api/writeup-assets/texsaw2025/tanpin/image.png)
![example.png](/api/writeup-assets/texsaw2025/tanpin/example.png)

## Solvepath

tbh it was js **appllo** and I looking thru youtube for hours until we found
[https://www.youtube.com/watch?v=pxyONEf8ZGE&t=3395s](https://www.youtube.com/watch?v=pxyONEf8ZGE&t=3395s)

which matched exactly, and the original clip was [https://www.youtube.com/watch?v=3SbPQDxlHcA](https://www.youtube.com/watch?v=3SbPQDxlHcA)

lowk fire edit btw, and assembling we get the flag to be:

## flag

`texsaw{pxyONEf8ZGE,ice drop,aya komichi,ねそ-l9b}`

sorry for low quality but im too lazy rn
