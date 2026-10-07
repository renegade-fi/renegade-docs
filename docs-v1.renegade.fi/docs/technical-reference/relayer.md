---
sidebar_position: 1
description: Using the Relayer API to retrieve aggregated order-book depth for a token.
---

# Relayer API

### Base URL

All requests target the Arbitrum Mainnet environment:

```
https://mainnet.auth-server.renegade.fi:3000
```

### Authentication

All requests must be signed with HMAC-SHA256 and include these headers on every call:

| Header                     | Required | Description                                                       |
| -------------------------- | -------- | ----------------------------------------------------------------- |
| x-renegade-auth-expiration | Yes      | Expiry timestamp in ms since Unix epoch                           |
| x-renegade-auth            | Yes      | HMAC-SHA256 signature of the request, base64-encoded (no padding) |

To sign a request:

- Decode your auth key from base64.
- Build a MAC input by concatenating:
  1. The request path (including leading slash and query string).
  2. All `x-renegade-*` headers except `x-renegade-auth`.
  3. The request body (if any).
- Compute the HMAC-SHA256 digest of this input with your decoded key.
- Base64-encode the digest (strip any `=` padding) and set it as `x-renegade-auth`.

See the TypeScript example for the full implementation [here](https://github.com/renegade-fi/typescript-external-match-client/blob/e39d23843d1cd4a56d6d869496e37e4620393c41/src/http.ts#L170).

## Quickstart Example

A working example can be found in the [Typescript External Match Client repo](https://github.com/renegade-fi/typescript-external-match-client/blob/main/examples/order_book_depth.ts).

## HTTP API

### Get Order Book Depth

Retrieve order-book depth at the midpoint price for a specific base-token mint.

**Endpoint**

```
GET /v0/order_book/depth/{mint}
```

**Path Parameters**

| Name | Type   | Required | Description             |
| ---- | ------ | -------- | ----------------------- |
| mint | string | Yes      | Base token mint address |

**Response**

- Status: **200 OK**
- Content-Type: `application/json`

```json
{
  "price": 1786.7303556244685,
  "timestamp": 1745462587105,
  "buy": {
    "total_quantity": 9336472979533427000,
    "total_quantity_usd": 16681.759687
  },
  "sell": {
    "total_quantity": 11079327039530480000,
    "total_quantity_usd": 19795.769941420083
  }
}
```

Field definitions:

- `price` (number): Current midpoint price in USD
- `timestamp` (integer): Unix epoch in **milliseconds**
- `buy.total_quantity` (bigint): Quantity available to buy, in terms of the base token
- `buy.total_quantity_usd` (number): Quantity available to buy, in terms of USD
- `sell.total_quantity` (bigint): Quantity available to sell, in terms of the base token
- `sell.total_quantity_usd` (number): Quantity available to sell, in terms of USD

### Error Handling

Errors return an HTTP status code plus a plain-text message:

| Status | Example                                                         |
| ------ | --------------------------------------------------------------- |
| 401    | `Unauthorized`                                                  |
| 500    | `UnsupportedPair(Token { addr: "0x…" }, Token { addr: "0x…" })` |
