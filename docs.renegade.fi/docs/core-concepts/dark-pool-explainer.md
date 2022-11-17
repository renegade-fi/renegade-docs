---
sidebar_position: 1
---

import Figure from '../../src/figure.js'
import OrderbookLight from '@site/static/img/orderbook_light.png'
import OrderbookDark from '@site/static/img/orderbook_dark.png'
import StateLight from '@site/static/img/state_light.svg'
import StateDark from '@site/static/img/state_dark.svg'
import StateMobileLight from '@site/static/img/state_mobile_light.svg'
import StateMobileDark from '@site/static/img/state_mobile_dark.svg'

# What is a Dark Pool?

Dark pools are new to crypto, but are well-understood aspects of traditional
finance market structure, where "dark" off-exchange trading accounts for
[30-50%](https://www.cboe.com/us/equities/market_share/) of equities volume.
At their core, dark pools are functionally equivalent to the more familiar
"lit" stock exchanges like the NSYE or NASDAQ. Users can deposit funds into the
dark pool, place and cancel orders, and learn when their outstanding orders are
matched with other traders.

However, there is one core difference between lit and dark trading: **In a dark
pool, the order book is not publicly visible**, meaning that individual traders
*only* know their own orders (and matches on those orders).  Traders in a dark
pool can never see the outstanding orders of others.

<Figure
  LightImage={OrderbookLight}
  DarkImage={OrderbookDark}
  isSvg={false}
  caption="A lit order book. A dark pool's order book is not publicly visible."
/>

Why would any trader prefer executing their orders in the dark? Since dark
pools obfuscate the order book, they tend to be popular venues for large
"whale" traders who are moving large blocks of equities at once, without
alerting the wider market to their activity.

Hiding the order book is useful for a simple micro-economic reason: If you
reveal too much about your trading strategies, others can use that against you.
For example, if market makers see a large resting sell order for an asset, the
market will fade the quotes downward, leading to an inferior execution price
for the sophisticated whale trader.

## Dark Pools in Crypto

Lit order books are often worse environments for traders, particularly whale
traders who are moving large size. In the context of decentralized crypto
exchanges, however, the whale trade problem is even worse. Not only do current
DEXes leak the current state of the order book, but they **leak all possible
state!** Past state is queryable with an archive node, current state is visible
with any light client or RPC node, and future state is even estimatable by
looking at the mempool.

<Figure
  LightImage={StateLight}
  DarkImage={StateDark}
  LightImageMobile={StateMobileLight}
  DarkImageMobile={StateMobileDark}
  isSvg={true}
  caption="With a blockchain, state is necessarily public."
/>

Since exchange state is always public, it exposes traders to even worse forms
of information leakage, ultimately leading to even worse execution prices:

- **Pre-trade Quote Fading**. Just as with TradFi lit exchanges, if a large
  non-marketable order is rested on a book, all other traders can see the large
  buy or sell wall, leading to inflated or depressed prices as the order book
  slips out from under the whale trader.
- **Atomic MEV**. Since a block producer has authority to arbitrarily reorder,
  insert, and censor transactions, they can use the visible price impact of any
  unconfirmed trade to atomically sandwich trades for risk-free profit.
- **Copy-Trading**. Anyone can see the token balances of any wallet,
  so copy-trading becomes particularly easy.
- **Counterparty Discrimination**. Since the past trades of any wallet address
  are visible, market makers can give worse quotes (or even refuse to execute
  trades) to sophisticated, toxic counterparties.
- **Statistical Arbitrage**. Since the identity of each trader is visible, it
  becomes much easier to draw statistical patterns about every trader's
  strategy and profitability. Strategies like TWAP trading (time-weighted
  average price), which are often used to massage a large order into the market
  over time, become more exploitable.

Intuitively, it seems difficult to solve these problems in a crypto context:
Isn't the whole point of a blockchain that state is replicated across many
permissionless validators? However, by leveraging recent advances in
cryptography, we can create a system that is both trustless and verifiable,
while maintaining universal trade privacy.

With Renegade, we solve (or at least significantly mitigate) all of these
problems. Using multi-party computation (MPC) to determine order matching and
zero-knowledge proofs (ZKP) to settle matched orders, Renegade maintains
end-to-end privacy, both before an order is filled and after it is settled
on-chain.

To understand how we use the idea of *local private state* combined with the
building blocks of MPC and ZKPs to guarantee complete privacy, see [[What is
MPC]](/core-concepts/mpc-explainer) and [[The MPC-ZKP
Architecture]](/core-concepts/mpc-zkp), and to see precisely is meant by
"end-to-end privacy", see [[Lifecycle and Privacy]](/core-concepts/privacy).
