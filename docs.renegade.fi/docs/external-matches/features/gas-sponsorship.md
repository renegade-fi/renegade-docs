---
sidebar_position: 1
title: Gas Sponsorship
hide_title: true
description: How gas sponsorship works for Renegade External Matches
slug: /external-matches/features/gas-sponsorship
---

import Figure from '../../../src/figure.js'
import LogoLight from '@site/static/img/logo_light.svg'
import LogoDark from '@site/static/img/logo_dark.svg'

<div style={{ minHeight: "70px"}}>
  <Figure
    LightImage={LogoLight}
    DarkImage={LogoDark}
    isSvg={true}
    width="40%"
    widthMobile="70%"
  />
</div>

## Gas Sponsorship
The Renegade relayer will cover the gas cost of external match transactions, up to a daily limit. When requested, the relayer will re-route the settlement transaction through a gas rebate contract. This contract refunds the cost of the transaction, either in native Ether, or in terms of the receive token in the external match. The rebate can optionally be sent to a configured address.

### In-Kind Sponsorship

In-kind sponsorship is the default API behavior. This will refund the gas cost in the receive token of the match; which is equivalent to giving the receiver a better price.

If no refund address is given, the rebate is sent to the receiver of the match, which defaults to `msg.sender`.

:::info
In-kind gas sponsorship is enabled by default.
:::

### Native ETH Sponsorship

If you would like to refund the gas cost in native ETH, you can do so by setting the `refund_native_eth` flag to `true` when requesting a quote.

If no refund address is given the rebate is sent to `tx.origin`.

```rust
let refund_address = "0x...";
let options = RequestQuoteOptions::new()
    .with_refund_native_eth()
    .with_gas_refund_address(refund_address);
let quote = client.request_quote_with_options(quote_request, options);
```

### Disabling Gas Sponsorship

If you would like to disable gas sponsorship, you can do so by setting the `disable_gas_sponsorship` flag to `true` when requesting a quote.

```rust
let options = RequestQuoteOptions::new().disable_gas_sponsorship();
let quote = client.request_quote_with_options(quote_request, options);
```



