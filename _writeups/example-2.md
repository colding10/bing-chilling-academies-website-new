---
title: "Web Exploitation Challenge Walkthrough"
date: "2023-07-20"
tags: ["web", "javascript", "xss"]
description: "A detailed walkthrough of solving the XSS challenge in Example CTF 2023"
author: "ByteMaster"
---

# Web Exploitation Challenge Walkthrough

## Challenge Description

In this challenge, we were presented with a simple web application that allows users to post comments. The goal was to find and exploit an XSS vulnerability to steal the admin's cookie.

## Initial Analysis

When examining the application, we noticed that the comment system was not properly sanitizing user input. Here's what we found:

```javascript
// Vulnerable code
const comment = req.body.comment;
document.getElementById('comments').innerHTML += comment;
