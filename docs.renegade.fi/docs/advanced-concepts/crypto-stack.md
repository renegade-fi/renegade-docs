---
sidebar_position: 3
description: The Renegade crypto stack.
---

# Our Cryptographic Stack

## Zero-Knowledge Proving

For all zero-knowledge proofs, we use
[Bulletproofs](https://eprint.iacr.org/2017/1066). We chose this proving system
as it has very low relative prover latency and is fully transparent, meaning
that it does not require a trusted setup like Groth16. In addition, it is
friendly to collaborative proving, unlike more modern transparent schemes like
FRI / STARKs. Bulletproofs are not succinct (so, technically Renegade does not
use SNARKs, just NIZKs), but we currently use StarkWare for scalability, so the
relatively-high verifier complexity is no issue.

## Multi-Party Computation

For MPC, we use maliciously-secure two-party
[SPDZ](https://eprint.iacr.org/2011/535). We chose a fast secret-sharing-style
scheme, as our circuits are arithmetic and we may potentially expand to more
than two parties in the future.

## Hash Functions

For hashes, we use arithmetic-friendly
[Poseidon](https://eprint.iacr.org/2019/458) everywhere. For cross-proof
witness consistency checks, we use Pedersen commitments, as we can save work by
re-using the Bulletproof commitments.

## Asymmetric Cryptography

For public-key cryptography (used to encrypt matching outputs and to encrypt
plaintext wallets to store them on-chain), we use
[ElGamal](https://wwwmayr.in.tum.de/konferenzen/Jass05/courses/1/papers/meier_paper.pdf),
usually combined with Poseidon hashes to turn asymmetric schemes into faster
symmetric ones. ElGamal also has the benefit of being *key-private*, so that
third-party observers cannot determine the destination address of any tokens.
