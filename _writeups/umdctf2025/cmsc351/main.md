---
title: "cmsc351"
ctfName: "UMDCTF CTF 2025"
date: "2025-04-27"
tags: ["reverse"]
description: "reverse engineering state machine -> just brute force"
author: "cold"
---

## Challenge Description

Most unorganized class I have taken. It took him over a month to release a syllabus which was not even accurate. In his lectures he just rants instead of actually teaching. You go the entire semester having to guess if you will pass and with what grade because he takes forever to grade things and the average grade was in the 50s.

Rate My Professor

[provided binary here](/api/writeup-assets/umdctf2025/cmsc351/cmsc351)

## Solvepath

First we throw the binary at IDA (im a brokie so i switch between binja free, ghidra, and IDA free). We start by dissassembling the main function:

### Dissassembly of the main functino

we can get this dissassembly of the main function:

```cpp
__int64 __fastcall main(int a1, char **a2, char **a3)
{
  FILE *v3; // rdx
  char v5[32]; // [rsp+0h] [rbp-68h] BYREF
  char s[56]; // [rsp+20h] [rbp-48h] BYREF
  unsigned __int64 v7; // [rsp+58h] [rbp-10h]

  v7 = __readfsqword(0x28u);
  fgets(v5, 25, stdin);
  if ( !(unsigned __int8)sub_79F0(285, 199, v5) )
  {
    puts("sorry, looks like you shouldn't have fallen asleep in lecture.");
    return 0;
  }
  v3 = fopen("flag.txt", "r");
  if ( v3 )
  {
    fgets(s, 50, v3);
    printf(format, s);
    return 0;
  }
  puts("Flag file not found. If you're seeing this on remote, please contact the admins.");
  return 0xFFFFFFFFLL;
}
```

from this, we can tell that it reads some input (up to len 25), then feeds it into `sub_79F0`. if we get a nonzero return value, we get the flag!

_yay easy to understand!_

## dissassemble sub_79F0

it takes a while to dissasssemble `sub_79F0` cuz its kinda big, but we get this:

```cpp
if ( *a3 == 115 )
    JUMPOUT(0x79B0);
  if ( *a3 != 116 )
    return 0;
  v618 = a3 + 1;
  v619 = a2 - 4;
LABEL_1216:
  if ( *v618 != 115 )
  {
    if ( *v618 != 116 )
      return 0;
    v681 = v618[1];
    if ( v681 == 115 )
      JUMPOUT(0xC0D8);
    if ( v681 == 116 )
      JUMPOUT(0xC0C0);
    return 0;
  }
```

(this is just a snippet, it was actually much longer than this)

115 and 116 are the ASCII codes for `s` and `t`.
so, we can deduce that we need to provide a string of `s` and `t` (up to len 25), in a correct sequence, to get the flag

## a solve script

i supposed you could properly reverse engineer, maybe use the call graph, but i decided to brute force it using this script:

```python
import subprocess
import itertools
from multiprocessing import Pool, cpu_count

BINARY_PATH = './cmsc351'
MAX_LENGTH = 25  # From the fgets(v5, 25, stdin) call

def test_sequence(sequence):
    try:
        proc = subprocess.Popen(
            [BINARY_PATH],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        stdout, _ = proc.communicate(input=sequence + '\n')
        if "sorry" not in stdout:
            return sequence
    except:
        pass
    return None

def brute_force():
    # Try lengths from 1 to MAX_LENGTH
    for length in range(1, MAX_LENGTH + 1):
        print(f"Trying length {length}...")
        with Pool(cpu_count()) as pool:
            # Generate all possible sequences of current length
            sequences = (''.join(p) for p in itertools.product('st', repeat=length))

            # Test sequences in parallel
            results = pool.imap_unordered(test_sequence, sequences, chunksize=1000)

            for result in results:
                if result is not None:
                    print(f"Found valid sequence: {result}")
                    pool.terminate()
                    return result
    return None

if __name__ == '__main__':
    result = brute_force()
    if result:
        print(f"Success! The correct sequence is: {result}")
    else:
        print("No valid sequence found up to length", MAX_LENGTH)
```

i was planning to write something up, using some cool bitmaps, blah blah blah, but in the big '25 we use ChatGPT for everything!!

## done

this finishes pretty quickly (~1 minute on my i5 Linux machine) and gets us the sequence:

```bash
time python3 solve.py
Trying length 1...
Trying length 2...
Trying length 3...
Trying length 4...
Trying length 5...
Trying length 6...
Trying length 7...
Trying length 8...
Trying length 9...
Trying length 10...
Trying length 11...
Trying length 12...
Trying length 13...
Trying length 14...
Trying length 15...
Trying length 16...
Found valid sequence: ttsstsssstsssttt
Success! The correct sequence is: ttsstsssstsssttt
python3 solve.py  60.34s user 41.48s system 315% cpu 32.284 total
```

and the flag is
`UMDCTF{C4ll_Gr4ph5_ar3_st1ll_gr4ph5}`

## KISSKIDS

i think this chall could also be solved with **angr**, but I live by the acronym _KISSKIDS_ (keep it simple, stupid + kuz i dont know shit)

and always go for the simplest and more straightforwards solution :P
