---
sidebar_position: 4
title: Notes & Rate Limits
hide_title: true
description: Usage notes, limits, and resiliency guidance for the External Matches API
slug: /external-matches/notes-and-rate-limits
---

## Notes

### Authentication
The External Match API requires an API key and secret. Reach out to us via [Telegram](https://t.me/jkraut) to get access.

### Environments
Currently the API supports matches on Arbitrum One and Base Mainnet. Each client has chain-specific constructors which will set the correct base URLs for the API. For example, the Arbitrum Sepolia API is available at `https://arbitrum-sepolia.auth-server.renegade.fi`.

### Quote Duration

As mentioned in the [Overview](/external-matches), the price between the quote and assemble steps is firm. However, this requires a timeout to prevent excessively stale quotes being assembled into transactions.

The current quote timeout is **10 seconds**. A quote submitted to the assemble endpoint after this timeout will be rejected.

## Rate limits

The per-endpoint rate limits are as follows:
- **Quote**: 500 requests per minute
- **Assemble (With Shared Bundles)**: 200 unsettled bundles per minute
- **Assemble (Without Shared Bundles)**: 10 unsettled bundles per minute

An **unsettled bundle** is a bundle which was not submitted on-chain. The API server will watch for settlements and add back a rate limit token to the API key for each settlement.

The rate limits are per-API key. Exceeding the rate limits will result in a `429 Too Many Requests` error.

### Error Handling
The API returns standard HTTP status codes for errors.