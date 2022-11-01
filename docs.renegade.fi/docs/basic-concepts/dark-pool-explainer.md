---
sidebar_position: 1
---

import ImageSwitcher from '../../src/imageSwitcher.js'

import orderbookLight from '@site/static/img/orderbook_light.png'
import orderbookDark from '@site/static/img/orderbook_dark.png'
import StateLight from '@site/static/img/state_light.svg'
import StateDark from '@site/static/img/state_dark.svg'

# What is a Dark Pool?

Dark pools are new to crypto, but are well-understood aspects of traditional
finance market structure, where "dark" trading accounts for nearly
[30-50%](https://www.cboe.com/us/equities/market_share/) of equities trading
volume.

At their core, dark pools are functionally equivalent to the "lit" stock
exchanges like the NSYE or NASDAQ, meaning that dark pools perform all the same
operations as lit exchanges: Users can deposit funds into the exchange, place
and cancel orders, and learn when their outstanding orders are matched with
other traders.

However, there is one core difference between the familiar lit exchanges and
dark trading: In a dark pool, the orderbook is not publicly visible, meaning
that individual traders *only* know their own orders (and matches on those
orders). Traders in a dark pool can never see the outstanding orders of others.

<div style={{"display": "flex", flexDirection: "column", alignItems: "center"}}>
  <center style={{width: "40%"}}>
    <ImageSwitcher LightImage={orderbookLight} DarkImage={orderbookDark} />
  </center>
  <center style={{opacity: "60%", fontSize: "0.8em"}}>
    A lit orderbook (you've seen these before).
    A dark pool's orderbook is not publicly visible.
  </center>
</div>

<div style={{height: "20px"}} />

So, the only difference between a dark pool and a lit exchange is that, with
dark trading, the state of the orderbook is only accessible to the operators of
the exchange. Why would any trader prefer executing their orders in the dark?
Since dark pools obfuscate the orderbook, they tend to be popular venues for
large "whale" traders who are moving large blocks of equities at once, without
alerting the wider market to their activity.

Hiding the orderbook is useful for a simple micro-economic reason: If you
reveal too much about your trading strategies, others can use that against you.
For example, if market makers see a large resting sell order for an asset, the
market will fade the quotes downward, leading to an inferior execution price
for the sophisticated whale trader.

## Dark Pools in Crypto

We have seen how lit orderbooks can be bad for traders, particularly whale
traders who are moving large size.

In the context of decentralized crypto exchanges, however, the whale trade
problem is even worse. Not only do current DEXes leak the current state of the
orderbook, but they *leak all possible state!* Past state is queryable with an
archive node, current state is visible with any light client or RPC node, and
future state is even estimatable by looking at the mempool.

<div style={{"display": "flex", flexDirection: "column", alignItems: "center"}}>
  <center style={{width: "40%"}}>
    <ImageSwitcher LightImage={StateLight} DarkImage={StateDark} isSvg={true} />
  </center>
  <center style={{opacity: "60%", fontSize: "0.8em"}}>
    With a blockchain, state is always necessarily public.
  </center>
</div>

<div style={{height: "20px"}} />

Since exchange state is always public, it exposes traders to even worse forms
of information leakage, ultimately leading to even worse execution prices:

- **Pre-trade Price Impact**. Just as with traditional finance lit exchanges,
  if a large non-marketable order is rested on a book, all other traders can
  see the large buy or sell wall, leading to inflated or depressed prices as
  the orderbook slips out from under the whale trader.
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

With Renegade, we solve (or at least significantly mitigate) all of these
problems. By leveraging multi-party computation (MPC) to execute orders and
zero-knowledge proofs (ZKP) to settle orders, Renegade maintains end-to-end
privacy, both before an order is filled and after it is settled on-chain.

To understand how we use the building blocks of MPC and ZKPs to guarantee
complete privacy, see [What is MPC](/basic-concepts/mpc-explainer) and [The
MPC-ZKP Architecture](/basic-concepts/mpc-zkp), and to see precisely is meant
by "end-to-end privacy", see [Anonymity
Guarantees](/basic-concepts/guarantees).

## Who uses Renegade?

Given the wide range of information leakage problems that exist in current DeFi
systems, many different types of traders can see price improvement with
Renegade:

- **OTC Desks**. If one OTC desk is long some asset and another is short the
  same asset, the OTC desks can anonymously net out these two positions against
  each other, decreasing the variance while still providing the same expected
  returns for both desks.
- **Privacy-Conscious Crypto-Natives**. Renegade maintains complete anonymity,
  meaning that no third-party can see any details about trade or payments
  history.
- **Midsize AMM Users**. Traders who move $1-10k at once through on-chain DEXes
  often incur significant price slippage and cross-exchange arbitrage; by using
  the dark pool, trades are always guaranteed to execute at midpoint prices.
