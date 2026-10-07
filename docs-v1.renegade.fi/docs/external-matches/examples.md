---
sidebar_position: 2
title: Usage & Examples
hide_title: true
description: Examples of the Renegade External Matches API
slug: /external-matches/examples
---

# Examples

The following examples are provided in Rust, however each SDK provides runnable examples in their respective repositories:
- [Rust](https://github.com/renegade-fi/rust-sdk/tree/main/examples/external_match)
- [Golang](https://github.com/renegade-fi/golang-sdk/tree/main/examples)
- [Typescript](https://github.com/renegade-fi/typescript-sdk/tree/main/examples/external-match)
- [Python](https://github.com/renegade-fi/python-sdk/tree/main/examples)

## Basic Quote + Assemble Example

The following is an example using the [Rust SDK](https://github.com/renegade-fi/rust-sdk/blob/main/examples/external_match/external_match.rs) to request a quote, assemble it into a transaction, then submit it on-chain.

```rust
use renegade_sdk::{
    types::{ExternalOrder, OrderSide},
    ExternalMatchClient, ExternalOrderBuilder,
};

/// The base mint
const BASE_MINT = "0xc3414a7ef14aaaa9c4522dfc00a4e66e74e9c25a"; // Arbitrum Sepolia WETH
/// The quote mint, currently only USDC-quoted pairs are supported
const QUOTE_MINT = "0xdf8d259c04020562717557f2b5a3cf28e92707d1"; // Arbitrum Sepolia USDC

#[tokio::main]
async fn main() {
    // Create a client with your API key and secret
    let api_key = std::env::var("EXTERNAL_MATCH_KEY").unwrap();
    let api_secret = std::env::var("EXTERNAL_MATCH_SECRET").unwrap();
    let client = ExternalMatchClient::new_arbitrum_sepolia_client(&api_key, &api_secret).unwrap();

    // Request a quote
    let amt = 1 * 10_u64.pow(18); // 1 WETH
    let order = ExternalOrderBuilder::new()
        .base_mint(BASE_MINT)
        .quote_mint(QUOTE_MINT)
        .base_amount(amt)
        .side(OrderSide::Sell)
        .build()
        .unwrap();
    
    let res = client.request_quote(order).await?;
    let quote = match res {
        Some(quote) => quote,
        None => eyre::bail!("No quote found"),
    };

    // ... Validate the quote, compare against other venues, etc ... //

    // Assemble the quote into a bundle
    let resp = match client.assemble_quote(quote).await? {
        Some(resp) => resp,
        None => eyre::bail!("No bundle found"),
    };

    // Submit the bundle
    let tx = resp.match_bundle.settlement_tx;
    // ... Send via alloy or ethers rpc client ... //
}
```

### When to Assemble an Order
The intent of the two-step flow is to allow traders to verify Renegade quotes and compare them against other venues. It is recommended to only assemble quotes which are intended to be submitted on chain.

:::warning
The quote endpoint has a much higher rate limit than the assemble endpoint (see [Rate Limits](/external-matches/notes-and-rate-limits#rate-limits)). Most traders will quote much more often than they assemble, and only assemble when they are ready to submit the trade on chain.
:::

## Configuring Orders

The `ExternalOrderBuilder` provides the following options:

- `quote_mint` (**Required**): The mint (ERC-20 address) of the quote token.
- `base_mint` (**Required**): The mint (ERC-20 address) of the base token.
- `base_amount`: The amount of base token for the order.
- `quote_amount`: The amount of quote token for the order.
- `exact_base_output`: The *exact* amount of base token that the order should output. Use this field with care, setting an exact amount may result in fewer matches.
- `exact_quote_output`: The *exact* amount of quote token that the order should output. Use this field with care, setting an exact amount may result in fewer matches.
- `side` (**Required**): The side of the order (`Buy` or `Sell`). In Renegade, the side is always relative to the base token; so a `Buy` order buys the base token, and `Sell` order sells the base token.
- `min_fill_size`: The minimum fill size, no partial matches below this size will be returned.

**Notes:**

- Exactly one of `base_amount`, `quote_amount`, `exact_base_output`, or `exact_quote_output` is required.
- `min_fill_size` is in units of the specified amount field (so if `base_amount` is specified, then `min_fill_size` is in units of the base token).

### Order Builder Examples

**Using `min_fill_size`**

```rust
// Only partial matches of at least 0.5 WETH will be returned
let amount = 1 * 10_u64.pow(18); // 1 WETH
let order = ExternalOrderBuilder::new()
    .base_mint(BASE_MINT)
    .quote_mint(QUOTE_MINT)
    .side(OrderSide::Sell)
    .base_amount(amount)
    .min_fill_size(amount / 2) // 0.5 WETH
    .build()?;
```

**Using `exact_base_output`**

```rust
// Only fills of exactly 1 WETH will be returned
// This gives a "fill-or-kill" behavior
let amount = 1 * 10_u64.pow(18); // 1 WETH
let order = ExternalOrderBuilder::new()
    .base_mint(BASE_MINT)
    .quote_mint(QUOTE_MINT)
    .side(OrderSide::Sell)
    .exact_base_output(amount)
    .build()?;
```

## Request Options

### Quote Options

The quote endpoint accepts the following options via `request_quote_with_options`:
```rust
pub struct RequestQuoteOptions {
    pub disable_gas_sponsorship: bool,
    pub gas_refund_address: Option<String>,
    pub refund_native_eth: bool,
}
```

See [Gas Sponsorship](/external-matches/features/gas-sponsorship) for more information on gas sponsorship.

### Assemble Options

The assemble endpoint accepts the following options via `assemble_quote_with_options`:

```rust
pub struct AssembleQuoteOptions {
    pub allow_shared: bool,
    pub receiver_address: Option<String>,
    pub updated_order: Option<ExternalOrder>,
}
```

These fields are as follows:
- `allow_shared`: Whether to enable the [Shared Bundles](/external-matches/features/shared-matches) feature.
- `receiver_address`: The address that the darkpool will send funds to.
- `updated_order`: The updated order to use when assembling the quote. You can tweak the order parameters here, but the pair must remain the same.

## Examining a Quote

The quote returned from the API has a number of fields which are useful for understanding the match:
```rust
/// A quote for an external order
pub struct ApiExternalQuote {
    /// The external order
    pub order: ExternalOrder,
    /// The match result
    pub match_result: ApiExternalMatchResult,
    /// The estimated fees for the match
    pub fees: FeeTake,
    /// The amount sent by the external party
    pub send: ApiExternalAssetTransfer,
    /// The amount received by the external party, net of fees
    pub receive: ApiExternalAssetTransfer,
    /// The price of the match
    pub price: ApiTimestampedPrice,
    /// The timestamp of the quote
    pub timestamp: u64,
}
```

### Examining the Price
For example, we can inspect the `price` field to see the price at which the order was matched. Note that this price is **firm**; if you decide to assemble the quote into a transaction, the matching engine will use the price from the quote.
```rust
let resp = client.request_quote(order).await?.expect("No quote found");
let price = resp.signed_quote.quote.price;
println!("Order will execute at: {price}");
``` 

### Computing the Send and Receive Amounts

The `send` and `receive` fields hold the token transfers that will result from the match. They are specified *net of fees*; so they represent the exact amount in and out that the trader will receive.

```rust
let resp = client.request_quote(order).await?.expect("No quote found");
let send = resp.signed_quote.quote.send;
let receive = resp.signed_quote.quote.receive;
let fees = resp.signed_quote.quote.fees;

println!("Sending {} of {}", send.amount, send.mint);
println!("Receiving {} of {}", receive.amount, receive.mint);
println!("Fees: {}", fees.total());
```

:::info
Fees are always taken in the receive side token. So if an order is selling WETH for USDC; the fee will be taken in USDC.
:::