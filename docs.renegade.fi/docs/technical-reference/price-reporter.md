---
sidebar_position: 1
description: Using the Price Reporter API to retrieve real-time execution prices.
---

# Price Reporter API

## Overview

The Price Reporter API provides real-time prices used by Renegade to execute trades. These prices are sourced from the Binance API and are available for all [Renegade-whitelisted tokens](./useful-addresses.md#whitelisted-tokens).

**Features:**

- Real-time execution prices
- HTTP and WebSocket access
- No authentication required
- Public, rate-limited endpoints

> **Note:** These are the exact prices Renegade uses for all platform trades.

---

## Getting Started

The Price Reporter API is available on both Arbitrum Mainnet and Arbitrum Sepolia testnet.  
**Token addresses are environment-specific**—ensure you use the correct addresses for your target network.

### **Environments**

| Environment | Network          | Chain ID | HTTP Base URL                                     | WebSocket URL                                   |
| ----------- | ---------------- | -------- | ------------------------------------------------- | ----------------------------------------------- |
| Mainnet     | Arbitrum Mainnet | 42161    | `https://mainnet.price-reporter.renegade.fi:3000` | `wss://mainnet.price-reporter.renegade.fi:4000` |
| Testnet     | Arbitrum Sepolia | 421614   | `https://testnet.price-reporter.renegade.fi:3000` | `wss://testnet.price-reporter.renegade.fi:4000` |

> **Note:** Use the correct token addresses for each environment.  
> [View supported tokens.](./useful-addresses#whitelisted-tokens)

### **Authentication**

No authentication is required to access the Price Reporter API. All HTTP and WebSocket endpoints are publicly accessible.

### **Quickstart Examples**

#### **Get Current Price (HTTP)**

```javascript
async function getPrice(topic) {
  const response = await fetch(
    `https://mainnet.price-reporter.renegade.fi:3000/price/${topic}`
  )
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error)
  }
  const price = await response.text()
  return parseFloat(price)
}

// Example usage:
getPrice("renegade-0x82af49447d8a07e3bd95bd0d56f35241523fbab1")
  .then(console.log)
  .catch(console.error)
```

#### **Subscribe to Price Updates (WebSocket)**

```javascript
const ws = new WebSocket("wss://mainnet.price-reporter.renegade.fi:4000")

ws.onmessage = (event) => {
  console.log("Received:", event.data)
}

ws.onopen = () => {
  ws.send(
    JSON.stringify({
      method: "subscribe",
      topic: "renegade-0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    })
  )
}
```

---

## Glossary

**Base Token Address**  
The contract address of the token for which you want the Renegade execution price.

**Topic**  
A string identifier in the format `renegade-{baseTokenAddress}` that specifies a token for price queries or subscriptions.

**Renegade**  
The exchange identifier used in all topics, representing prices as determined and executed by Renegade.

**Mainnet**  
Refers to Arbitrum Mainnet (chain id: 42161).

**Testnet**  
Refers to Arbitrum Sepolia (chain id: 421614).

---

## Price Topic Format

Price topics are used to specify tokens when querying prices or subscribing to updates. The format is:

```
renegade-{baseTokenAddress}
```

| Component          | Description                             |
| ------------------ | --------------------------------------- |
| `renegade`         | Exchange identifier (always "renegade") |
| `baseTokenAddress` | Contract address of the base token      |

**Example (WETH on Arbitrum Mainnet):**

```
renegade-0x82af49447d8a07e3bd95bd0d56f35241523fbab1
```

> **Note:**  
> Use the correct token addresses for your target environment.  
> [View supported tokens.](./useful-addresses#whitelisted-tokens)

---

## HTTP API

### Get Current Price

Retrieve the current Renegade execution price for a specific token.

**Endpoint**

```
GET /price/{topic}
```

**Path Parameters**

| Name  | Type   | Required | Description                                             |
| ----- | ------ | -------- | ------------------------------------------------------- |
| topic | string | Yes      | Token topic in the format `renegade-{baseTokenAddress}` |

**Request Example (JavaScript)**

```javascript
async function getPrice(topic) {
  const response = await fetch(
    `https://mainnet.price-reporter.renegade.fi:3000/price/${topic}`
  )
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error)
  }
  const price = await response.text()
  return parseFloat(price)
}

// Example usage:
getPrice("renegade-0x82af49447d8a07e3bd95bd0d56f35241523fbab1")
  .then(console.log)
  .catch(console.error)
```

**Response**

- **200 OK**

  - Content-Type: `text/plain`
  - Body:
    ```
    1610.3049999999998
    ```

- **404 Not Found**

  - Content-Type: `text/plain`
  - Body:
    ```
    Invalid (exchange, base) tuple
    ```

- **500 Internal Server Error**
  - Content-Type: `text/plain`
  - Body:
    ```
    Internal server error
    ```

**Error Conditions**

- The exchange is not supported (must be `renegade`)
- The topic format is invalid
- The token is not supported or the address is invalid

---

## WebSocket API

### Connection

Connect to the WebSocket endpoint for real-time price updates.

| Environment | WebSocket URL                                   |
| ----------- | ----------------------------------------------- |
| Mainnet     | `wss://mainnet.price-reporter.renegade.fi:4000` |
| Testnet     | `wss://testnet.price-reporter.renegade.fi:4000` |

### Subscribing to Price Updates

**Subscribe to a Topic**

```javascript
ws.send(
  JSON.stringify({
    method: "subscribe",
    topic: "renegade-<baseTokenAddress>",
  })
)
```

**Unsubscribe from a Topic**

```javascript
ws.send(
  JSON.stringify({
    method: "unsubscribe",
    topic: "renegade-<baseTokenAddress>",
  })
)
```

### Events

**Price Update**

```json
{
  "topic": "renegade-<baseTokenAddress>",
  "price": 1612.545
}
```

**Subscription Confirmation**

```json
{
  "subscriptions": ["renegade-<baseTokenAddress>"]
}
```

### Error Handling

Error messages are returned as plain text. The message will describe the issue, such as an invalid topic format or unsupported token.

**Example error message:**

```
Invalid (exchange, base) tuple: renegade does not support the token 0x...
```

### Minimal JavaScript Example

```javascript
const ws = new WebSocket("wss://mainnet.price-reporter.renegade.fi:4000")

ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data)
    if (data.subscriptions) {
      console.log("Subscribed to:", data.subscriptions)
      return
    }
    if (data.topic && data.price) {
      console.log("Price update:", data.topic, data.price)
      return
    }
  } catch {
    // If parsing fails, treat as plain text error
    console.error("WebSocket error:", event.data)
  }
}

ws.onopen = () => {
  ws.send(
    JSON.stringify({
      method: "subscribe",
      topic: "renegade-0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
    })
  )
}
```

---

## Rate Limits

TODO?

---

## Troubleshooting

### Common Issues

1. **Invalid Topic Format**

   - Ensure token addresses are correct and match the required format.
   - Confirm the exchange identifier is `renegade`.
   - Verify the token is supported.

2. **Connection Issues**

   - Check your network connectivity.
   - Verify you are using the correct WebSocket or HTTP URL and port.
   - Implement reconnection logic for WebSocket clients.
