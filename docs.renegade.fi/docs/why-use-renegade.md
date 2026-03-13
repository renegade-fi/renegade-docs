---
sidebar_position: 0
title: Why Use Renegade?
description: Why trade on Renegade, the on-chain dark pool.
slug: /
---

# Why Use Renegade?

Renegade is a crossing network for spot liquidity at the Binance midpoint
price. At the time of writing, we settle **>$100M** a day from retail
aggregators. Many types of traders can therefore see price improvement through
Renegade:

- **Liquid Token Funds**. Instead of trading against an OTC desk's spread,
  takers can directly cross their orders against counter-flow at the midpoint
  price.
- **Market Makers**. If one market maker is long some asset and another is
  short the same asset, the desks can anonymously net out these two positions
  against each other, balancing inventory without needing to cross a public
  spread.
- **AMM Takers**. Traders who move $5k+ at once through on-chain DEXes often
  incur significant price impact, get sandwiched by MEV searchers, and lose
  money to cross-exchange arbitrage. With Renegade, trades are always
  guaranteed to execute at midpoint prices.

In addition to avoiding the counterparty risk that exists in centralized
exchanges and OTC desks, Renegade solves many problems in current spot markets,
ultimately giving traders optimal execution:

- **Midpoint execution.** All trades clear at the real-time Binance midpoint
  price. There is never any spread or price impact when using Renegade.
- **Opt-in privacy.** Traders have the choice of low-latency trade execution in
  the clear, or to hide all or some details about each trade using
  zero-knowledge proofs. The latter allows large trades that would normally
  move the market when rested on an order book or detected in the mempool to be
  filled privately, and also prevents third-parties from tracking and copying
  their trading strategies.
- **Zero MEV.** Since validators only ever see zero-knowledge proofs of valid
  trades, there is no ability for block producers to front-run, back-run, or
  sandwich your trades.
