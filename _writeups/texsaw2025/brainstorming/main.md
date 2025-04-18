---
title: "Brainstorming"
ctfName: "TexSAW CTF 2025"
date: "2025-04-13"
tags: ["crypto"]
description: "cryptography + balatro challenge"
author: "cold"
---

## Challenge Description

My friend is such a Joker, he has been sending me packets of data like the one attached, I can't decrypt it! can you?

flag format: texsaw{}

[packet.txt](/api/writeup-assets/texsaw2025/brainstorming/packet.txt)

## solvepath

we open the **packet.txt** to see that it is in binary. trivially using cyberchef reveals it has multiple layers, so my lazy bum decides to use [Ciphey](https://github.com/bee-san/Ciphey) which is a **very orz automatic decryption tool**.

This gives me the message

```
secp256k1;Jkr:SmiFc,S&B,HChd,Trib,Photo;4OAK-L1;AS,KC,9D,10H;KH-PC-MULT-RS,KH-PC-MULT-RS,KH-PC-MULT-RS,KH-PC-MULT-RS;Vou:;Cons:;TG:;

Public Key: 03f3e48a2f1cc1862009fc9870abb15ce8c518cec484bd3c13324d1ce8b1a44188
IV: afe45a5920a00137904b1bdcb2c52bc7
Ciphertext: 2ecedcbbd781290a0960d5d3b0a7ec7f
```

### balatro scores

trivially, we can see that its referencing elliptic curve cryptography, but we're missing a private key. that's where the segment `Jkr:SmiFc,S&B,HChd,Trib,Photo;4OAK-L1;AS,KC,9D,10H;KH-PC-MULT-RS,KH-PC-MULT-RS,KH-PC-MULT-RS,KH-PC-MULT-RS;Vou:;Cons:;TG:;` comes in. it seems like jkr = **joker**, and by searching for card games we stumble across [Balatro](https://balatrogame.fandom.com/wiki/Balatro_Wiki).

since we never played this game before, we enlisted the help of someone from the Balatro discord, and they helped us to construct the score using this website: [https://efhiii.github.io/balatro-calculator/](https://efhiii.github.io/balatro-calculator/).

after a couple of tries (shout out to my boy Juan) we got this:
![score.png](/api/writeup-assets/texsaw2025/brainstorming/score.png)

so we have the number `483662483600` to use as a private key.

### decryption

tbh since im not the crypto goat i asked my good friend and mentor ChatGPT who gave me this script after a bit of encouragement:

```python
from coincurve import PrivateKey
from Crypto.Cipher import AES
from Crypto.Hash import SHA256

priv_int = 483662483600
iv = bytes.fromhex("afe45a5920a00137904b1bdcb2c52bc7")
ciphertext = bytes.fromhex("2ecedcbbd781290a0960d5d3b0a7ec7f")
pubkey = bytes.fromhex(
    "03f3e48a2f1cc1862009fc9870abb15ce8c518cec484bd3c13324d1ce8b1a44188"
)

privkey = PrivateKey.from_int(priv_int)
assert privkey.public_key.format() == pubkey

aes_key = SHA256.new(privkey.public_key.format(compressed=False)[1:33]).digest()
cipher = AES.new(aes_key, AES.MODE_CBC, iv)
plaintext = cipher.decrypt(ciphertext)

print("Raw:", plaintext)
print("Hex:", plaintext.hex())

try:
    print("UTF-8:", plaintext.decode("utf-8"))
except:
    pass

import base64

print("Base64:", base64.b64encode(plaintext).decode())
```

## flag

and running it gives us the flag
`texsaw{Baloopy}`
