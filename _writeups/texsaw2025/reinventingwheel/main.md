---
title: "Reinventing the Wheel"
ctfName: "TexSAW CTF 2025"
date: "2025-04-13"
tags: ["osint"]
description: "GS writes about the Balkan Wheel and a game Diplomacy to FIRST BLOOD this OSINT chall (only 2 solves)"
author: "GSBCA"
---

## Challenge description

Flag Format: texsaw{1,2,3,4,...}

What is the Balkan Wheel? Your flag is the set of commands in alphabetical order and correct notation including non-geographic locational and temporal data. (do not include spaces and type only in uppercase), that sets up the conditions for the Balkan Wheel as early as possible, there is no need to include a command that creates the Balkan Wheel. Additionally, the subjects of the commands are all A type.

Where appropriate in the commands, use -> instead of something else include leading zeroes when referencing time.

Hints:

    The next time commands are given after the ones referenced by the flag, all command issuants will have doubled their status
    The Balkan Wheel first occured on November 8th 2024, its effects were able to be seen until December 30th 2024
    The Balkan Wheel was planned by 7 human participants
    The Balkan Wheel may have its most public mention via audio.
    The Balkan Wheel was planned in a secret channel, now public if you know where to look.

## Solvepath

References to geographical locations, “early as possible”, commands indicating something turn based, and A type subject indicated this could be some type of historical strategy game. More specifically, with a focus on Europe as the map or board would have to have ample space for troop movements within the Balkan peninsula.

Following the criteria given in the question initially it was believed that it could be some kind of mobile game, which commonly uses these types of mechanics. However, the inclusion of “A-type units,” after a few minutes of research, pointed to Diplomacy. The game of Diplomacy uses both A and F type units, was turn based, and had a focus on Europe indicating it was part of the correct solution.

## Looking into the game Diplomacy

Initially, I looked for solutions in 2D diplomacy. As Austria was most closely situated to the Balkans I looked for Austrian strategy guides that could yield results. Some strategy guides mentioned a common opening called the “Balkan Gambit,” a rush with your starter units east and south. Unfortunately, this did not result in a cyclical pattern one would expect in a wheel.

[How to ALWAYS win as Austria in Diplomacy (100% guaranteed)](https://www.youtube.com/watch?v=P5kIGYsmBds)

The solution calling for temporal data indicates that for some reason the time in which the commands were executed was relevant to the solution. Somewhat luckily, I had previously watched the following video, which likely still could have been found quickly if one were to look for Diplomacy played with time manipulation: \

[5D Diplomacy (100% GUARANTEE NO BAMBOOZLE)](https://www.youtube.com/watch?v=P_5QCJO4ELI&t=208s)

However, finding references to the “Balkan Wheel” was still challenging as there were no results on YouTube when searched for by name or forum websites. Even searching through the transcripts of some gameplay videos showed no matches. This is when some of my teammates went to different Diplomacy and 5D Diplomacy discords servers and inquired about the strategy, yielding the following:

![confirmation ss from disc](/api/writeup-assets/texsaw2025/reinventingwheel/confirmation.png "ss from disc server")

Confirms the 5D chess theory.

## Discovering the Balkan Wheel

In greater detail (a screenshot from after CTF ended in higher resolution), the image obtained was:

![alt_text](/api/writeup-assets/texsaw2025/reinventingwheel/wheel.png "ss of the wheel")

Now that the “Balkan Wheel” was fully discovered all that is left to do is create the orders in accordance with standard and 5D diplomacy conventions and assign temporal markers to the earliest possible date while marking all units moved as type A in alphabetical order:

T1S01ABUD->T1S01VIE

Timeline 1 Spring 1901 Unit A Budapest to Timeline 1 Spring 1901 Vienna

T1S01ABUL->T1S01RUM

Timeline 1 Spring 1901 Unit A Bulgaria to Timeline 1 Spring 1901 Romania

T1S01AGRE->T1S01BUL

Timeline 1 Spring 1901 Unit A Greece to Timeline 1 Spring 1901 Bulgaria

T1S01ARUM->T1S01BUD

Timeline 1 Spring 1901 Unit A Romania to Timeline 1 Spring 1901 Budapest

T1S01ASER->T1S01GRE

Timeline 1 Spring 1901 Unit A Serbia to Timeline 1 Spring 1901 Greece

T1S01ATRI->T1S01SER

Timeline 1 Spring 1901 Unit A Trieste to Timeline 1 Spring 1901 Serbia

T1S01AVIE->T1S01TRI

Timeline 1 Spring 1901 Unit A Vienna to Timeline 1 Spring 1901 Trieste

Formatted into a valid answer:

## flag

`texsaw{T1S01ABUD->T1S01VIE,T1S01ABUL->T1S01RUM,T1S01AGRE->T1S01BUL,T1S01ARUM->T1S01BUD,T1S01ASER->T1S01GRE,T1S01ATRI->T1S01SER,T1S01AVIE->T1S01TRI}`
