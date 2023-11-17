---
sidebar_position: 1
title: Introduction
hide_title: true
description: Renegade is the on-chain dark pool. MPC-based DEX for anonymous crosses at midpoint prices.
slug: /
---

import Figure from '../../src/figure.js'
import LogoLight from '@site/static/img/logo_light.svg'
import LogoDark from '@site/static/img/logo_dark.svg'

<head>
  <script type="application/ld+json">
    {JSON.stringify({
      '@context': 'https://schema.org/',
      '@type': 'Organization',
      name: 'Renegade',
      url: 'https://renegade.fi/',
      logo: 'https://renegade-assets.s3.us-east-2.amazonaws.com/glyph-light.svg',
      sameAs: ["https://twitter.com/renegade_fi"],
    })}
  </script>
</head>

<div style={{ minHeight: "70px"}}>
  <Figure
    LightImage={LogoLight}
    DarkImage={LogoDark}
    isSvg={true}
    width="40%"
    widthMobile="70%"
  />
</div>

Renegade is a new type of decentralized exchange, an **on-chain dark pool**.

Current DEXes are completely transparent: Anyone can see your balances and
trade history. In contrast, Renegade gives you **universal trade privacy**.
That means that your trading activity is completely obscured from all
third-parties, both before and after a trade is filled. No one except you can
learn the details of your balances or trades.

## Why use Renegade?

In addition to avoiding the counterparty risk that exists in centralized
exchanges and OTC desks, Renegade solves many problems in current DeFi spot
markets, ultimately giving you better prices and optimal execution:

1. **Pre-trade privacy**. Before your trade is matched, no one can see any
   details of your order. Larger trades that would normally move the market
   when rested on an order book or detected in the mempool can now be filled
   privately.
1. **Post-trade privacy**. After an order is filled, only the counterparty
   learns what assets were swapped. This prevents third-parties from tracking
   and copying your trading strategies.
1. **Zero MEV**. Since validators only ever see zero-knowledge proofs of
   valid trades, there is no ability for block producers to front-run, back-run,
   or sandwich your trades.
1. **Midpoint execution**. All trades clear directly at the real-time aggregate
   CEX midpoint price. Trades do not need to cross a spread, and there is never
   any slippage.

By default, trades on Renegade are **anonymous crosses** that trade at the
theoretically-optimal midpoint price. However, Renegade optionally implements
[Indications of Interest](/advanced-concepts/ioi) to allow for full price
discovery and better liquidity provision.

## Who uses Renegade?

Given the wide range of information leakage problems that exist in current DeFi
systems, many different types of traders can see price improvement with
Renegade:

- **Market Makers**. If one market maker is long some asset and another is
  short the same asset, the desks can anonymously net out these two positions
  against each other, balancing inventory without needing to cross a public
  spread.
- **OTC Takers**. Instead of trading against an OTC desk's spread, takers can
  directly cross their orders against counter-flow at the midpoint price.
- **AMM Takers**. Traders who move $5k+ at once through on-chain DEXes often
  incur significant price impact, get sandwiched by MEV searchers, and lose
  money to cross-exchange arbitrage. With Renegade, trades are always
  guaranteed to execute at midpoint prices.
- **Privacy-Conscious Crypto-Natives**. Renegade maintains complete anonymity,
  meaning that no third-party can see any details about trade or payments
  history.

## Overview of the Docs

For a high-level background on the role of dark pools in traditional finance
and how we can translate them into a crypto context, check out [What is a Dark
Pool](/core-concepts/dark-pool-explainer) and to better understand the idea of
multi-party computation and how it allows for order matching without leaking
information, see [What is MPC](/core-concepts/mpc-explainer).

To understand how we integrate MPC matching with zero-knowledge settlement, see
[The MPC-ZKP Architecture](/core-concepts/mpc-zkp) and check out [Lifecycle and
Privacy](/core-concepts/privacy) to see how we this MPC-ZKP architecture
guarantees maximal privacy while trading.

For more advanced concepts, including the ideas of Indications of Interest and
Super Relayers, see the [Advanced Concepts](/advanced-concepts/ioi). And
finally, for the most precise description of the protocol, see the detailed
[Whitepaper](/getting-started/whitepaper).

## Get Access to Renegade

Renegade is currently in an internal testnet, with a public testnet expected in
Q2 2023. The network will be rolled out to whitelisted testnet participants
over time: [Sign up here](https://renegadefi.typeform.com/access) for priority
access.

Otherwise, feel free to contact us with any questions or feedback:

- [@renegade_fi](https://twitter.com/renegade_fi) on Twitter.
- [chris@renegade.fi](mailto:chris@renegade.fi) via email.
- [Discord](https://discord.gg/renegade-fi) for quick questions.
- [Jobs](https://jobs.renegade.fi) for careers.
