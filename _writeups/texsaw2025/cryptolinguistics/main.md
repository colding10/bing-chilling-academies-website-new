---
title: "Cryptolinguistics"
ctfName: "TexSAW CTF 2025"
date: "2025-04-13"
tags: ["osint"]
description: "looking through symbols of the voynich manuscript"
author: "tien & cold"
---

## solvepath

Challenge asks for the following bullet points, I have attached answers to go along with them.

By looking at the image stuff we are provided, we can deduce that it is the Voynich Manuscript. We then find the following link:

[https://collections.library.yale.edu/catalog/2002046](https://collections.library.yale.edu/catalog/2002046)

Most of the information can be googled. Additionally, the Voynich Manuscript Wikipedia comes into use.

Most of this is google, finding page numbers is just sifting through the book. For the first inscription not in primary language, we look at the wikipedia link, and in the section of extraneous writing.

![bruh not orz](/api/writeup-assets/texsaw2025/cryptolinguistics/image1.png "image1")

This gives us the part as f1r.

The hardest part in our opinion is the owner. There are many answers when you google, with common ones being Georg Baresch and Jacobus and Athanasius Kircher. However, the most commonly accepted answer is Rudolf II, Holy Roman Emperor. Thus, our answer for this section is Rudolf.

Bolded answers with parts are below:

The first proper noun in the book's title **Voynich**

* Language of book text **Voynichese**
* The earliest year it was likely written in **1404**
* The country it was likely written in **Italy**
* Its current location (one word) **Yale**
* The page number of the large drawing on the right **56v**
* The page number of the ram drawing  **71r**
* The page number of the scales drawing **72v**
* The page number of the fish drawing **70v**
* The page number of the first inscription not in the text's primary language that was written by its author (not some later owner) **f1r**
* The page number of the text in the top left (hint: in the second half of the book) **75r**
* First known owner's first name **Rudolf**

![image2](/api/writeup-assets/texsaw2025/cryptolinguistics/image2.png "figure 1 trolling")

Figure 1: A bit of trolling occurred.. We had the right flag for >12 hours but due to a leading whitespace it was wrong!

## flag

flag format: `texsaw{VoynichVoynichese1404ItalyYale56v_71r_72v_70v_f1r_75rRudolf}`

-tienxion & cold
