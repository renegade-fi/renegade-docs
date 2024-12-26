---
sidebar_position: 1
description: Getting started with the Renegade Typescript SDK.
---

# Typescript SDK

## Installation

To add the Renegade SDK to your project, install the required packages.

```bash
npm install @renegade-fi/node@latest @wagmi/core viem@2.x
```

This SDK is responsible for interacting with a relayer. Some actions, such as `createWallet` or `deposit`, require using your Ethereum wallet to sign messages or approve tokens. To perform these actions, we recommend using [wagmi](https://wagmi.sh/core/getting-started) and [viem](https://viem.sh/docs/getting-started).

### Create Config

Create and export a new Renegade config using `createConfig`.

```jsx
import { createConfig } from "@renegade-fi/node"
import { createPublicClient, http } from 'viem'
import { arbitrum } from 'viem/chains'
 
const viemClient = createPublicClient({ 
  chain: arbitrum,
  transport: http()
})

export const config = createConfig({
  darkPoolAddress: "0x30bd8eab29181f790d7e495786d4b96d7afdc518",
  priceReporterUrl: "mainnet.price-reporter.renegade.fi",
  relayerUrl: "mainnet.cluster0.renegade.fi",
  viemClient,
})
```

:::tip

Follow the instructions [here](https://viem.sh/docs/clients/public) to properly configure `viemClient` for either the Arbitrum One chain or the Arbitrum Sepolia chain, depending on which environment you want to use.

:::

:::note

`darkPoolAddress` is the address of the darkpool proxy contract, **not** the implementation contract itself. You can find the darkpool proxy address for your environment [here](../technical-reference/useful-addresses.md).

:::

### Use the SDK

Now, you can pass the `config` to use actions.

```jsx
import { backOfQueueWallet } from "@renegade-fi/node"

const wallet = await getBackOfQueueWallet(config)

console.log("Wallet balances: ", wallet.balances)
```

### Environment Setup

:::note

You must expose a `TOKEN_MAPPING` environment variable to use the SDK. You can do so by adding a `.env` file in the root of your project. See this [repo](https://stackblitz.com/edit/nodets-bnycf1?file=.env.example&view=editor) for an example. You can find the token mapping for your environment [here](../technical-reference/useful-addresses.md).

:::

We recommend using Node v22 as it [provides a WebSocket client to Node.js](https://nodejs.org/en/blog/announcements/v22-release-announce#websocket) without external dependencies. If you are on a lower version of Node, you should provide your own WebSocket client, such as `ws`.

This SDK makes exclusive use of ES Modules. Check out [this guide](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) for more info on ESM support and Frequently Asked Questions across various tools and setups.

For Typescript configuration, check out this [example repo](https://stackblitz.com/edit/nodets-bnycf1?file=tsconfig.json&view=editor) for a reference `tsconfig.json`.

## Protocol Core Concepts

### Relayer
A relayer node is resposible for the matching and settlement of orders. Each individual relayer manages one or more wallets, meaning they are able to view the plaintext wallet but are unable to modify a wallet. In order to modify a wallet (placing orders, depositing assets, etc.), users sign updates to their wallet state and queue asynchronous “tasks” in the relayer.

:::note
Relayers manage task queues for each wallet, which means you do not necessarily need to wait for a task to complete before creating a new task. This is why two functions exist for fetching a wallet's state: [`getWalletFromRelayer`](#getwalletfromrelayer) (current wallet state) and [`getBackOfQueueWallet`](#getbackofqueuewallet) (wallet state after current task queue is cleared).
:::

### Wallet
A wallet is a data structure that contains a user's balances, orders, and keys. To create a wallet, you must sign a message using your Ethereum wallet to generate a derivation key. This derivation key is used to derive the required fields of a wallet, such as the keychain. Learn more about keychains [here](../advanced-concepts/super-relayers.md).

## SDK Core Concepts

### Config
The `Config` object is responsible for storing Renegade wallet state and internals. Most actions require a `Config` object to be passed as the first argument, as it contains the derivation key used to derive keys used to sign API requests and wallet updates.

### Auth Config
The `AuthConfig` object is specifically used to interact with the relayer using API keys. If you are using a managed Renegade wallet, you will not need to interact with this object. If you are a permissioned user with API keys, you should follow the instructions [here](#createauthconfig) to create an `AuthConfig` object.

### Actions
This SDK exposes actions that are used to interact with a relayer, such as fetching a wallet's state or placing an order. Actions that access private wallet data require API authorization headers, which are automatically added for you when using the SDK. Browse the list of available actions [below](#actions-1).

### Types
This SDK provides types for various data structures used in the API. 

- [`Wallet`](https://github.com/renegade-fi/typescript-sdk/blob/main/packages/core/src/types/wallet.ts#L34): contains a user's balances, orders, and keys.
- [`Order`](https://github.com/renegade-fi/typescript-sdk/blob/main/packages/core/src/types/order.ts#L1): contains an order's parameters.
- [`Balance`](https://github.com/renegade-fi/typescript-sdk/blob/main/packages/core/src/types/wallet.ts#L15): contains the amount of an ERC-20 token a user has in addition to the fee amount owed for that token.
- [`KeyChain`](https://github.com/renegade-fi/typescript-sdk/blob/main/packages/core/src/types/wallet.ts#L22): contains a user's key hierarchy as defined [here](../advanced-concepts/super-relayers.md).
- [`OrderMetadata`](https://github.com/renegade-fi/typescript-sdk/blob/main/packages/core/src/types/order.ts#L20): contains useful metadata such as the order's ID, status, creation time, and [`PartialOrderFills`](https://github.com/renegade-fi/typescript-sdk/blob/main/packages/core/src/types/order.ts#L28) since creation.
- [`Task`](https://github.com/renegade-fi/typescript-sdk/blob/main/packages/core/src/types/task.ts#L1): contains a task's ID, status, type, and creation time.

### Token

The `Token` class is used to store ERC-20 token metadata. It encapsulates information such as the token's address, name, decimals, and ticker symbol. This metadata is sourced from the `TOKEN_MAPPING` defined in your `.env` file.

**Import**

```js
import { Token } from "@renegade-fi/node"
```

**Properties**

- `address`: The address of the ERC-20 token.
- `name`: The name of the token.
- `decimals`: The number of decimals the token uses.
- `ticker`: The ticker symbol of the token.

**Static Methods**
```js
static findByTicker(ticker: string): Token
```
**Returns**
- `Token` - The Token instance matching the given ticker.

**Throws**
- `Error` - If no token with the given ticker is found in the TOKEN_MAPPING.

```js
static findByAddress(address: `0x${string}`): Token
```
**Returns**
- `Token` - The Token instance matching the given address.

**Throws**
- `Error` - If no token with the given address is found in the TOKEN_MAPPING.


**Usage**

```jsx
import { Token } from "@renegade-fi/node"

const usdc = Token.findByTicker("USDC")

console.log("USDC address: ", usdc.address)

const weth = Token.findByAddress("0xdf8d259c04020562717557f2b5a3cf28e92707d1")

console.log("WETH address: ", weth.address)
```

## Configuration

### createConfig

**Import**

```jsx
import { createConfig } from "@renegade-fi/node"
```

**Usage**

```jsx
import { createConfig } from "@renegade-fi/node"
import { createPublicClient, http } from 'viem'
import { arbitrum } from 'viem/chains'
 
const publicClient = createPublicClient({ 
  chain: arbitrum,
  transport: http()
})

export const config = createConfig({
  darkPoolAddress: "0x30bd8eab29181f790d7e495786d4b96d7afdc518",
  priceReporterUrl: "mainnet.price-reporter.renegade.fi",
  relayerUrl: "mainnet.cluster0.renegade.fi",
  viemClient: publicClient,
})
```

**Parameters**

- darkPoolAddress
    - `0x${string}`
    - The darkpool contract’s address.
- priceReporterUrl
    - `string`
    - The price reporter’s URL.
- relayerUrl
    - `string`
    - The relayer’s URL.
- viemClient
    - `PublicClient`
    - Viem client used for wallet specific tasks e.g. signing a message.

**Return Type**

```jsx
import { type Config } from '@renegade-fi/node'
```

### createAuthConfig

**Import**

```jsx
import { createAuthConfig } from "@renegade-fi/node"
```

**Usage**

```jsx
import { createAuthConfig } from "@renegade-fi/node"
 
export const config = createAuthConfig({
  authServerUrl: "https://mainnet.auth-server.renegade.fi:3000",
  apiKey: API_KEY,
  apiSecret: API_SECRET,
});
```

**Parameters**

- authServerUrl
    - `string`
    - The auth server’s URL.
- apiKey
    - `string`
    - The API key. Used to authorize requests to the server.
- apiSecret
    - `string`
    - The API secret. Used to sign requests to the server.

**Return Type**

```jsx
import { type AuthConfig } from '@renegade-fi/node'
```

## Actions

### createWallet

Action for starting a `create wallet` task on your connected relayer.

**Import**

```jsx
import { createWallet } from "@renegade-fi/node"
```

**Usage**

```jsx
import { createWallet, ROOT_KEY_MESSAGE_PREFIX } from "@renegade-fi/node"
import { privateKeyToAccount } from "viem/accounts"
import { arbitrum } from "viem/chains"
 
const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80') 

const seed = await account.signMessage({
  message: `${ROOT_KEY_MESSAGE_PREFIX} ${arbitrum.id}`,
})

config.setState((x) => ({ ...x, seed }))

await createWallet(config).then(() => console.log("Finished creating a wallet"))
```

**Return Type**

`Promise<void>`

Promise that resolves when the `create wallet` task has finished and the wallet has successfully been fetched from the connected relayer.

**Error**

An error may be thrown if:

- a `seed` does not exist in the provided `config`
- a wallet with the same wallet ID already exists in the state of the connected relayer

### lookupWallet

Action for starting a `lookup wallet` task on your connected relayer.

**Import**

```jsx
import { lookupWallet } from "@renegade-fi/node"
```

**Usage**

```jsx
import { lookupWallet } from "@renegade-fi/node"
import { arbitrum } from "viem/chains"
 
config.setState((x) => ({ ...x, seed }))

await lookupWallet(config).then(() => console.log('Finished looking up wallet'))
```

**Return Type**

`Promise<void>`

Promise that resolves when the `lookup wallet` task has finished and the wallet has successfully been fetched from the connected relayer.

**Error**

An error may be thrown if:

- a `seed` does not exist in the provided `config`
- a wallet with the same wallet ID already exists in the state of the connected relayer
- a wallet was not able to be found on-chain

### getWalletFromRelayer

Action for fetching a wallet’s state from your connected relayer.

**Import**

```jsx
import { getWalletFromRelayer } from "@renegade-fi/node"
```

**Usage**

```jsx
const wallet = await getWalletFromRelayer(config)

console.log("Wallet balances: ", wallet.balances)
```

**Return Type**

[`Wallet`](https://github.com/renegade-fi/typescript-sdk/blob/main/packages/core/src/types/wallet.ts#L34)

**Error**

An error may be thrown if:

- a `seed` does not exist in the provided `config`
- the wallet is not currently indexed by your connected relayer, in which case you should `createWallet` or `lookupWallet`
- the API request authorization is incorrect / missing

### getBackOfQueueWallet

Action for fetching the back of queue wallet state from your connected relayer.

:::note
Your connected relayer will manage a queue of tasks for you. By fetching the back of queue wallet, you are fetching your wallet state *after* all tasks in the queue have completed, which may not be the case. If a task fails, all subsequent tasks will transition to the `Failed` state and your queue will be cleared.
:::

**Import**

```jsx
import { getBackOfQueueWallet } from "@renegade-fi/node"
```

**Usage**

```jsx
const wallet = await getBackOfQueueWallet(config)

console.log("Wallet balances: ", wallet.balances)
```

**Return Type**

[`Wallet`](https://github.com/renegade-fi/typescript-sdk/blob/main/packages/core/src/types/wallet.ts#L34)

**Error**

An error may be thrown if:

- a `seed` does not exist in the provided `config`
- the wallet is not currently indexed by your connected relayer, in which case you should `createWallet` or `lookupWallet`
- the API request authorization is incorrect / missing

### deposit

Action for starting a `deposit` task on your connected relayer. Transfers ERC-20 tokens from your Arbitrum address to your Renegade wallet.

:::warning

You most likely want to use [`executeDeposit`](#executedeposit) instead, as it will check for and execute ERC-20 allowances and permits as needed.

:::

**Import**

```jsx
import { deposit } from "@renegade-fi/node"
```

**Usage**

```jsx
const { taskId } = await deposit(config, {
  fromAddr: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  mint: "0xdf8d259c04020562717557f2b5a3cf28e92707d1",
  amount: BigInt(1000000),
  permitNonce: nonce,
  permitDeadline: deadline,
  permit: signature,
})
```

**Parameters**

- fromAddr
    - `0x${string}`
    - Account to transfer ERC-20 from.
- mint
    - `0x${string}`
    - ERC-20 contract address.
- amount
    - `bigint`
    - Amount to deposit (should be multiplied by the number of decimals the ERC-20 supports)
- permitNonce
    - `bigint`
    - A unique number, chosen by our app, to identify this permit. Once a permit is consumed, any other permit using that nonce will be invalid.
- permitDeadline
    - `bigint`
    - The latest possible block timestamp for when this permit is valid.
- permit
    - `0x${string}`
    - The corresponding EIP-712 signature for the permit2 message, signed by `owner`. If the recovered address from signature verification does not match `owner`, the call will fail.

**Return Type**

`Promise<{ taskId: string }>`

Promise that resolves to the ID of the `deposit` task in the connected relayer.

**Error**

An error may be thrown if:

- a `seed` does not exist in the provided `config`
- the provided `mint` does not exist in the token mapping
- the provided `amount` is less than the minimum transfer amount set by your connected relayer (currently 1 USDC)
- the wallet update signature is incorrect / missing
- the Permit2 permit is incorrect / missing
- the API request authorization is incorrect / missing

### executeDeposit

Action for starting a `deposit` task on your connected relayer, sending a transaction to approve the ERC-20 and signing a Permit2 `permit` if needed. Transfers ERC-20 tokens from your Arbitrum address to your Renegade wallet.

**Import**

```jsx
import { executeDeposit } from "@renegade-fi/node"
```

**Usage**

```jsx
import { createPublicClient, http } from "viem"
import { arbitrum } from "viem/chains"
import { createConfig as createWagmiConfig } from '@wagmi/core'

// Wagmi config
const viemConfig = createWagmiConfig({
  chains: [arbitrum],
  transports: {
    [arbitrum.id]: http(),
  },
})

const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80') 

const walletClient = createWalletClient({ 
  account, 
  chain: arbitrum,
  transport: http()
})

await executeDeposit(config, {
  mint: "0xdf8d259c04020562717557f2b5a3cf28e92707d1",
  amount: BigInt(1000000),
  permit2Address: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
  walletClient,
  viemConfig,
  awaitTask: true,
})
```

**Parameters**

- mint
    - `0x${string}`
    - ERC-20 contract address.
- amount
    - `bigint`
    - Amount to deposit (should be multiplied by the number of decimals the ERC-20 supports)
- permit2Address
    - `0x${string}`
    - Permit2 contract address.
- walletClient
    - [`WalletClient`](https://viem.sh/docs/clients/wallet#wallet-client)
    - viem Wallet Client used to sign messages.
- viemConfig
    - [`Config`](https://wagmi.sh/core/api/createConfig#config)
    - wagmi specific config for using wagmi actions
- awaitTask
    - `boolean`
    - Whether or not to await task completion before resolving.

**Return Type**

`Promise<{ taskId: string }>`

Promise that resolves to the ID of the `deposit` task in the connected relayer.

**Error**

An error may be thrown if:

- a `seed` does not exist in the provided `config`
- the provided `mint` does not exist in the token mapping
- the provided `amount` is less than the minimum transfer amount set by your connected relayer (currently 1 USDC)
- the provided wallet client is not configured properly
- the provided wagmi config is not configured properly
- the API request authorization is incorrect / missing

### withdraw

Action for starting a `withdraw` task on your connected relayer. Transfers ERC-20 tokens from your Renegade wallet to your Arbitrum address.

:::warning

You most likely want to use [`executeWithdrawal`](#executewithdrawal) instead, as it will check for and pay fees if needed.

:::

**Import**

```jsx
import { payFees, withdraw } from "@renegade-fi/node"
```

**Usage**

```jsx
import { payFees, withdraw } from "@renegade-fi/node"
await payFees(config)
await withdraw(config, {
  mint: "0xdf8d259c04020562717557f2b5a3cf28e92707d1",
  amount: BigInt(1000000),
  destinationAddr: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
})
```

**Parameters**

- destinationAddr
    - `0x${string}`
    - Account to transfer ERC-20 to.
- mint
    - ERC-20 contract address.
- amount
    - `bigint`
    - Amount to withdraw (must be multiplied by the number of decimals the ERC-20 supports)

**Return Type**

`Promise<{ taskId: string }>`

Promise that resolves to the ID of the `withdraw` task in the connected relayer.

**Error**

An error may be thrown if:

- a `seed` does not exist in the provided `config`
- the provided `mint` does not exist in the token mapping
- the provided `amount` is less than the minimum transfer amount set by your connected relayer (currently 1 USDC)
- there exist one or more balances with non-zero fees, meaning you must pay fees
- the API request authorization is incorrect / missing

### executeWithdrawal

Action for starting a `withdraw` task on your connected relayer, paying fees if needed. Transfers ERC-20 tokens from your Renegade wallet to your Arbitrum address.

**Import**

```jsx
import { executeWithdrawal } from "@renegade-fi/node"
```

**Usage**

```jsx
await executeWithdrawal(config, {
  destinationAddr: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  mint: "0xdf8d259c04020562717557f2b5a3cf28e92707d1",
  amount: BigInt(1000000),
  awaitTask: true,
})
```

**Parameters**

- destinationAddr
    - `0x${string}`
    - Account to transfer ERC-20 to.
- mint
    - `0x${string}`
    - ERC-20 contract address.
- amount
    - `bigint`
    - Amount to withdraw (should be multiplied by the number of decimals the ERC-20 supports)
- awaitTask
    - `boolean`
    - Whether or not to await task completion before resolving.

**Return Type**

`Promise<{ taskId: string }>`

Promise that resolves to the ID of the `withdraw` task in the connected relayer.

**Error**

An error may be thrown if:

- a `seed` does not exist in the provided `config`
- the provided `mint` does not exist in the token mapping
- the provided `amount` is less than the minimum transfer amount set by your connected relayer (currently 1 USDC)
- the API request authorization is incorrect / missing

### payFees

Action for starting necessary `payFee` task(s) on your connected relayer.

:::warning

You most likely will not invoke this function directly, as it is part of the [`executeWithdrawal`](#executewithdrawal) function.

:::

**Import**

```jsx
import { payFees } from "@renegade-fi/node"
```

**Usage**

```jsx
await payFees(config)
```

**Return Type**

`Promise<{ taskIds: string[] }>`

Promise that resolves to an array of IDs of `payFee` tasks in the connected relayer.

**Error**

An error may be thrown if:

- a `seed` does not exist in the provided `config`
- the API request authorization is incorrect / missing

### createOrder

Action for starting a `place order` task on your connected relayer.

**Import**

```jsx
import { createOrder } from "@renegade-fi/node"
```

**Usage**

```jsx
await createOrder(config, {
  base: "0xc3414a7ef14aaaa9c4522dfc00a4e66e74e9c25a",
  quote: "0xdf8d259c04020562717557f2b5a3cf28e92707d1",
  side: "buy",
  amount: BigInt(1000000000000000000),
  worstCasePrice: ((4000 * 1.5) * 10 ** (6 - 18)).toString(), // For a buy order: maximum price of 6000 USDC per ETH
  minFillSize: BigInt(100000000000000000) // Minimum fill size of 0.1 ETH
})
```

**Parameters**

- base
    - `0x${string}`
    - ERC-20 contract address of the base asset.
- quote
    - `0x${string}`
    - ERC-20 contract address of the quote asset (must be USDC).
- side
    - `"buy" | "sell"`
    - The side this order is for
- amount
    - `bigint`
    - Amount to place the order for (should be multiplied by the number of decimals the ERC-20 supports)
- worstCasePrice (optional)
    - `string`
    - A number formatted as a string representing the worst case price that the order may be executed at. For buy side orders this is a maximum price, for sell side orders this is a minimum price.
    - If no worst case price is provided, the action will fall back to setting default values (`u64::MAX` for buy side orders and `0` for sell side orders)
    - Value should be decimal corrected according to the token pair (e.g. `price * 10**(quoteDecimals - baseDecimals)`)
- minFillSize (optional)
    - `bigint`
    - The minimum fill size for the order. It should be equal to or less than the amount.
    - If not provided, it defaults to `BigInt(0)`, allowing any fill size.

**Return Type**

`Promise<{ taskId: string }>`

Promise that resolves to the ID of the `place order` task in the connected relayer.

**Error**

An error may be thrown if:

- a `seed` does not exist in the provided `config`
- the provided `base` mint does not exist in the token mapping
- the provided `quote` mint does not exist in the token mapping
- the API request authorization is incorrect / missing

### cancelOrder

Action for starting a `cancel wallet` task on your connected relayer.

**Import**

```jsx
import { cancelOrder } from "@renegade-fi/node"
```

**Usage**

```jsx
await cancelOrder(config, {
  id: "f801854d-b225-4855-926b-a24069446dfc",
})
```

**Parameters**

- id
    - `string`
    - the ID of the order to cancel

**Return Type**

`Promise<{ taskId: string }>`

Promise that resolves to the ID of the `cancel order` task in the connected relayer.

**Error**

An error may be thrown if:

- a `seed` does not exist in the provided `config`
- the provided `id` mint does not exist in the wallet's list of orders
- the API request authorization is incorrect / missing

### getOrderHistory

Action for fetching the order history of a wallet from your connected relayer.

**Import**

```jsx
import { getOrderHistory } from "@renegade-fi/node"
```

**Usage**

```jsx
await getOrderHistory(config, {
    limit: 5
})
```

**Parameters**

- limit (optional)
    - `number`
    - the number of orders to fetch

**Return Type**

`Promise<Map<string, OrderMetadata>>`

Promise that resolves to a Map where the keys are order IDs and the values are `OrderMetadata` objects.

**Error**

An error may be thrown if:

- a `seed` does not exist in the provided `config`
- the API request authorization is incorrect / missing

## External (Atomic) Matching

Renegade supports matching orders between two types of parties:
- Internal parties who have state committed to the darkpool
- External parties who have no state in the darkpool

When an external party wants to match with orders in the darkpool, they can request an `ExternalMatchBundle` from the relayer. This bundle contains everything needed to execute the match on-chain, including:
- Match details (amounts and tokens involved)
- A ready-to-submit transaction that settles the match via direct ERC-20 transfers

:::note
External matches can be partially filled - you may receive a match for less than your requested amount, but it will never be less than your specified `minFillSize`.
:::

### Generating an External Match

**Prerequisites**

Before executing an external match:
1. Ensure you have sufficient token balance to fulfill your side of the trade
2. Grant the darkpool contract approval to spend the tokens you're selling
3. Have enough ETH for transaction gas fees

**Flow**

1. Request an `ExternalMatchQuote` with your desired trade parameters using the `getExternalMatchQuote` action
2. Review the returned quote and decide whether to proceed with the trade
3. Assemble the quote into an `ExternalMatchBundle` using the `assembleExternalQuote` action
4. Submit the provided transaction to settle the match on-chain
5. The protocol will:
   - Update the internal party's state
   - Execute the token transfers between parties

**Import**

```typescript
import { getExternalMatchQuote, assembleExternalQuote } from "@renegade-fi/node"
```

**Usage**

```typescript
const config = createAuthConfig({
  authServerUrl: "https://mainnet.auth-server.renegade.fi:3000",
  apiKey: API_KEY,
  apiSecret: API_SECRET,
});

const quote = await getExternalMatchQuote(config, {
  order: {
    base: "0xc3414a7ef14aaaa9c4522dfc00a4e66e74e9c25a", // WETH
    quote: "0xdf8d259c04020562717557f2b5a3cf28e92707d1", // USDC
    side: "buy",
    baseAmount: BigInt(1000000000000000000), // 1 ETH (amount must be adjusted for token decimals - 18 in this case)
    minFillSize: BigInt(100000000000000000) // 0.1 ETH (amount must be adjusted for token decimals - 18 in this case)
  },
});

// ... Quote Validation ... //

const bundle = await assembleExternalQuote(config, {
  quote
});
```

:::tip
This action requires an `AuthConfig` object instead of a `Config` object. [See here for more details](#auth-config)
:::

**getExternalMatchQuote Parameters**

- order
  - `object`
  - Contains the following properties:
    - base
      - `0x${string}`
      - ERC-20 contract address of the base asset.
    - quote
      - `0x${string}`
      - ERC-20 contract address of the quote asset (must be USDC).
    - side
      - `"buy" | "sell"`
      - The side this order is for
    - baseAmount (required if quoteAmount not provided)
      - `bigint`
      - Raw amount of base asset to trade (must be adjusted for token decimals, e.g. multiply by 10^18 for ETH)
    - quoteAmount (required if baseAmount not provided)
      - `bigint`
      - Raw amount of quote asset to trade (must be adjusted for token decimals, e.g. multiply by 10^6 for USDC)
    - minFillSize (optional)
      - `bigint`
      - Minimum fill size for the order. Must be denominated in the same units as the non-zero amount field:
        - When using `baseAmount`: specified in base token units
        - When using `quoteAmount`: specified in quote token units
      - If specified larger than the total order size, will be set to the total order size.
      - If specified as 0, will be set to the total order size.

:::note
You must provide exactly one of either `baseAmount` or `quoteAmount` in your order. Providing both will result in an error.
:::

**getExternalMatchQuote Return Type**

`Promise<SignedExternalMatchQuote>`

A `SignedExternalMatchQuote` that contains:
- `quote`: The `ExternalMatchQuote` object containing:
  - `match_result`: Details about the match, including the filled amount in raw units (not decimal adjusted)
  - `fees`: The fees that will be taken by the relayer and protocol (not decimal adjusted)
  - `send`: The asset and raw amount (not decimal adjusted) you will send in the trade
  - `receive`: The asset and raw amount (not decimal adjusted) you will receive from the trade, after fees are deducted
  - `price`: The price at which the quote will be executed
  - `timestamp`: The timestamp at which the quote was created
- `signature`: A signature of the quote by the relayer, to ensure the quote is authentic when assembled

[See type &#8599;](https://github.com/renegade-fi/typescript-sdk/blob/52f628853833943857a57701af5555ffa1731fcd/packages/core/src/types/externalMatch.ts#L31)

**Error**

An error may be thrown if:

- the provided `base` mint does not exist in the token mapping
- the provided `quote` mint does not exist in the token mapping
- neither `baseAmount` nor `quoteAmount` is provided
- the API request authorization is incorrect / missing

**assembleExternalQuote Parameters** 

- quote
  - `SignedExternalMatchQuote`
  - The `SignedExternalMatchQuote` returned from `getExternalMatchQuote`
- updatedOrder (optional)
  - `ExternalOrder`
  - The updated order to assemble the quote for. If not provided, the quote will use the order specified in the `getExternalMatchQuote` call. This field allows you to tweak the order before assembling the quote. Note that only the `baseAmount`, `quoteAmount`, and `minFillSize` fields may be updated; any other updates will be rejected.
- doGasEstimation (optional)
  - `boolean`
  - Whether to include gas estimation in the returned `ExternalMatchBundle`

**assembleExternalQuote Return Type** <a name="assembleexternalquote-return-type"></a>

`Promise<ExternalMatchBundle>`

An `ExternalMatchBundle` that contains:
- `match_result`: Details about the match, including the filled amount in raw units (not decimal adjusted)
- `settlement_tx`: A transaction that can be submitted on-chain to settle the given external order. Will include a gas estimation if `doGasEstimation` is `true`.
- `receive`: The asset and raw amount (not decimal adjusted) you will receive from the trade
- `send`: The asset and raw amount (not decimal adjusted) you will send in the trade
- `fees`: The fees that will be taken by the relayer and protocol (not decimal adjusted)

[See type &#8599;](https://github.com/renegade-fi/typescript-sdk/blob/52f628853833943857a57701af5555ffa1731fcd/packages/core/src/types/externalMatch.ts#L14)

**getExternalMatchBundle Parameters**

- order
  - `object`
  - Contains the following properties:
    - base
      - `0x${string}`
      - ERC-20 contract address of the base asset.
    - quote
      - `0x${string}`
      - ERC-20 contract address of the quote asset (must be USDC).
    - side
      - `"buy" | "sell"`
      - The side this order is for
    - baseAmount (required if quoteAmount not provided)
      - `bigint`
      - Raw amount of base asset to trade (must be adjusted for token decimals, e.g. multiply by 10^18 for ETH)
    - quoteAmount (required if baseAmount not provided)
      - `bigint`
      - Raw amount of quote asset to trade (must be adjusted for token decimals, e.g. multiply by 10^6 for USDC)
    - minFillSize (optional)
      - `bigint`
      - Minimum fill size for the order. Must be denominated in the same units as the non-zero amount field:
        - When using `baseAmount`: specified in base token units
        - When using `quoteAmount`: specified in quote token units
      - If specified larger than the total order size, will be set to the total order size.
      - If specified as 0, will be set to the total order size.

**getExternalMatchBundle Return Type**

`Promise<ExternalMatchBundle>`

See the [assembleExternalQuote](#assembleexternalquote-return-type) section for more details.

[See type &#8599;](https://github.com/renegade-fi/typescript-sdk/blob/52f628853833943857a57701af5555ffa1731fcd/packages/core/src/types/externalMatch.ts#L14)

:::note
You are responsible for submitting the transaction request contained within the returned `ExternalMatchBundle` to an RPC node. See the [complete example below](#settle-an-external-order) for how to execute the entire external matching flow.
:::

**Error**

An error may be thrown if:

- the provided `base` mint does not exist in the token mapping
- the provided `quote` mint does not exist in the token mapping
- neither `baseAmount` nor `quoteAmount` is provided
- the API request authorization is incorrect / missing

## Examples

### Create a wallet

- [Stackblitz Demo](https://stackblitz.com/edit/nodets-yppjgz?embed=1&file=src%2Fmain.ts&view=editor)

### Place an order

- [Stackblitz Demo](https://stackblitz.com/edit/nodets-sr1qf2?embed=1&file=src%2Fmain.ts&view=editor)

### Cancel an order

- [Stackblitz Demo](https://stackblitz.com/edit/nodets-fusaar?embed=1&file=src%2Fmain.ts&view=editor)

### Deposit

- [Stackblitz Demo](https://stackblitz.com/edit/nodets-7cdu1z?embed=1&file=src%2Fmain.ts&view=editor)

### Withdraw (Coming soon)

### Settle an external order

- [Stackblitz Demo](https://stackblitz.com/edit/nodets-xkwpj2?file=src%2Fmain.ts)
