---
sidebar_position: 1
title: Introduction
hide_title: true
slug: /
---

import Figure from '../../src/figure.js'
import logoLight from '@site/static/img/logo_light.svg'
import logoDark from '@site/static/img/logo_dark.svg'

<Figure
  LightImage={logoLight}
  DarkImage={logoDark}
  isSvg={true}
  suppressOnMobile={true}
  paddingTop="35px"
  width="40%"
/>

Renegade is a new type of decentralized exchange, an **on-chain dark pool**.

Current DEXes are completely transparent: Anyone can see your balances and
trade history. In contrast, Renegade gives you **universal trade privacy**.
That means that your trading activity is completely obscured from all
third-parties, both before and after a trade is filled. No one except you can
learn the details of your balances or trades.

## How is this Better?

Renegade solves many problems in current DeFi spot markets, ultimately giving
you better prices:
1. **Pre-trade privacy**. Before your trade is matched, no one can see any
   details of your order. Larger trades that would normally move the market
   when rested on an order book or detected in the mempool can now be filled
   privately.
1. **Post-trade privacy**. After an order is filled, only the counterparty
   learns what assets were swapped. This prevents third-parties from tracking
   and copying your trading strategies.
1. **Minimal MEV**. Since validators only ever see zero-knowledge proofs of
   valid trades, there is no ability for block producers to front-run, back-run,
   or sandwich your trades.

By default, trades on Renegade are **anonymous crosses** that trade at the
theoretically-optimal midpoint price, with no market makers taking a spread.
However, Renegade optionally implements [[Indications of
Interest]](/advanced-concepts/ioi) to allow for full price discovery and better
liquidity provision.

## Who uses Renegade?

Given the wide range of information leakage problems that exist in current DeFi
systems, many different types of traders can see price improvement with
Renegade:

- **OTC Desks and Market Makers**. If one market maker is long some asset and
  another is short the same asset, the desks can anonymously net out these two
  positions against each other, decreasing their return variance while still
  providing the same expected returns for both desks.
- **Privacy-Conscious Crypto-Natives**. Renegade maintains complete anonymity,
  meaning that no third-party can see any details about trade or payments
  history.
- **AMM Takers**. Traders who move $5k+ at once through on-chain DEXes often
  incur significant price slippage and cross-exchange arbitrage; by using the
  dark pool, trades are always guaranteed to execute at midpoint prices.

## Overview of the Docs

For a high-level background on the role of dark pools in traditional finance
and how we can translate them into a crypto context, check out [[What is a Dark
Pool]](/core-concepts/dark-pool-explainer) and to better understand the idea of
multi-party computation and how it allows for order matching without leaking
information, see [[What is MPC]](/core-concepts/mpc-explainer).

To understand how we integrate MPC matching with zero-knowledge settlement, see
[[The MPC-ZKP Architecture]](/core-concepts/mpc-zkp) and check out [[Lifecycle
and Privacy]](/core-concepts/privacy) to see how we this MPC-ZKP architecture
guarantees maximal privacy while trading, solving all three types of problems
above.

For more advanced concepts, including the ideas of Indications of Interest
and Super Relayers, see the [[Advanced Concepts]](/advanced-concepts/ioi).
And finally, for the most precise description of the protocol, see the detailed
[[Whitepaper]](/getting-started/whitepaper).

## Contact Information
- [@renegade_fi](https://twitter.com/renegade_fi) on Twitter.
- [chris@renegade.fi](mailto:chris@renegade.fi) via email.
- [Discord](https://discord.gg/renegade-fi) for quick questions.
- [Jobs](https://jobs.renegade.fi) for careers.
