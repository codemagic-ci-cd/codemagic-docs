---
description: How to create a secure SSH key pair in terminal
title: Generating an SSH key
weight: 2
---

Different repository hosting services have different minimum requirements for their SSH keys. We recommend using a widely supported and secure algorithm such as `ECDSA` or `ED25519` when generating your key pair.

```bash
ssh-keygen -t ed25519 -f ~/Desktop/codemagic_ssh_key -q -N ""
```

This will create two new files on your desktop: `codemagic_ssh_key` (private key) and `codemagic_ssh_key.pub` (public key). 
