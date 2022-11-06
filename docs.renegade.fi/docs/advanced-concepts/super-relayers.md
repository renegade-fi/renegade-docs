---
sidebar_position: 2
---

import Figure from '../../src/figure.js'
import SuperRelayerLight from '@site/static/img/super_relayer_light.svg'
import SuperRelayerDark from '@site/static/img/super_relayer_dark.svg'

# Super Relayers

## Key Hierarchy

All trades within Renegade originate from two relayers running a MPC with each
other, so every trader must *delegate* their wallet to some relayer to match on
their behalf. Note that there is a semi-trusted relationship between the user
and their relayer(s); since relayers have the ability to match and settle
outstanding orders in a wallet, they must be able to view the wallet in order
to proceed with MPCs.

To implement this, we define a **key hierarchy** of five different keys with
varying levels of authority, from the Ethereum keypair (most authoritative) to
the view keypair (least authoritative).

<Figure
  LightImage={SuperRelayerLight}
  DarkImage={SuperRelayerDark}
  isSvg={true}
  caption=""
  width="60%"
/>

Each keypair is derivable by knowing the secret key of any keypair further up
in the hierarchy. For example, if someone knows the root secret key, they can
derive the settle secret key; but if someone only knows the view secret key,
they cannot derive any of the other secret keys.

More specificically, each keypair has the following authority:
- The **root keypair** has full authority of a user's wallet; knowing the root
  secret key lets you arbitrarily deposit, withdraw, update, and cancel orders.
- The **match keypair** can match outstanding orders in the wallet by
  performing MPCs.
- The **settle keypair** can settle out previous matches, or settle out
  transfers from a different user inside of the dark pool.
- The **view keypair** can view the unencrypted wallet, but perform no
  operations to it.

For full details on how the various keys are derived and what precise authority
each key has, see the [whitepaper](/getting-started/whitepaper).

## Keypair Delegation

*Delegating* a wallet to a relayer means revealing one of the secret
keys in the key hierarchy to the relayer. There are two different options for
delegation trust relationships:

If you are **using someone else's relayer** (e.g., the Public Gateway), then
you send the match secret key to the relayer. This allows the relayer to view,
match, and settle your trades, but does not allow the relayer to place new
trades or cancel old ones. To update orders, you must mutate the wallet itself
with your root keypair.

If you are **using your own relayer**, you can either send the match secret key
as before and have the same functionality as someone else's relayer, or you can
send the root secret key to the relayer to operate in **super-relay mode**.

Notably, if you are running in super-relay mode, the relayer can bypass
on-chain verification entirely for order placement and cancellation. If the
relayer knows the root secret key, they are allowed to handshake on arbitrary
orders, not just ones that have been registered in your wallet.

Super-relay mode is optimal for sophisticated users who run their own
infrastructure and are particularly fee and latency sensitive, as it allows for
zero-fee placements and canecellations with zero latency if your trading logic
is colocated with your relayer.
