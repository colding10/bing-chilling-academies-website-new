---
title: "Trouble At The Spa"
ctfName: "b01lers CTF 2025"
date: "2025-04-20"
tags: ["web"]
description: "react router - render pages"
author: "cold"
---

## Challenge Description

I had this million-dollar app idea the other day, but I can't get my routing to work! I'm only using state-of-the-art tools and frameworks, so that can't be the problem... right? Can you navigate me to the endpoint of my dreams?

[https://ky28060.github.io/](https://ky28060.github.io/)

[trouble_at_the_spa.zip](/api/writeup-assets/boilers2025/troubleatthespa/trouble_at_the_spa.zip)

## Solvepath

looking at the source, we do see that there is a `Flag.tsx` file, but clicking or going to the `/flag` route in the website doesn't render, we get a **404 error**.

This is a **React Routing issue**, where the page exists, and is bundled in the client application, but we can't view it due to the hosting service (Github Pages) not being set up properly. But the _flag is still there_.

## Key commands

All we need to do is run

```js
window.history.pushState({}, "", "/flag")
window.dispatchEvent(new PopStateEvent("popstate"))
```

which basically just "changes the page to the `/flag` and then refreshes".

## flag

`bctf{r3wr1t1ng_h1st0ry_1b07a3768fc}`
