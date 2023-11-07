---
sidebar_position: 3
title: Frequently Asked Questions
description: Frequently Asked Questions about Renegade.
---

# FAQs

### What is the current status of Renegade?

The project is under active development. As of Feburuary 2023, we have
implemented core handshakes, SPDZ, and Bulletproofs primitives, and have begun
work on circuit implementations, interface design, and bridging. A public
testnet is expected in Q2 2023.

For priority access onto the whitelisted testnet, [sign up
here](https://renegadefi.typeform.com/access). Otherwise, you can follow along
with our open-source code on [GitHub](https://github.com/renegade-fi).

### Midpoint prices sound too good to be true. What's the tradeoff?

The core tradeoff in Renegade (and dark pools in general) is
_quality-of-execution_ vs. _time-to-execution_. You are indeed always
guaranteed to trade at the midpoint price, so long as there is counter-flow in
the opposite direction to take the other side. During high-volatility
environments, the market is often skewed and it may take some time to fill your
trade. To trade off quality-of-execution for time-to-execution and increase
counter-flow, see [Indications of Interest](/advanced-concepts/ioi).

### What are the fees? What governance power is there?

There is an in-protocol fee of 2 basis points (0.02%). Governance power is
minimized, and can neither arbitrarily upgrade the contract nor halt withdraws.
See the [Fees and Governance](/core-concepts/fees-and-governance) section for
more details.

### What blockchain is Renegade built on?

Peer discovery and order matching occurs on our independent p2p gossip network.
Consensus and security is inherited from Ethereum via StarkNet.

### Does Renegade use Trusted Execution Environments?

No, trusted execution environments (including Intel SGX) have been [broken many
times](https://arstechnica.com/information-technology/2022/08/architectural-bug-in-some-intel-cpus-is-more-bad-news-for-sgx-users/).
Renegade uses purely cryptographic techniques (MPC and zero-knowledge proofs),
and has no hardware trust assumptions.

### How fast is the protocol? Are gas fees expensive?

Order placement and cancellation is &lt;1ms if you are running in super-relayer
mode (see [Super Relayers](/advanced-concepts/super-relayers)). We are
constantly optimizing both latency and gas fees, but current estimates are
~100-500ms to match an order (fully parallelizable over all outstanding
counterparty orders). Gas costs are ~10 USD to create a new wallet, and ~1 USD
for each deposit/withdraw or positive order match. Certain flags exist to
maximize privacy, in exchange for higher gas fees.

### Does Renegade custody assets? Does Renegade need KYC?

No, never. The protocol is open, permissionless, and immutable.

### Is Renegade Hiring?

Yes, we are [hiring](https://jobs.renegade.fi) across all roles. For technical
contributors, we work in-person in San Francisco, 6 days a week.

### How can I get in contact?

[Twitter DM](https://twitter.com/renegade_fi) or email (chris@renegade.fi) is
best. Looking forward to hearing from you!
