---
sidebar_position: 3
---

import Figure from '../../src/figure.js'
import NetworkDocsLight from '@site/static/img/network_docs_light.svg'
import NetworkDocsDark from '@site/static/img/network_docs_dark.svg'
import ValidMatchMpcLight from '@site/static/img/valid_match_mpc_light.png'
import ValidMatchMpcDark from '@site/static/img/valid_match_mpc_dark.png'

# The MPC-ZKP Architecture

The core difference between Renegade and all other exchanges (both centralized
and decentralized) is that *state is kept locally*. Instead of balances and
orders being maintained by a centralized server (e.g. FTX) or on many thousands
of distributed servers (e.g. Uniswap), all Renegade state is maintained by
individual traders.

Some terminology:
- A **wallet** is a list of orders and balances for a trader. Each trader's
  wallet is kept private to each trader, and only wallet hashes (technically,
  "hiding and binding commitments") are posted on-chain.
- A **relayer** is a node in the Renegade network. Each individual relayer
  *manages* one or more wallets (meaning they can view the unencrypted wallet)
  and are responsible for performing MPC computations with other relayers.
- A **cluster** (also called a "relay cluster") is a logical group of relayers
  that all manage the same wallets. Clusters are fault-tolerant replicated
  groups of relayers, and allow for automatic failovers and parallel MPCs.

As previously mentioned, individual wallets are never revealed in plaintext.
Instead, traders post *commitments* of individual wallets on-chain. When a
trader wants to perform an operation on their wallet (depositing tokens,
settling a match, etc.), they must post a commitment to their new wallet,
alongside a zero-knowledge-proof that the new wallet is indeed valid (e.g., the
trader must prove that they haven't just created new tokens in their balances
out of thin air). The smart contract maintains a global **commitment Merkle
tree**, essentially a list of commitments of valid wallets.

## Network Architecture

Fundamentally, Renegade simply consists of a p2p gossip network of many
independent relayers that constantly handshake and perform MPCs with each other
as new orders enter the system. Relayers never custody assets, and are merely
given view access to the wallet in order to compute pairwise MPCs.

<Figure
  LightImage={NetworkDocsLight}
  DarkImage={NetworkDocsDark}
  isSvg={true}
  caption="The network architecture."
  width="50%"
/>

In the above diagram, there are three independent relay clusters: The Public
Gateway, a Private Cluster 1, and a Private Cluster 2. The Public Gateway is a
large publicly-accessible cluster for those who don't want to run their own
nodes, but is a relay cluster just like the rest (i.e., it has no special
permissions).

When a new order is entered into a wallet managed by one of the clusters, the
cluster will propagate a *handshake tuple*, which is a tuple of commitments to
the order data, alongside a zero-knowledge proof that the order is valid. All
other relayers monitor for new handshake tuples, and if a new tuple has been
detected, will contact the origination cluster and proceed with an MPC.

The MPC computes *matching engine execution*. That is, given the two orders
(each held privately by different relayers), the two parties will compute a MPC
that implementing matching engine execution on those two orders. This allows
for full anonymity, as no information whatsoever is leaked about the order in
advance of the MPC. After the MPC, the parties only learn what tokens were
swapped, so if there was no match between the orders, then no additional
information is leaked.

## Collaborative SNARKs

As mentioned in [What is MPC](/basic-concepts/mpc-explainer), multi-party
computation protocols themselves have no guarantees about the validity of
input data. To solve this, we re-compute the commitments to order data inside
of the MPC. If the re-computed commitments disagree with the publicly-known
commitments from the handshake tuple, then the output matches list is **zeroed
out**.

In addition to the input consistency problem, a naive application of MPC would
lead to problems around **atomic settlement**. In particular, we must ensure
that the MPC output cannot be revealed without it being possible for either
party to settle the match. If either party could learn the MPC output and
hangup the connection before actually swapping tokens, then the protocol would
leak order information.

To solve this atomic settlement problem, we use the [**collaborative
SNARK**](https://eprint.iacr.org/2021/1530) framework from Ozdemir and Boneh.
By wrapping zero-knowledge proof generation inside of a MPC algorithm,
collaborative SNARKs allow for the relayers to collaboratively prove a
particular NP statement, VALID MATCH MPC. This statement essentially claims
that given the publicly-known commitments to order information and a public
commitment to a matches tuple, both traders do indeed know valid input orders.

<Figure
  LightImage={ValidMatchMpcLight}
  DarkImage={ValidMatchMpcDark}
  isSvg={false}
  caption="The NP statement VALID MATCH MPC."
  width="60%"
/>

Once this collaborative proof of VALID MATCH MPC has been computed, either
party can submit it to the smart contract, thereby actually swapping the
tokens.

By generating a collaborative proof inside of the MPC (instead of just running
matching engine execution directly), both parties have assurance that matching
(i.e., determining what tokens are swapped between the parties) is atomic with
settlement (i.e., actually swapping the tokens).

## Lifecycle Summary

In summary, the MPC-ZKP lifecycle is as follows:
1. Two relayers each maintain a private wallet that has been committed to in
   the global Merkle tree of all valid wallet commitments. Each relayer
   generates a handshake tuple, which contains a zero-knowledge proof of wallet
   validity alongside hiding commitments to each of their orders.
1. The two relayers exchange handshake tuples, and assuming both zero-knowledge
   proofs are accepted, the relayers proceed with the MPC. The MPC consists of
   an execution of the matching engine on the two private orders, followed by a
   collaborative of a proof of the statement VALID MATCH MPC. The proof and a
   commitment to the matches tuple are both opened as the output of the MPC.
1. Either party may send the VALID MATCH MPC proof to the smart contract,
   "encumbering" both wallets and forcing both of the relayers to settle out
   the matched tokens.
1. Both parties settle the matches, and may again proceed with remaning orders.

So, by leveraging this MPC-ZKP framework, we allow for true trade anonymity,
both pre-and-post-trade. For more discussion on the privacy properties that
collaborative SNARKs enable, see [[Anonymity
Guarantees]](/getting-started/guarantees).

Also, for more details on the precise contents of the handshake tuple, and for
more details about the various NP statements that are proven by each node, see
the full [whitepaper](/getting-started/whitepaper).
