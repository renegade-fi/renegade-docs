---
sidebar_position: 1
title: Overview
hide_title: true
description: Overview of the Renegade External Matches API
slug: /external-matches
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

### Why External Matches?

The **External Match** API provides an interface to the Darkpool which allows users to trade *atomically*. This is best illustrated in contrast to the traditional darkpool user's flow; which is typically the following:
1. Deposit funds into Renegade.
2. Place an order.
3. Wait for the order to cross within the pool.
4. Withdraw funds from Renegade.

Each of these steps requires a separate transaction. Many traders *need* atomicity (CoW Swap solvers, Smart Wallets, etc.) and cannot afford to wait for settlement. 

To solve this, the external match API exposes an [RFQ](https://en.wikipedia.org/wiki/Request_for_quotation)-like interface on top of the Renegade darkpool; allowing users to request a trade and receive a ready-to-execute transaction in response. This transaction effectively bundles together each of the steps listed above, so that the user can execute and settle a trade in a single transaction.

In this way, the trader is "external" to the darkpool.

### The High Level Flow

The high level flow for external match users breaks down into two steps:
1. Request a quote, using the `/v0/matching-engine/quote` endpoint. This endpoint will return a quote object representing the price, fill information, etc.
2. Assemble the quote into a transaction bundle using the `/v0/matching-engine/assemble-external-match` endpoint. This endpoint will return an EVM transaction which the user may sign and submit in order to settle the trade.

:::info
The price is firm between quote and assemble, so the quoted price will be the exact same as in the assembled bundle.
:::

For more information on the request & response types see the [Examples](/external-matches/examples) or the [API Spec](https://github.com/renegade-fi/renegade-docs/blob/main/api-specs/external-match-openapi.yaml).