---
sidebar_position: 4
---

# Our Cryptographic Stack

## Zero-Knowledge Proving

For all zero-knowledge proofs, we use
[Bulletproofs](https://eprint.iacr.org/2017/1066). We chose this proving system
as it has very low relative prover latency and is fully transparent, meaning
that it does not require a trusted setup like Groth16. In addition, it is
friendly to collaborative proving, unlike more modern transaprent schemes like
FRI / STARKs. Bulletproofs are not succinct (so, technically Renegade does not
use SNARKs, just NIZKs), but we currently use StarkWare for scalability, so the
relatively-high verifier complexity is no issue.

## Multi-Party Computation

For MPC, we use maliciously-secure two-party
[SPDZ](https://eprint.iacr.org/2011/535). Since our circuits are arithmetic
(rather than boolean) and we may potentially expand to more than two parties in
the future, we chose a fast secret-sharing-style scheme.

## Hashing and Asymmetric Cryptography

For hashes, we use arithmetic-friendly
[Poseidon](https://eprint.iacr.org/2019/458) everywhere.

For public-key cryptography (used to encrypt matching outputs and to encrypt
plaintext wallets to store them on-chain), we use
[ElGamal](https://wwwmayr.in.tum.de/konferenzen/Jass05/courses/1/papers/meier_paper.pdf),
usually combined with Poseidon hashes to turn asymmetric schemes into faster
symmetric ones. ElGamal also has the benefit of being *key-private*, so that
third-party observers can never tell the destination address of any tokens.
