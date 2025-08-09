---
title: Order Book Info
hide_title: true
sidebar_position: 4
description: Endpoints which return metadata about the order book.
slug: /external-matches/features/order-book-info
---

## Order Book Info

The external match API also provides a set of support endpoints which return order book metadata.

### Supported Tokens

The supported tokens endpoint returns a list of tokens which may be used in external matches.

```rust
let tokens = client.get_supported_tokens().await?;
```

See the [example here](https://github.com/renegade-fi/rust-sdk/blob/main/examples/order_book/supported_tokens.rs).

### Order Book Depth

The order book depth endpoint returns the bid and ask book depths for a given pair or all pairs.

```rust
const TOKEN = "0x123";
let depth = client.get_order_book_depth(TOKEN).await?;
let depth = client.get_order_book_depth_all_pairs().await?;
```

See the examples below:
- [Single Pair](https://github.com/renegade-fi/rust-sdk/blob/main/examples/order_book/order_book_depth.rs)
- [All Pairs](https://github.com/renegade-fi/rust-sdk/blob/main/examples/order_book/all_pairs_depth.rs)

### Token Prices

The token prices endpoint returns the current price of the tokens on the Renegade book.

```rust
let token_prices = client.get_token_prices().await?;
```

See the [example here](https://github.com/renegade-fi/rust-sdk/blob/main/examples/order_book/token_prices.rs).
