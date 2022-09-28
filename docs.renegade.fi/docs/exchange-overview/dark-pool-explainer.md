---
sidebar_position: 1
---

# What is a Dark Pool?

Dark pools are new to crypto, but are a borrowed idea from traditional finance.
In the traditional equities trading world, dark pools are responsible for [a
large chunk](https://todo) of total trading volume.

## For Traditional Finance

Dark pools are constrasted with “lit” stock exchanges like the NYSE or NASDAQ.
At its core, the difference between a “dark” exchange and a “lit” exchange is
that lit venues display quotations (i.e., resting orders) to everyone, whereas
dark venues obfuscate resting order information.

![](@site/static/img/orderbook.png)

*In a lit market, anyone can see all the resting orders.*

Because dark pools obfuscate the orderbook, they tend to be popular ventures
for large “whale” traders who try to move large blocks of equities at once,
without alerting the wider market to their activity.

Hiding the orderbook is great for a simple game-theoretic reason: If you reveal
too much about your trading strategies, others can use that against you. If the
market sees a large resting sell order for an asset, the market will fade the
quotes downward, leading to an inferior price for the sophisticated whale
trader.

## For Decentralized Finance

For decentralized exchanges, the whale trade problem is even worse: Not only do
current DEXes not hide the orderbooks / liquidity state, but they also expose
traders to even more forms of manipulation.

(1) A commonly-understood problem is Miner Extractable Value (MEV). Since block
producers have the ultimate ability to construct the transactions in a block,
they can arbitrarily order, insert, or censor transactions, leading to
front-running and sandwich attacks.

For our protocol, we generate zero-knowledge proofs of valid trades on the
client-side, so that block producers have no visibility into what assets are
being swapped or by which traders. This prevents any malicious MEV on the block
producer’s side.

(2) Another issue with current DeFi spot markets is pre-trade privacy. That is,
before an order is filled, information about the contents of the order is
leaked to the wider ecosystem. For example, a market maker can see the wallet
address of their potential counterparty, and quote a much wider spread for
whale traders with large balance sheets.

With Renegade, all trading activity is done via a multi-party computation (MPC)
protocol, so that no trading information leaks in advance of matching.
Counterparties or mempool observers learn nothing about your resting trades.

(3) A final concern with DeFi trading is post-trade privacy. After an order has
been filled and confirmed by the network, a permanent record of traders’
activity is left on-chain, allowing for any third-party to scrape and analyze
to steal trading strategies or portfolio compositions.

In our case, the only permanent record left on-chain is a zero-knowledge proof
of a valid match between traders. ZK proofs hide all information about specific
assets/amounts/prices, leaking no information on-chain.

