---
sidebar_position: 1
slug: /
---

# Introduction

**Renegade** is a new type of decentralized exchange, an on-chain dark pool.

In contrast to all current non-custodial exchanges, Renegade is designed to
give you **universal trade privacy**. That means that your trading activity is
completely obscured from all third-parties, both before a trade occurs and
after it is filled. No one except you will know the details of your balances or
trades.

Renegade solves many problems in current DeFi spot markets, ultimately giving
you better prices:
1. **Pre-trade privacy**. Before your trade is matched, no one can see any
   details of your order. Larger trades that would normally move the market
   when detected in the mempool can now be filled privately.
1. **Post-trade privacy**. After an order is filled, only the counterparty
   learns what assets were swapped. This prevents third-parties from tracking
   and copying your trading strategies.
1. **Minimal MEV**. Since validators only ever see zero-knowledge proofs of
   valid swaps, there is no ability for block producers to front-run, back-run,
   or sandwich your trades.

For a high-level explanation of the role of dark pools in traditional finance
and how we can translate them into a crypto context,
check out [What is a Dark Pool](/basic-concepts/dark-pool-explainer)
and to better understand the idea of Multi-Party Computation and how it allows
for order matching without leaking information,
see [What is MPC](/basic-concepts/mpc-explainer).

To understand how we integrate MPC matching with zero-knowledge settlement, see
[The MPC-ZKP Architecture](/basic-concepts/mpc-zkp) and check out [Anonymity
Guarantees](/basic-concepts/guarantees) to see how we this MPC-ZKP architecture
guarantees maximal privacy while trading.

For more advanced concepts, including the ideas of Indications of Interest
and Super Relayers, see the [Advanced Concepts](/advanced-concepts/ioi).
And finally, for the most precise description of the protocol, see the detailed
[Whitepaper](/getting-started/whitepaper).

## Contact Info
- [@renegade_fi](https://twitter.com/renegade_fi) on Twitter.
- [chris@renegade.fi](mailto:chris@renegade.fi) via email.
- [Discord](https://discord.gg/renegade-fi) for quick questions.
- [Jobs](https://jobs.renegade.fi) for careers.
