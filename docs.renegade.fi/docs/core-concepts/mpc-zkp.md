---
sidebar_position: 3
description: Collaborative SNARKs, the hybrid MPC-ZKP protocol.
---

import Figure from '../../src/figure.js'
import TreeLight from '@site/static/img/tree_light.svg'
import TreeDark from '@site/static/img/tree_dark.svg'
import TreeMobileLight from '@site/static/img/tree_mobile_light.svg'
import TreeMobileDark from '@site/static/img/tree_mobile_dark.svg'
import NetworkArchitectureLight from '@site/static/img/network_architecture_light.png'
import NetworkArchitectureDark from '@site/static/img/network_architecture_dark.png'
import ValidMatchMpcLight from '@site/static/img/valid_match_mpc_light.png'
import ValidMatchMpcDark from '@site/static/img/valid_match_mpc_dark.png'

# The MPC-ZKP Architecture

The core difference between Renegade and all other exchanges (both centralized
and decentralized) is that _state is kept locally_. Instead of balances and
orders being maintained by a centralized server (e.g. Binance) or on many
thousands of distributed servers (e.g. Uniswap), all Renegade state is
maintained by individual traders.

Some terminology:

- A **wallet** is a list of orders and balances for a trader. Each trader's
  wallet is kept private to each trader, and only wallet hashes (technically,
  "hiding and binding commitments") are posted on-chain.
- A **relayer** is a node in the Renegade network. Each individual relayer
  _manages_ one or more wallets (meaning they can view the unencrypted wallet)
  and are responsible for performing MPC computations with other relayers.
- A **cluster** (also called a "relay cluster") is a logical group of relayers
  that all manage the same wallets. Clusters are fault-tolerant replicated
  groups of relayers, and allow for automatic failovers and parallel MPCs.

As previously mentioned, individual wallets are never revealed in plaintext.
Instead, traders post "commitments" of individual wallets on-chain, where a
commitment to a wallet is essentially a hash of a wallet combined with some
randomness. Just knowing a wallet commitment does not tell you anything about
the underlying wallet data.

## The Commit-Reveal Scheme

When a trader wants to perform an operation on their wallet (depositing tokens,
settling a match, etc.), they must know their old and new wallets and send
three pieces of information to the smart contract:

- The commitment to the new wallet.
- Two "nullifiers" of their old wallet, which serve to prevent double-spends of
  the old wallet.
- A zero-knowledge proof that: The commitments are properly computed, the
  nullifiers are properly computed, the old commitment exists somewhere in the
  global Merkle tree, and that the changes from the old to new wallet are valid
  (e.g., the user hasn't arbitrarily increased their balances).

The smart contract maintains a global Merkle tree of all previous commitments,
plus a set of nullifiers that have been used to reveal previous wallets.

<Figure
  LightImage={TreeLight}
  DarkImage={TreeDark}
  LightImageMobile={TreeMobileLight}
  DarkImageMobile={TreeMobileDark}
  isSvg={true}
  caption="Renegade keeps track of valid wallets with a commit-reveal scheme."
/>

By using this commit-reveal scheme, we allow for full wallet privacy (i.e., no
information about the wallet is leaked on-chain), while maintaining full state
consistency and protection against double-spend attacks.

## Network Architecture

Fundamentally, Renegade simply consists of a p2p gossip network of many
independent relayers that constantly handshake and perform MPCs with each other
as new orders enter the system. Relayers never custody assets, and are merely
given view access to the wallet in order to compute pairwise MPCs.

<Figure
  LightImage={NetworkArchitectureLight}
  DarkImage={NetworkArchitectureDark}
  isSvg={false}
  caption="The network architecture."
  width="75%"
  widthMobile="100%"
/>

In the above diagram, there are three independent relay clusters: The Public
Gateway, a Private Cluster 1, and a Private Cluster 2. The Public Gateway is a
large publicly-accessible cluster for those who don't want to run their own
nodes, but is a relay cluster just like the rest (i.e., it has no special
permissions).

When a new order is entered into a wallet managed by one of the clusters, the
cluster will propagate a _handshake tuple_, which is a tuple of commitments to
the order data, alongside a zero-knowledge proof that the order is valid. All
other relayers monitor for new handshake tuples, and if a new tuple has been
detected, will contact the origination cluster and proceed with an MPC.

The MPC computes _matching engine execution_. That is, given the two orders
(each held privately by different relayers), the two parties will compute a MPC
that implements matching engine execution on those two orders. This allows for
full anonymity, as no information whatsoever is leaked about the order in
advance of the MPC. After the MPC, the parties only learn what tokens were
swapped; if there was no match between the orders, then no additional
information is leaked.

## Collaborative SNARKs

As mentioned in [What is MPC](/core-concepts/mpc-explainer), multi-party
computation protocols themselves have no guarantees about the validity of input
data. To solve this, we re-compute the commitments to order data inside of the
MPC. If the re-computed commitments disagree with the publicly-known
commitments from the handshake tuple, then the output matches list is **zeroed
out**, which functions to prevent adversarial manipulation with fake orders.

In addition to the input consistency problem, a naive application of MPC would
lead to problems around **atomic settlement**. In particular, we must ensure
that the MPC output cannot be revealed without it being possible for either
party to record the match on-chain. If either party could learn the MPC output
and hangup the connection before actually swapping tokens, then the protocol
would leak order information.

To solve this atomic settlement problem, we use the [collaborative
SNARK](https://eprint.iacr.org/2021/1530) framework from Ozdemir and Boneh. By
wrapping zero-knowledge proof generation inside of a MPC algorithm,
collaborative SNARKs allow for the relayers to collaboratively prove a
particular NP statement, VALID MATCH MPC. This statement essentially claims
that given the publicly-known commitments to order information and a public
commitment to a matches tuple, both traders do indeed know valid input orders.

<Figure
  LightImage={ValidMatchMpcLight}
  DarkImage={ValidMatchMpcDark}
  isSvg={false}
  caption="Renegade relayers produce collaborative proofs of the NP statement
  VALID MATCH MPC."
  mobileWidth="100%"
/>

Once this collaborative proof of VALID MATCH MPC has been computed, either
party can submit it to the smart contract, thereby actually swapping the
tokens. Instead of just running matching engine execution directly,
collaborative proving gives both parties assurance that matching (i.e.,
determining what tokens are swapped) is atomic with settlement (i.e., actually
swapping the tokens).

So, by realizing this MPC-ZKP framework via collaborative SNARKs, we have
created a DEX that is both completely atomic (i.e., neither party may back out
after the MPC has been performed) and completely private, both pre-trade and
post-trade.

For more details on the precise contents of the handshake tuple, and for more
details about the various NP statements that are proven by each node, see the
full [Whitepaper](/getting-started/whitepaper).
