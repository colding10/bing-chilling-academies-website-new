---
title: "OSINT: AC/DC"
ctfName: "TexSAW CTF 2025"
date: "2025-04-13"
tags: ["osint"]
description: "a quick osint challenge related to the Apollo missions"
author: "cold"
---

## Challenge description

My friend is flying a spaceship, and is having a problem, he is getting the attached differences in telemetry. Your flag is texsaw{the instructions on what he should do to fix the problem} the instructions are less than 6 words and might not be words in the english dictionary neccesarily. Put them all in lower case with spaces between them.

## Solvepath

Right away we see the mention of AC/DC - but seeing as it mentions spaceships, the band is unlikely.
Instead we start thinking about electrical systems. Opening the attached csv, [download here](/api/writeup-assets/texsaw2025/acdc/Telemetry.csv), we see an electrical issue at T=52 seconds.

Most people may not have noticed but by looking at the challenge author OneNameMarty's bio, we can see that he has a quote from the Apollo 11/13 mission director. This clues us towards the Apollo missions.

[google search](https://www.google.com/search?q=apollo+mission+electrical+issue+52+seconds+90+seconds)

A simple google search leads us here:
[nasa history website](https://www.nasa.gov/history/afj/ap12fj/a12-lightningstrike.html)

And we see some confirmation:
![confirmation screenshot](/api/writeup-assets/texsaw2025/acdc/confirmation.png)

From here, it's only a matter of looking around until we find a "famous phrase" that would fix the issue:
![solution screenshot](/api/writeup-assets/texsaw2025/acdc/solss.png)

The flag is `texsaw{sce to aux}`.
