---
title: Shared Bundles
hide_title: true
sidebar_position: 3
description: Shared bundles allow traders to sacrifice exclusivity for higher assembly rate limits.
slug: /external-matches/features/shared-matches
---

## Shared Bundles

Shared matches allow traders to sacrifice exclusivity for higher assembly rate limits. 

In the standard case, when `allow_shared` is set to `false`, the API server will lock-up capital on the backend for some timeout waiting for a trade to settle (currently 20 seconds). This prevents other traders from matching against the order before the exclusivity window elapses. However, locking up capital requires very strict rate limits (currently 10 req/min).

If, instead, `allow_shared` is set to `true`; the API will forego the exclusive lock and instead return a "shared bundle". Using a shared bundle is no different than a standard bundle except for the exclusivity guarantees. Using a shared bundle creates a very small chance that the bundle may be settled by another trader, but shared bundles may be assembled much more frequently. The current shared-bundle rate limit is 200 req/min.

### Using Shared Bundles

To use a shared bundle, simply set the `allow_shared` flag to `true` when assembling a quote.

```rust
let options = AssembleQuoteOptions::new().with_allow_shared(true);
let bundle = client.assemble_quote_with_options(quote, options).await?.expect("No bundle");
```

See the following examples for language-specific implementation details:
- [Rust](https://github.com/renegade-fi/rust-sdk/blob/main/examples/external_match/shared_bundle.rs)
- [Golang](https://github.com/renegade-fi/golang-sdk/blob/main/examples/09_shared_bundle/main.go)
- [TypeScript](https://github.com/renegade-fi/typescript-external-match-client/blob/main/examples/shared_bundle.ts)
- [Python](https://github.com/renegade-fi/python-sdk/blob/main/examples/shared_bundle.py)