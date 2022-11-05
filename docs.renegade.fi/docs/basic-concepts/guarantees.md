---
sidebar_position: 4
---

# Anonymity Guarantees

In the [[Introduction]](/), we mentioned three classes of problems that arise
in current decentralized exchanges: Lack of pre-trade privacy, lack of
post-trade privacy, and MEV. By using pairwise MPC matching and zero-knowledge
settlement as discussed in [[The MPC-ZKP
Architecture]](/basic-concepts/mpc-zkp), Renegade solves all three of these
problems:

- **Pre-trade privacy**. Since wallets are maintained locally by relayers, the
  smart contract never sees any order or balance information. Also, handshakes
  are propagated with *commitments* to the orders (rather than the plaintext
  orders themselves), so no information is learned about an order in advance of
  it matching.
- **Post-trade privacy**. The on-chain state only consists of a Merkle tree of
  *commitments* to wallets, so balances, orders, and trades are never posted
  in-the-clear, even after a valid match. Even the counterparty only learns
  what tokens were swapped; they cannot learn, for example, the full size
  behind a match.
- **Minimal MEV**. Since the smart contract only checks zero-knowledge proofs,
  the block producer or sequencer has no ability whatsoever to sandwich or
  front-run trades.

Put differently, **third-parties learn nothing about the state of the
exchange**, and counterparties to your trades learn nothing except for what
tokens were swapped in a particular trade.
