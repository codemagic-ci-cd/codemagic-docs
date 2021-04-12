---
description: How to create a secure SSH key pair in terminal
title: Generating an SSH key
weight: 2
---

Different repository hosting services have different minimum requirements for the length of the SSH key, varying from 2048 bits to 4096 bits. We recommend creating a 4096 bit key for increased security. Run the command below in your terminal to create a 4096 bit SSH key:

```bash
ssh-keygen -t rsa -b 4096 -f ~/Desktop/codemagic_ssh_key -q -N ""
```

This will create two new files on your desktop: `codemagic_ssh_key` (private key) and `codemagic_ssh_key.pub` (public key). 