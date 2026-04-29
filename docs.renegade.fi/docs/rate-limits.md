---
title: Rate Limits
description: Rate limits for the Renegade External Matches API and Relayer API.
---

# Rate Limits

All rate limits are per-API key unless otherwise noted. Exceeding a rate limit
will result in a `429 Too Many Requests` error.

Custom per-key rate limits are available. Reach out to us via
[Telegram](https://t.me/chrisliambender) to request an adjustment.

## External Matches API

### Quote

**500 requests per minute** per API key.

### Assemble

**500 unsettled bundles per minute** per API key.

An **unsettled bundle** is a bundle that has not yet been submitted on-chain.

### Quote Timeout

The current quote timeout is **10 seconds**. A quote submitted to the assemble
endpoint after this timeout will be rejected.

### Gas Sponsorship

Each API key has a default daily cap of **$25 USD** on gas sponsorship. Once
the cap is reached, further requests will not be sponsored until the limit
resets the following day (UTC).

## Error Handling

When a rate limit is exceeded, the API returns a `429 Too Many Requests` HTTP
status code. Clients should implement exponential backoff and retry logic when
encountering this error.
