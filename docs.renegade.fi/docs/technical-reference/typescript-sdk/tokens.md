---
sidebar_position: 6
title: Tokens
hide_title: true
description: How to use the Renegade Token object
slug: /technical-reference/typescript-sdk/tokens
---

# Tokens

The Renegade SDKs use a `Token` struct which represents an ERC20 token in the Renegade protocol. The following methods describe how to setup token mappings and use them in your application.

For a list of tokens that Renegade supports, along with useful metadata, you should install the `Token` package:

```bash
npm install @renegade-fi/token
```

**Import**

```js
import { Token } from "@renegade-fi/token"
```

**Properties**

- `address`: The address of the ERC-20 token.
- `name`: The name of the token.
- `decimals`: The number of decimals the token uses.
- `ticker`: The ticker symbol of the token.

:::note
The `Token` class is not required for interacting with the Renegade API, as all methods accept token address strings directly. This class is provided purely for convenience to easily access token metadata such as decimals, ticker symbols, and names. You can use token addresses directly in all API calls without needing to instantiate Token objects.
:::

### fetchRemapFromRepo

Initialize the token mapping asynchronously by fetching from the repository.

**Usage**

```js
import { Token } from "@renegade-fi/token";
import { arbitrumSepolia } from "viem/chains";

const chainId = arbitrumSepolia.id;

await Token.fetchRemapFromRepo(chainId);
```

**Parameters**

- chainId
    - `number`
    - ID of the chain to fetch token mapping for

**Return Type**

`Promise<void>`

Promise that resolves when the token mapping has been successfully fetched and initialized.

**Error**

An error may be thrown if:

- the chain ID is not supported
- the network request fails
- the fetched mapping data is invalid

**Example**

```js
import { Token } from "@renegade-fi/token";
import { arbitrumSepolia } from "viem/chains";

const chainId = arbitrumSepolia.id;

// Initialize token mapping
await Token.fetchRemapFromRepo(chainId);

// Now you can use token methods
const WETH = Token.fromTicker("WETH");
const WETH_ADDRESS = WETH.address; // 0xc3414a7ef14aaaa9c4522dfc00a4e66e74e9c25a
```

