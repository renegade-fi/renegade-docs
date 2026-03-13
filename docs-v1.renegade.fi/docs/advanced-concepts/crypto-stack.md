---
sidebar_position: 3
description: The Renegade crypto stack.
---

# Our Cryptographic Stack

## Zero-Knowledge Proving

For all zero-knowledge proofs, we use
[PlonK](https://eprint.iacr.org/2019/953.pdf). We chose this scheme for its
ease of verification in an EVM context and its friendliness to collaborative
proving, unlike more modern transparent schemes such as FRI / STARKs.

## Multi-Party Computation

For MPC, we use maliciously-secure two-party
[SPDZ](https://eprint.iacr.org/2011/535). We chose a fast secret-sharing-style
scheme, as our circuits are arithmetic and we may potentially expand to more
than two parties in the future.

## Asymmetric Cryptography

For public-key cryptography (used to encrypt matching outputs and to encrypt
plaintext wallets to store them on-chain), we use
[ElGamal](https://wwwmayr.in.tum.de/konferenzen/Jass05/courses/1/papers/meier_paper.pdf),
usually combined with Poseidon hashes to turn asymmetric schemes into faster
symmetric ones. ElGamal also has the benefit of being _key-private_, so that
third-party observers cannot determine the destination address of any tokens.
