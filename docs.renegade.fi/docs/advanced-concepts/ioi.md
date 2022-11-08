---
sidebar_position: 1
---

import Figure from '../../src/figure.js'
import IoiLight from '@site/static/img/ioi_light.svg'
import IoiDark from '@site/static/img/ioi_dark.svg'

# Indications of Interest

As discussed in [[Anonymity Guarantees]](/basic-concepts/guarantees), the
base-layer protocol has very strong privacy properties: No information
whatsoever is leaked to third-parties, both before and after a trade is matched
and settled.

This is optimal from an execution quality point-of-view, but comes with a
tradeoff: No one can see the pending order, so traders must wait for natural
counter-flow on the other side. Instead of waiting in the dark, Renegade
optionally allows for **indications of interest** flags, trading off execution
quality for execution latency.

Indications of interest are optional flags that traders may include in their
handshake, which advertise certain properties of the order. Renegade supports
any subset of the following indications:

- **Order type** (limit or midpoint-pegged).
- **Base/quote pair** (e.g. WETH/USDC).
- **Side** (buy or sell).
- **Limit price** (e.g. 1500 WETH/USDC).
- **Size** (e.g., 100 WETH).
- **Minimum Fill Size** (e.g., at least 10 WETH at a time).

All of these indications of interest are implement as zero-knowledge
predicates, which must be proven inside of the handshake tuple to ensure that
the indications are legitimate.

<Figure
  LightImage={IoiLight}
  DarkImage={IoiDark}
  isSvg={true}
  caption="Indications of interest are optional predicates to increase liquidity."
  width="70%"
  paddingBottom="0px"
/>

## Lit Order Book

By using these indications of interest, traders can leak some privacy, in
exchange for attracting counter-flow to their order. For example, the trader
could broadcast that their order is a buy order for WETH/USDC at the midpoint,
without revealing the true size behind the order.

Interestingly, when all indications of interest are turned on and proven as a
part of the handshake tuple, **the order becomes lit**! Indeed, we can
naturally embed an in-memory lit CLOB inside of Renegade with natural dark-lit
crossovers.