Check out the usage of `fetchRemapFromRepo` in the [Token Async Initialization](https://stackblitz.com/github/renegade-fi/typescript-sdk/tree/main/examples/token/async-initialization) example.

### addRemapFromString

Initialize the token mapping synchronously using a provided JSON string.

**Usage**

```js
import { Token } from "@renegade-fi/token";
import { arbitrumSepolia } from "viem/chains";
import remap from "./remap.json";

const chainId = arbitrumSepolia.id;

Token.addRemapFromString(chainId, JSON.stringify(remap));
```

**Parameters**

- chainId
    - `number`
    - ID of the chain to set token mapping for
- remap
    - `string`
    - JSON string containing the token mapping data

**Return Type**

`void`

**Error**

An error may be thrown if:

- the chain ID is invalid
- the remap string is not valid JSON
- the mapping data structure is invalid

**Example**

```js
import { Token } from "@renegade-fi/token";
import { arbitrumSepolia } from "viem/chains";
import remap from "./remap.json";

const chainId = arbitrumSepolia.id;

// Initialize token mapping synchronously
Token.addRemapFromString(chainId, JSON.stringify(remap));

// Now you can use token methods
const WETH = Token.fromTicker("WETH");
const WETH_ADDRESS = WETH.address; // 0xc3414a7ef14aaaa9c4522dfc00a4e66e74e9c25a
```

Check out the usage of `addRemapFromString` in the [Token Sync Initialization](https://stackblitz.com/github/renegade-fi/typescript-sdk/tree/main/examples/token/sync-initialization) example.

### fromTicker

Retrieve a Token instance by its ticker symbol.

**Usage**

```js
const WETH = Token.fromTicker("WETH");
```

**Parameters**

- ticker
    - `string`
    - The ticker symbol of the token to retrieve

**Return Type**

`Token`

The Token instance matching the given ticker.

**Error**

An error may be thrown if:

- the mapping has not been initialized
- no token with the given ticker is found in the map

**Example**

```js
import { Token } from "@renegade-fi/token";
import { arbitrumSepolia } from "viem/chains";

const chainId = arbitrumSepolia.id;

// Initialize mapping first
await Token.fetchRemapFromRepo(chainId);

// Get token by ticker
const WETH = Token.fromTicker("WETH");
console.log(WETH.address); // 0xc3414a7ef14aaaa9c4522dfc00a4e66e74e9c25a
console.log(WETH.decimals); // 18
```

### fromAddress

Retrieve a Token instance by its contract address.

**Usage**

```js
const token = Token.fromAddress("0xc3414a7ef14aaaa9c4522dfc00a4e66e74e9c25a");
```

**Parameters**

- address
    - `0x${string}`
    - The contract address of the token to retrieve

**Return Type**

`Token`

The Token instance matching the given address.

**Error**

An error may be thrown if:

- the mapping has not been initialized
- no token with the given address is found in the map

**Example**

```js
import { Token } from "@renegade-fi/token";
import { arbitrumSepolia } from "viem/chains";

const chainId = arbitrumSepolia.id;

// Initialize mapping first
await Token.fetchRemapFromRepo(chainId);

// Get token by address
const token = Token.fromAddress("0xc3414a7ef14aaaa9c4522dfc00a4e66e74e9c25a");
console.log(token.ticker); // "WETH"
console.log(token.name); // "Wrapped Ether"
```

### fromTickerOnChain

Retrieve a Token instance by its ticker symbol on a specific chain.

**Usage**

```js
import { arbitrumSepolia } from "viem/chains";

const WETH = Token.fromTickerOnChain("WETH", arbitrumSepolia.id);
```

**Parameters**

- ticker
    - `string`
    - The ticker symbol of the token to retrieve
- chain
    - `ChainId`
    - The chain ID to get the token from

**Return Type**

`Token`

The Token instance matching the given ticker on the specified chain. Returns a default token if no match is found.

**Error**

An error may be thrown if:

- the chain ID is invalid
- the token mapping for the specified chain has not been initialized

**Example**

```js
import { Token } from "@renegade-fi/token";
import { arbitrumSepolia, baseSepolia } from "viem/chains";

// Initialize mappings for multiple chains
await Token.fetchRemapFromRepo(arbitrumSepolia.id);
await Token.fetchRemapFromRepo(baseSepolia.id);

// Get WETH from different chains
const wethArbitrum = Token.fromTickerOnChain("WETH", arbitrumSepolia.id);
const wethBase = Token.fromTickerOnChain("WETH", baseSepolia.id);

console.log(wethArbitrum.address); // Arbitrum WETH address
console.log(wethBase.address); // Base WETH address
```

### fromAddressOnChain

Retrieve a Token instance by its contract address on a specific chain.

**Usage**

```js
import { arbitrumSepolia } from "viem/chains";

const token = Token.fromAddressOnChain("0xc3414a7ef14aaaa9c4522dfc00a4e66e74e9c25a", arbitrumSepolia.id);
```

**Parameters**

- address
    - `Address`
    - The contract address of the token to retrieve
- chain
    - `ChainId`
    - The chain ID to get the token from

**Return Type**

`Token`

The Token instance matching the given address on the specified chain. Returns a default token if no match is found.

**Error**

An error may be thrown if:

- the chain ID is invalid
- the token mapping for the specified chain has not been initialized

**Example**

```js
import { Token } from "@renegade-fi/token";
import { arbitrumSepolia, baseSepolia } from "viem/chains";

// Initialize mappings for multiple chains
await Token.fetchRemapFromRepo(arbitrumSepolia.id);
await Token.fetchRemapFromRepo(baseSepolia.id);

// Get token by address on specific chain
const tokenArbitrum = Token.fromAddressOnChain("0xc3414a7ef14aaaa9c4522dfc00a4e66e74e9c25a", arbitrumSepolia.id);
const tokenBase = Token.fromAddressOnChain("0x31a5552AF53C35097Fdb20FFf294c56dc66FA04c", baseSepolia.id);

console.log(tokenArbitrum.ticker); // "WETH"
console.log(tokenBase.ticker); // "WETH"
```