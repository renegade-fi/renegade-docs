---
sidebar_position: 2
---

# Frequently Asked Questions

**What is the current status of Renegade?**
The project is under active development. As of November 2022, we have
implemented core SPDZ and Bulletproofs primitives, and have begun work on p2p
gossip/handshakes and bridging. A public testnet is expected in Q1 2023. You
can follow along with our open-source code on
[GitHub](https://github.com/renegade-fi).

**Zero price impact sounds too good to be true. What's the tradeoff?**
The core tradeoff in Renegade (and dark pools in general) is
*quality-of-execution versus time-to-execution*. You are indeed always
guaranteed to trade at the midpoint price, so long as there is counter-flow in
the opposite direction to take the other side. During high-volatility
environments, the market is often skewed and it may take some time to fill
your trade.

**What are the fees? What governance power is there?**
There is an in-protocol fee of 1 basis point (0.01%). Governance power is
minimized, and can neither arbitrarily upgrade the contract nor halt withdraws.
See the [Fees and Governance](/basic-concepts/fees-and-governance) section for
more details.

**Does Renegade custody assets? Does Renegade need KYC?**
No, never. The protocol is open, permissionless, and immutable.

**What blockchain is Renegade built on?**
Peer discovery and order matching occurs on our independent p2p gossip network.
Consensus and security is inherited from Ethereum via StarkNet. We expect to
migrate the network to our own soverign rollup or similar as that technology
comes online.

**Is Renegade Hiring?**
Yes, we are [hiring](https://jobs.renegade.fi) across all roles.
For technical contributors, we work in-person in San Francisco.

**How fast is the protocol? Are gas fees expensive?**
Order placement and cancellation is instant if you are running in super-relayer
mode (see [Super Relayers](/advanced-concepts/super-relayers)). We are
constantly optimizing both latency and gas fees, but current estimates are
~100-500ms to match an order (fully parallelizable over all outstanding
counterparty orders). Gas costs are ~10 USD to create a new wallet, and ~1 USD
for each deposit/withdraw or positive order match. Certain flags exist to
maximize privacy, in exchange for higher gas fees.

**How can I get in contact?**
[Twitter DM](https://twitter.com/renegade_fi) or email (chris@renegade.fi) is
best. Looking forward to hearing from you!
