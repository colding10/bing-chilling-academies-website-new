---
title: "Attack of the Pentium 4"
ctfName: "UMass CTF 2025"
date: "2025-04-20"
tags: ["osint"]
description: "yet another japanese osint challenge"
author: "tien"
---

## Challenge Description

![alt_text](/api/writeup-assets/umass2025/pentium/image1.png)

download the file [here](/api/writeup-assets/umass2025/pentium/image.jpeg)

### Part 0: Note

I hate Japanese OSINT. TEXSAW Japanese OSINT was rather cancerous but doable cuz **cold & appllo** are just orz at YT.

### Part 1: Location

![alt_text](/api/writeup-assets/umass2025/pentium/image2.png "image_tooltip")

This is the image we are given. Let’s find the location.

Searching the image with google gives us this link, [https://rad-japan.co.jp/company](https://rad-japan.co.jp/company) , and we can see the images match up. Their address is 〒110-0014 2-3-9 Kitaueno, Taito-ku, Tokyo Kitaueno Building 3F.

Hence, we have a roughly good estimate of what the building is.

### Part 2: Store

We need to find a store. At first, I had no idea what it would be. I looked on the side, around the place, but was lost.

Enter appllo, our resident Japanese fan.

![alt_text](/api/writeup-assets/umass2025/pentium/image3.png "image_tooltip")

Looked into this, didn’t get much. But it got me thinking.

### Part 3: Side-Track

[https://acharge-pc.com/](https://acharge-pc.com/) I find this day trading company.

Somehow, after a bunch of searching, I get to a guy named Yosuke Saito.

[http://www.biz-info.jp/ATC_Forum2015/C3.html](http://www.biz-info.jp/ATC_Forum2015/C3.html)

This seemed VERY promising, so then:

[https://www.mobygames.com/person/472143/yosuke-saito/credits/](https://www.mobygames.com/person/472143/yosuke-saito/credits/)

DID NOT WORK

### Part 4: Depression

[https://vspec-bto.com/voice/?s=%E3%82%B2%E3%83%BC%E3%83%A0](https://vspec-bto.com/voice/?s=%E3%82%B2%E3%83%BC%E3%83%A0)

I then wasted a bunch of hours reading through this.

Unfortunately, none of ts was right. I was then so depressed I went to get food.

The food did not make me feel better.

### Part 5: Woah

[https://pc-zeus.com/index.html](https://pc-zeus.com/index.html)

I FOUND THE STORE

Looking at the information tab,

[https://pc-zeus.com/z-gaiyou.htm](https://pc-zeus.com/z-gaiyou.htm)

![alt_text](/api/writeup-assets/umass2025/pentium/image4.png "image_tooltip")

We can confirm it’s the store. appllos initial observation was right.

I started feeling better about myself.

### Part 6: Voices

![alt_text](/api/writeup-assets/umass2025/pentium/image5.png "image_tooltip")

From link, I was now reading the testimonials.

My first target was [Mr. Ishii, Saga City, Saga Prefecture](https://pc-zeus.com/voice/?p=4)

[https://www.mobygames.com/person/631609/koichi-ishii/credits/](https://www.mobygames.com/person/631609/koichi-ishii/credits/)

Were we done? HELL NO.

### Part 7: ORZ Break

![alt_text](/api/writeup-assets/umass2025/pentium/image6.png "image_tooltip")

I got sidetracked.

### Part 8: Finding the Fella

[https://pc-zeus.com/voice/](https://pc-zeus.com/voice/)

It wasn’t anyone on this, NOW WHAT.

Well, the website has something called use cases.

[https://pc-zeus.com/example.html](https://pc-zeus.com/example.html)

So now we read.

The first one we find is [https://pc-zeus.com/example_13.html](https://pc-zeus.com/example_13.html).

![alt_text](/api/writeup-assets/umass2025/pentium/image7.png "image_tooltip")

Makes background music for games!!!! We found him.

Name: Shohei Tsuchiya

### Part 9: Flagging

Going on mobygames:

[https://www.mobygames.com/person/333977/shouhei-tsuchiya/credits/](https://www.mobygames.com/person/333977/shouhei-tsuchiya/credits/)

![alt_text](/api/writeup-assets/umass2025/pentium/image8.png "image_tooltip")

Oldest game is Otogi 2: Immortal Warriors.

Flag: `UMASS{Otogi 2: Immortal Warriors}`

### Part 10: Conclusion

I did not enjoy Japanese OSINT. I found it painstakingly not fun. However, it was rather interesting from your conventional OSINT.

-txn

_typeset by cold, yell at me if it looks ass_
