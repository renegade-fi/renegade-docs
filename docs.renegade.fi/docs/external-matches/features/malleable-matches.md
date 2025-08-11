---
title: Malleable Matches
hide_title: true
sidebar_position: 2
description: Malleable matches allow traders to decide the match size after the transaction is assembled.
slug: /external-matches/features/malleable-matches
---

## Malleable Matches

Malleable matches allow traders to decide the match size after the transaction is assembled. This is useful for traders who want to compose a larger route using a Renegade leg as one of the trades. In these cases, the exact trade size might not be known until the full route is assembled.

Requesting a malleable match is done at assembly time, by using the `assemble_malleable_quote` method. 

```rust
let mut bundle = client.assemble_malleable_quote(quote).await?.expect("No bundle");
let quote_amt = 10_000_000; // $10 USDC
bundle.set_quote_amount(quote_amt);

// Generate calldata and submit
let tx = bundle.settlement_tx();
// ... Submit using alloy or ethers ... //
```

Malleable matches inherit all the options from the standard assembly request; shared bundles, gas sponsorship, etc.

See the following examples for language-specific implementation details:
- [Rust](https://github.com/renegade-fi/rust-sdk/blob/main/examples/external_match/malleable_match.rs)
- [TypeScript](https://github.com/renegade-fi/typescript-external-match-client/blob/main/examples/malleable_external_match.ts)