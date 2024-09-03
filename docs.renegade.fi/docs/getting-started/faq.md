---
sidebar_position: 3
title: Frequently Asked Questions
description: Frequently Asked Questions about Renegade.
---

# FAQs

### What is the current status of Renegade?

Renegade is live on Arbitrum One mainnet as of September 3rd, 2024.

### Midpoint prices sound too good to be true. What's the tradeoff?

The core tradeoff in Renegade (and dark pools in general) is
_quality-of-execution_ vs. _time-to-execution_. You are indeed always
guaranteed to trade at the midpoint price, so long as there is counter-flow in
the opposite direction to take the other side. During high-volatility
environments, the market is often skewed and it may take some time to fill your
trade. To trade off quality-of-execution for time-to-execution and increase
counter-flow, see [Indications of Interest](/advanced-concepts/ioi).

### What are the fees?

There is an in-protocol fee of 2 basis points (0.02%). Relayers can charge
addition fees on top of the protocol fee, and the frontend relayer at
[trade.renegade.fi](https://trade.renegade.fi) charges an addition 2 basis
points.

### What blockchain is Renegade built on?

Peer discovery and order matching occurs on our independent p2p gossip network.
Our smart contracts, including our ZKP verifier, are deployed on [Arbitrum
Stylus](https://arbitrum.io/stylus).

### Does Renegade use Trusted Execution Environments?

No, trusted execution environments (including Intel SGX) have been [broken many
times](https://arstechnica.com/information-technology/2022/08/architectural-bug-in-some-intel-cpus-is-more-bad-news-for-sgx-users/).
Renegade uses purely cryptographic techniques (MPC and zero-knowledge proofs),
and has no hardware trust assumptions.

### How fast is the protocol? Are gas fees expensive?

Order placement and cancellation is &lt;1ms if you are running in super-relayer
mode (see [Super Relayers](/advanced-concepts/super-relayers)). We are
constantly optimizing both latency and gas fees, but current estimates are ~1s
to match an order (fully parallelizable over all outstanding counterparty
orders). Gas costs are ~0.2 USD to create a new wallet, and ~0.3 USD for each
deposit/withdraw or positive order match. Certain flags exist to maximize
privacy, in exchange for higher gas fees.

### Does Renegade custody assets? Does Renegade need KYC?

No, never. The protocol is open, permissionless, and non-custodial. Traders can
voluntarily opt-in to match with a subset of counterparties that have passed
KYC, but this is not required.

### Is Renegade Hiring?

Yes, we are [hiring](https://jobs.renegade.fi) across all roles. For technical
contributors, we work in-person in San Francisco, 6 days a week.

### How can I get in contact?

[Twitter DM](https://twitter.com/renegade_fi) or email (chris@renegade.fi) is
best. Looking forward to hearing from you!
