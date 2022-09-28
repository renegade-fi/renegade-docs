---
sidebar_position: 3
---

# MPC Relayers and Lifecycle

In order to perform peer-to-peer MPC computations, the system maintains an
off-chain gossip network of “relayers”.  Though these relayers never custody
users’ assets, they are responsible for maintaining private orders and
computing MPC outputs with all othe relayers.

![](@site/static/img/arch.png)

The entire lifecycle of a user’s trade is as follows:

1. A user bridges any token (ERC-20 or ERC-721) from ETH mainnet to a global
   pool of all tokens that all users have deposited. The bridging occurs in two
   hops, from ETH mainnet → StarkNet → Renegade pools. Note that this only needs
   to be done once, and users can perform all trading activity in the dark pool
   moving forward.
    1. Currently, only ETH mainnet assets are supported, but we plan to include
       easy bridging from other L1s via LayerZero or Wormhole.
2. A user selects a “relay cluster” to manage their orderbook and attempt
   trades with other users. The “relay cluster” is essentially a fault-tolerant
   group of “relayers” deployed via AWS CloudFormation or similar that manages
   a user’s orderbook state and will continually attempt to match trades with
   other relay clusters.
    1. Note that the cluster that a user chooses will learn the orders and
       balances of that user, but the cluster will never custody user assets:
       Only access to the Ethereum private key allows a user to spend their
       funds.
3. Two relayers handshake with hiding and binding cryptographic commitments to
   each of their managed user orderbooks. Then, the pair of relayers run a
   [collaborative SNARK](https://eprint.iacr.org/2021/1530), essentially a MPC
   protocol that computes a zero-knowledge proof of a valid match between the
   two orderbooks.
4. If the output matches list is not empty (i.e., there was at least one
   compatible trade between the two users), then this zero-knowledge
   collaborative SNARK proof is submitted to a StarkNet contract. The StarkNet
   contract will check that the proof is indeed valid, and if so, will include
   the commitment to the new wallet in a global Merkle tree of accepted
   commitments.
    1. This is very similar to how ZCash works, with a commitment-nullifier
       scheme for preventing double-spends while maintaining complete privacy.
5. Now, the user has matched and settled a partial order, so that the relayer
   may proceed with further matches on the orderbook, or if there are no more
   outstanding orders, may wait until the end-trader adds another order into
   the book.

Note that during this entire process, a user has ultimate control of their
funds: A relayer may only match the orders that the end-user has approved. In
order for the user to update their trades, deposit new funds, or withdraw their
current funds to either StarkNet or Ethereum mainnet, the end-user must
initiate a spend operation.

Note that there are two different types of relayer clusters, “private clusters”
or the “public gateway”. The private clusters are groups of relayers deployed
via AWS CloudFormation or a similar service that allows for advanced traders to
manage their own MPC relayers. The public gateway is a high-throughput cluster
managed by the company behind Renegade, which allows for traders to interact with
the platform without needing to manage their own infrastructrure.

Note that, with the public gateway, users are trusting a centralized company
with knowledge of their orderbook. Although this is OK for users who are just
trying out the product or trading low volumes, the private relay clusters are
preferred to promote the security and decentralization of the network. So, we
charge a 0.025% fee on all trades via the public gateway, both to compensate
for expensive GPU-based instances, and to encourage advanced traders to set up
their own 0-fee private clusters.

