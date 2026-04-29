---
sidebar_position: 1
title: Integration Quickstart
hide_title: true
description: Renegade is the on-chain dark pool.
slug: /integration-quickstart
---

# Integration Quickstart

There are two ways to integrate with Renegade’s liquidity: **Direct Matches** and **Solver RFQ**.

## Direct Matches

Integrating via direct matches will give your more liquidity and lower fees
than integration via solver RFQ. The only requirement, however, is that you
actually have custody over whatever funds you’re looking to trade.

Direct matches tend to be the best fit for market-neutral funds (including
market makers), any searcher running cross-chain or CEX-DEX arbitrage, or any
liquid fund running systematic strategies.

At its core, a direct match integration simply consists of ERC-20 approving our
settlement contract out of an EOA or smart contract wallet, then communicating
with our backend API to place/cancel orders that are tied to the Binance
midpoint; the Renegade backend will handle actual settlement.

**Get started with our [Direct Match
Quickstart](./integration-quickstart/direct-matches).**

## Solver RFQ

Integrating via the solver RFQ will have strictly less liquidity and higher
fees than the direct match integration, but has the benefit of not requiring
custody over the tokens you’re trading.

Solver RFQ tends to be necessary for DEX aggregators, searchers that strictly
trade atomically (e.g. DEX-DEX arbitrage), or solvers who do not maintain any
onchain inventory.

At its core, a solver RFQ integration follows the typical “quote-assemble”
pattern that most onchain RFQs support. You hit our backend with a requested
route, and we return calldata that you can use as a part of any route
settlement.

**Get started with our [Solver RFQ
Quickstart](./integration-quickstart/solver-rfqs).**
