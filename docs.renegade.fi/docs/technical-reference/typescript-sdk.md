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

## Quick Start

1. Set up your `RenegadeClient`

Firstly, set up your `RenegadeClient` with a desired chain and seed.

```js
import { RenegadeClient } from "@renegade-fi/node";
const client = RenegadeClient.new({
    chainId,
    seed,
});
```

:::tip 
Renegade is currently deployed on 
- Mainnets: 
  - Arbitrum One (42161)
  - Base Mainnet (8453)
- Testnets: 
  - Arbitrum Sepolia (421614)
  - Base Sepolia (84532) 
:::

Generate a seed like so:
```js
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";

const chainId = arbitrumSepolia.id;

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const account = privateKeyToAccount(PRIVATE_KEY);

const message = RenegadeClient.generateSeedMessage(chainId);
const seed = await account.signMessage({ message });
```

:::tip 
We recomend using `viem` to perform on-chain interactions.
:::

2. Create your Renegade wallet
```js
await client.createWallet();
```
3. Interact with the protocol

Now that you have a `RenegadeClient` and wallet set up, you can now interact with the Renegade protocol. See [below](#renegade-client) for more methods.

```js
import { createPublicClient, createWalletClient, http} from 'viem'
import { arbitrumSepolia } from 'viem/chains'
import { privateKeyToAccount } from "viem/accounts";

const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(),
})
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const account = privateKeyToAccount(PRIVATE_KEY);
const walletClient = createWalletClient({
    account,
    chain,
    transport: http(),
});
await client.executeDeposit({
    amount: BigInt(10000000000000000), // 0.01 WETH
    mint: "0xc3414a7ef14aaaa9c4522dfc00a4e66e74e9c25a", // WETH on Arbitrum Sepolia
    publicClient,
    walletClient,
});
```



## Protocol Core Concepts

### Relayer
A relayer node is resposible for the matching and settlement of orders. Each individual relayer manages one or more wallets, meaning they are able to view the plaintext wallet but are unable to modify a wallet. In order to modify a wallet (placing orders, depositing assets, etc.), users sign updates to their wallet state and queue asynchronous "tasks" in the relayer.

:::note
Relayers manage task queues for each wallet, which means you do not necessarily need to wait for a task to complete before creating a new task. This is why two functions exist for fetching a wallet's state: [`getWalletFromRelayer`](#getwalletfromrelayer) (current wallet state) and [`getBackOfQueueWallet`](#getbackofqueuewallet) (wallet state after current task queue is cleared).
:::

### Wallet
A wallet is a data structure that contains a user's balances, orders, and keys. To create a wallet, you must sign a message using your Ethereum wallet to generate a derivation key. This derivation key is used to derive the required fields of a wallet, such as the keychain. Learn more about keychains [here](../advanced-concepts/super-relayers.md).

## SDK Core Concepts

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

**Initialization**
Before using `Token` methods, the token mapping must be initialized either asynchronously or synchronously:

```js
import { Token } from "@renegade-fi/token";
import { arbitrumSepolia } from "viem/chains";

const chainId = arbitrumSepolia.id;

// Asynchronous Initialization
await Token.fetchRemapFromRepo(chainId);
const WETH = Token.fromTicker("WETH");
const WETH_ADDRESS = WETH.address; // 0xc3414a7ef14aaaa9c4522dfc00a4e66e74e9c25a

// Sync Initialization
import remap from "./remap.json";

Token.addRemapFromString(chainId, JSON.stringify(remap));
const WETH = Token.fromTicker("WETH");
const WETH_ADDRESS = WETH.address; // 0xc3414a7ef14aaaa9c4522dfc00a4e66e74e9c25a

```

**Static Methods**

```js
static fromTicker(ticker: string): Token
```

**Returns**

- `Token` - The Token instance matching the given ticker.

**Throws**

- `Error` - If the mapping has not been initialized.
- `Error` - If no token with the given ticker is found in the map.

```js
static fromAddress(address: `0x${string}`): Token
```

**Returns**

- `Token` - The Token instance matching the given address.

**Throws**

- `Error` - If the mapping has not been initialized.
- `Error` - If no token with the given address is found in the map.

## Renegade Client
### new

**Usage**

```js
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";

const chainId = arbitrumSepolia.id;

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const account = privateKeyToAccount(PRIVATE_KEY);

const seed = await account.signMessage({
    message: RenegadeClient.generateSeedMessage(chainId),
});

const client = RenegadeClient.new({
    chainId,
    seed,
});
```

**Parameters**

- chainId
    - `number`
    - ID of the chain to interact with
- seed
    - `0x${string}`
    - Renegade wallet secret. Generated using `RelayerClient.generateSeedMessage()`

**Returns**

A `RenegadeClient` instance that is used to interact with the Renegade protocol.

**Error**

An error may be thrown if:

- an invalid chain ID is passed

### newArbitrumOneClient

Same as `new` but with Arbitrum One's chain ID preset.

**Usage**

```js
import { privateKeyToAccount } from "viem/accounts";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const account = privateKeyToAccount(PRIVATE_KEY);

const seed = await account.signMessage({
    message: RenegadeClient.generateSeedMessage(chainId),
});

const client = RenegadeClient.newArbitrumOneClient({
    chainId,
});
```

### newArbitrumSepoliaClient

Same as `new` but with Arbitrum Sepolia's chain ID preset.

**Usage**

```js
import { privateKeyToAccount } from "viem/accounts";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const account = privateKeyToAccount(PRIVATE_KEY);

const seed = await account.signMessage({
    message: RenegadeClient.generateSeedMessage(chainId),
});

const client = RenegadeClient.newArbitrumOneClient({
    chainId,
});
```

### newBaseMainnetClient

Same as `new` but with Base Mainnet's chain ID preset.

**Usage**

```js
import { privateKeyToAccount } from "viem/accounts";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const account = privateKeyToAccount(PRIVATE_KEY);

const seed = await account.signMessage({
    message: RenegadeClient.generateSeedMessage(chainId),
});

const client = RenegadeClient.newBaseMainnetClient({
    chainId,
});
```

### newBaseSepoliaClient

Same as `new` but with Base Sepolia's chain ID preset.

**Usage**

```js
import { privateKeyToAccount } from "viem/accounts";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const account = privateKeyToAccount(PRIVATE_KEY);

const seed = await account.signMessage({
    message: RenegadeClient.generateSeedMessage(chainId),
});

const client = RenegadeClient.newBaseSepoliaClient({
    chainId,
});
```

### createWallet

Start a `create wallet` task on your connected relayer.

**Usage**

```js
await client.createWallet();
```

**Return Type**

`Promise<void>`

Promise that resolves when the `create wallet` task has finished and the wallet has successfully been fetched from the connected relayer.

**Error**

An error may be thrown if:

- a wallet with the same wallet ID already exists in the state of the connected relayer

### lookupWallet

Start a `lookup wallet` task on your connected relayer.

**Usage**

```js
await client.lookupWallet();
```

**Return Type**

`Promise<void>`

Promise that resolves when the `lookup wallet` task has finished and the wallet has successfully been fetched from the connected relayer.

**Error**

An error may be thrown if:

- a wallet with the same wallet ID already exists in the state of the connected relayer
- a wallet was not able to be found on-chain

### getWallet

Retrieve the latest wallet state from the connected relayer.

**Usage**

```js
const wallet = await client.getWallet();
```

**Return Type**

[`Wallet`](https://github.com/renegade-fi/typescript-sdk/blob/main/packages/core/src/types/wallet.ts#L34)

**Error**

An error may be thrown if:

- the wallet is not currently indexed by your connected relayer, in which case you should `createWallet` or `lookupWallet`

### getBackOfQueueWallet

Retrieve the latest back of queue wallet state from the connected relayer.

:::note
Your connected relayer will manage a queue of tasks for you. By fetching the back of queue wallet, you are fetching your wallet state *after* all tasks in the queue have completed, which may not be the case. If a task fails, all subsequent tasks will transition to the `Failed` state and your queue will be cleared.
:::

**Usage**

```js
const wallet = await client.getBackOfQueueWallet();
```

**Return Type**

[`Wallet`](https://github.com/renegade-fi/typescript-sdk/blob/main/packages/core/src/types/wallet.ts#L34)

**Error**

An error may be thrown if:

- the wallet is not currently indexed by your connected relayer, in which case you should `createWallet` or `lookupWallet`

### executeDeposit
Start a `deposit` task on your connected relayer. Will also prepare the deposit by: 
- sending a transaction to approve the ERC-20
- signing a Permit2 `permit` if needed.
Transfers ERC-20 tokens from your EVM address to your Renegade wallet.

**Usage**

```js
import { createPublicClient, createWalletClient, http} from 'viem'
import { arbitrumSepolia } from 'viem/chains'
import { privateKeyToAccount } from "viem/accounts";

const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(),
})
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const account = privateKeyToAccount(PRIVATE_KEY);
const walletClient = createWalletClient({
    account,
    chain,
    transport: http(),
});

const mint = "0xc3414a7ef14aaaa9c4522dfc00a4e66e74e9c25a"; // WETH
const amount = BigInt(10000000000000000); // 0.01 WETH

await client.executeDeposit({
    amount,
    mint,
    publicClient,
    walletClient,
});
```

**Parameters**

- mint
    - `0x${string}`
    - ERC-20 contract address.
- amount
    - `bigint`
    - Amount to deposit (should be multiplied by the number of decimals the ERC-20 supports)
- publicClient
    - [`PublicClient`](https://viem.sh/docs/clients/public)
    - viem Public Client used to read allowance.
- walletClient
    - [`WalletClient`](https://viem.sh/docs/clients/wallet#wallet-client)
    - viem Wallet Client used to sign messages.

**Return Type**

`Promise<{ taskId: string }>`

Promise that resolves to the ID of the `deposit` task in the connected relayer.

**Error**

An error may be thrown if:

- the provided `amount` is less than the minimum transfer amount set by your connected relayer (currently 1 USDC)
- the provided Wallet Client is not configured properly

**Error**

An error may be thrown if:

- the wallet already contains the maximum number of balances (12)

### executeWithdraw

Start a `withdraw` task on your connected relayer, Will also prepare the withdrawal by paying fees if needed. Transfers ERC-20 tokens from your Renegade wallet to your EVM address.

**Usage**

```js
const mint = "0xc3414a7ef14aaaa9c4522dfc00a4e66e74e9c25a"; // WETH
const amount = BigInt(10000000000000000); // 0.01 WETH
const destinationAddr = "0x..." // your public EVM address 

await client.executeWithdraw({
    amount,
    mint,
    destinationAddr,
});

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

**Return Type**

`Promise<{ taskId: string }>`

Promise that resolves to the ID of the `withdraw` task in the connected relayer.

**Error**

An error may be thrown if:

- the provided `amount` is less than the minimum transfer amount set by your connected relayer (currently 1 USDC)

### payFees

Start the `payFee` task(s) on your connected relayer.

:::warning

You most likely will not invoke this function directly, as it is part of the [`executeWithdrawal`](#executewithdrawal) function.

:::

**Usage**

```js
await client.payFees();
```

**Return Type**

`Promise<{ taskIds: string[] }>`

Promise that resolves to an array of IDs of `payFee` tasks in the connected relayer.

### placeOrder

Start a `place order` task on your connected relayer.

**Usage**

```js
const WETH_ADDRESS = "0xc3414a7ef14aaaa9c4522dfc00a4e66e74e9c25a";
const USDC_ADDRESS = "0xdf8d259c04020562717557f2b5a3cf28e92707d1";
const amount = BigInt(10000000000000000); // 0.01 WETH
const worstCasePrice = (4000 * 1.5 * 10 ** (6 - 18)).toString(); // For a buy order: maximum price of 6000 USDC per ETH
const minFillSize = amount; // Minimum fill size of 0.01 ETH
const side = "buy";

const order = {
    base: WETH_ADDRESS,
    quote: USDC_ADDRESS,
    side,
    amount,
    worstCasePrice,
    minFillSize,
} as const;

await client.placeOrder(order);
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

- the wallet already contains the maximum number of orders (4)

### cancelOrder

Start a `cancel wallet` task on your connected relayer.

**Import**

```js
import { cancelOrder } from "@renegade-fi/node"
```

**Usage**

```js
// Cancel all orders
let wallet = await client.getBackOfQueueWallet();

const orderIds = wallet.orders.map((order) => order.id);

for (const id of orderIds) {
    await client.cancelOrder({ id });
}
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

- the provided `id` mint does not exist in the wallet's list of orders

### getOrderHistory

Retrive your order history from your connected relayer.

**Usage**

```js
const history = await client.getOrderHistory({ limit: 5 })
```

**Parameters**

- limit (optional)
    - `number`
    - the number of orders to fetch

**Return Type**

`Promise<Map<string, OrderMetadata>>`

Promise that resolves to a Map where the keys are order IDs and the values are `OrderMetadata` objects.


### generateSeedMessage

Generate the secret from which to derive your Renegade wallet.

**Usage**

```js
// Generate message to sign
const message = RenegadeClient.generateSeedMessage(chainId);

// Use WalletClient to sign
const seed = await account.signMessage({ message });
```

**Parameters**

- chainId
    - `string`
    - the ID of the chain to deposit/withdraw funds from

**Return Type**

`string`

Message to derive Renegade wallet secrets from.

## Configuration

### createAuthConfig

**Import**

```js
import { createAuthConfig } from "@renegade-fi/node"
```

**Usage**

```js
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
    - The auth server's URL.
- apiKey
    - `string`
    - The API key. Used to authorize requests to the server.
- apiSecret
    - `string`
    - The API secret. Used to sign requests to the server.

**Return Type**

```js
import { type AuthConfig } from '@renegade-fi/node'
```

### createExternalKeyConfig

Creates a configuration object for interacting with the relayer using an externally managed wallet. The required secrets should be obtained from [generateWalletSecrets](#generating-wallet-secrets) first.

**Import**
```typescript
import { createExternalKeyConfig } from "@renegade-fi/node"
```

**Parameters**
- `signMessage`: `(message: string) => Promise<string>`
  - Function that signs messages using ECDSA secp256k1
  - Must return signature as hex string with recovery bit (r[32] || s[32] || v[1])
  - Must use raw message (no Ethereum message prefix)
- `publicKey`: `string`
  - The public key corresponding to your signing function
  - Used to verify signatures during API requests
- `symmetricKey`: `string`
  - Generated symmetric key for API authentication
  - Obtained from `generateWalletSecrets`
- `walletId`: `string`
  - Unique identifier for your wallet
  - Obtained from `generateWalletSecrets`
- `relayerUrl`: `string`
  - HTTP URL of the relayer
- `websocketUrl`: `string`
  - WebSocket URL of the relayer
- `darkPoolAddress`
    - `0x${string}`
    - The darkpool contract's address.
- `viemClient`
    - [`PublicClient`](https://viem.sh/docs/clients/public)
    - Viem client used for wallet specific tasks e.g. signing a message.

**Basic Example**
```typescript
import { createExternalKeyConfig } from "@renegade-fi/node"
import { createPublicClient, http } from 'viem'
import { arbitrumSepolia } from 'viem/chains'
 
const publicClient = createPublicClient({ 
  chain: arbitrumSepolia,
  transport: http()
})
const config = createExternalKeyConfig({
  chainId: arbitrumSepolia.id,
  signMessage,
  publicKey: "0x04800db50009a01fab58a239f204ca14e85682ca0991cb6914f34c4fbd0131eedb54d0ccbe392922e57486b031779bf8b6feab57971c2c406df291c0ab9c529a3d",
  symmetricKey: walletSecrets.symmetric_key,
  walletId: walletSecrets.wallet_id,
  relayerUrl: "https://testnet.cluster0.renegade.fi:3000",
  websocketUrl: "wss://testnet.cluster0.renegade.fi:4000",
  darkPoolAddress: "0x9af58f1ff20ab22e819e40b57ffd784d115a9ef5",
  viemClient: publicClient,
});
```

**Signing Function Example**
```typescript
// Example signing function implementation
const signMessage = async (message: string) => {
  // Validate input
  if (!isHex(message)) {
    throw new Error("Message must be a hex string");
  }

  // Hash the raw message (no Ethereum prefix)
  const hashedMessage = keccak256(message);
  
  try {
    // Generate secp256k1 signature
    const sig = await secp.signAsync(
      hashedMessage.slice(2),
      signingKey.slice(2),
      { lowS: true, extraEntropy: false }
    );

    // Format as r[32] || s[32] || v[1]
    return concatHex([
      numberToHex(sig.r, { size: 32 }),
      numberToHex(sig.s, { size: 32 }),
      numberToHex(sig.recovery ? 1 : 0, { size: 1 }),
    ]);
  } catch (error) {
    throw new Error(`Failed to sign message: ${error.message}`);
  }
};
```

:::warning Important
The `signMessage` function and `publicKey` must form a valid signing pair. The relayer will verify that signatures produced by `signMessage` can be verified using `publicKey`.
:::

**Return Type**
```typescript
import { type ExternalConfig } from '@renegade-fi/node'
```

## Actions

### getOrderHistory

Action for fetching the order history of a wallet from your connected relayer.

**Import**

```js
import { getOrderHistory } from "@renegade-fi/node"
```

**Usage**

```js
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

## Order WebSocket Notifications

The `createOrderWebSocket` function establishes a WebSocket connection to receive real-time updates about order state changes.

### Key Features

- Receives immediate notifications for:
  - Order state transitions (Created, Matching, Filled, etc.)
  - Partial fills and their details
  - Order cancellations
- Provides complete order metadata with each update
- Maintains persistent connection for continuous monitoring

### Basic Usage

```typescript
import { createOrderWebSocket, OrderState, type OrderMetadata } from '@renegade-fi/node'

// Initialize WebSocket connection
const ws = createOrderWebSocket({
  config,
  onUpdate: (order: OrderMetadata) => {
    // Handle order state changes
    switch (order.state) {
      case OrderState.Filled:
        console.log('Order filled:', {
          id: order.id,
          amount: order.data.amount,
          fills: order.fills
        })
        break
      case OrderState.Cancelled:
        console.log('Order cancelled:', order.id)
        break
      default:
        console.log('Order state update:', order.state)
    }
  }
})

// Establish WebSocket connection
ws.connect()

// Clean up on process exit
process.on('SIGINT', () => {
  ws.disconnect()
})
```

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

- neither `baseAmount` nor `quoteAmount` is provided
- the API request authorization is incorrect / missing
- rate limits have been exceeded, see below

### External Match Rate Limits

The rate limits for the external match endpoints are as follows: 
- **Quote**: 100 requests per minute
- **Assemble**: 5 _unsettled_ bundles per minute. That is, if an assembled bundle is submitted on-chain, the rate limiter will reset. 
If an assembled match is not settled on-chain, the rate limiter will remove one token from the per-minute allowance.

## External Match Gas Sponsorship
The Renegade relayer will cover the gas cost of external match transactions, up to a daily limit. When requested, the relayer will re-route the settlement transaction through a gas rebate contract. This contract refunds the cost of the transaction, either in native Ether, or in terms of the buy-side token in the external match.
The rebate can optionally be sent to a configured address.

For in-kind sponsorship, if no refund address is given, the rebate is sent to the receiver of the match. This is equivalent to the receiver getting a better price in the match, and as such the quoted price returned by the SDK is updated to reflect that.

:::note
In-kind gas sponsorship is enabled by default!
:::

However, if you'd like to disable gas sponsorship, simply add `disableGasSponsorship` to the `GetExternalMatchQuoteParameters` type:
```typescript
  const quote = await getExternalMatchQuote(config, {
    disableGasSponsorship: true,
    order: {
      base: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      quote: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
      side: 'sell',
      quoteAmount: BigInt(20_000_000), // $20
    },
  })
```

For examples on how to configure gas sponsorship, see [`examples/native_eth_gas_sponsorship`](https://github.com/renegade-fi/typescript-sdk/tree/main/examples/native-eth-gas-sponsorship), and [`examples/in_kind_gas_sponsorship`](https://github.com/renegade-fi/typescript-sdk/tree/main/examples/in-kind-gas-sponsorship)

### Gas Sponsorship Notes

- The refund amount may not exactly equal the gas costs, as this must be estimated before constructing the transaction so it can be returned in the quote.
- The gas estimate returned by `eth_estimateGas` will _not_ reflect the rebate, as the rebate does not _reduce_ the gas used; it merely refunds the ether paid for the gas. If you wish to understand the true gas cost ahead of time, the transaction can be simulated (e.g. with `alchemy_simulateExecution` or similar).
- The rate limits currently sponsor up to **~500 matches/day** ($100 in gas). 

### Malleable External Matches

The external match API allows for a quote to be assembled into a malleable match. A malleable match is a match that specifies a range of allowable base amounts, rather than an exact amount. This can be used, for example, to fit a Renegade match into a larger route with variable output amounts.

To assemble a malleable match, use the `assembleMalleableQuote` function. This function is identical to `assembleExternalQuote` but returns a `MalleableExternalMatchResponse` instead of an `ExternalMatchResponse`. The [`malleable-external-match` example](https://github.com/renegade-fi/typescript-external-match-client/blob/main/examples/malleable_external_match.ts) shows how to use the helper methods on the `MalleableExternalMatchResponse` to se the base amount and compute information about the bundle at a given base amount.

## External Key Management

Renegade supports external key management as an alternative to the default managed wallet approach. This allows you to maintain complete control over your wallet's cryptographic secrets rather than having them derived and managed by the SDK.

### Key Components

The external key management flow consists of three main components:

1. **Wallet Secrets** - A set of cryptographic materials you generate and store:
   - Wallet ID & symmetric key: Used for API authentication
   - Blinder & share seeds: Used for wallet encryption
   - Match key: Used during order matching

2. **ExternalConfig** - A configuration object that connects your externally managed keys to the SDK
   - Does not store or derive keys internally
   - Requires you to provide signing capabilities and public keys
   
3. **Actions** - Standard SDK actions that work with your external keys
   - Require wallet secrets for initial wallet creation/lookup
   - Support key rotation for ongoing security

### Generating Wallet Secrets

The `generateWalletSecrets` function creates the cryptographic materials needed for an externally managed wallet. 

**Import**
```typescript
import { generateWalletSecrets } from "@renegade-fi/node"
```

**Parameters**
- `signer`: A function that generates a secp256k1 signature for a given message
  - Input: Unhashed message as hex string
  - Output: Signature as hex string with recovery bit
  - Must NOT prefix with Ethereum signed message header

**Example**
```typescript
// Create a signer function that generates a secp256k1 signature for a given message
const signer = async (message: string) => {
  // Hash the raw message (do not add Ethereum message prefix)
  const hashedMessage = keccak256(message);
  
  // Sign the hash with your private key
  const sig = await secp.signAsync(
    hashedMessage.slice(2),
    env.PRIVATE_KEY.slice(2),
    { lowS: true, extraEntropy: false }
  );
  
  // Format signature as r[32] || s[32] || v[1]
  return concatHex([
    numberToHex(sig.r, { size: 32 }),  // r component
    numberToHex(sig.s, { size: 32 }),  // s component
    numberToHex(sig.recovery ? 1 : 0, { size: 1 })  // recovery bit
  ]);
};

const walletSecrets = await generateWalletSecrets(signer);
```

**Return Value**
```typescript
type GeneratedSecrets {
  /** Identifies your wallet to the relayer */
  wallet_id: string

  /** Used to generate blinding values for wallet state encryption */
  blinder_seed: `0x${string}`

  /** Used to generate secret shares for wallet state encryption */
  share_seed: `0x${string}`

  /** Used to authenticate API requests to the relayer */
  symmetric_key: `0x${string}`

  /** Used during order matching process */
  sk_match: `0x${string}`
}
```

:::warning Security Best Practices
- Store wallet secrets in secure, encrypted storage
- Never expose secrets in logs or client-side code
- Back up secrets securely - they cannot be recovered if lost
- Consider using a hardware security module (HSM) for production deployments
:::

:::info
Some Ethereum libraries (e.g. `viem`) automatically prefix messages with "\x19Ethereum Signed Message:\n". This will break signature verification - ensure your signer uses the raw message.
:::

### Wallet Creation / Lookup

Once you have generated wallet secrets, you can use them to create a wallet or lookup an existing wallet. The `createWallet` and `lookupWallet` actions require wallet secrets to be provided since they are externally managed. Each of these actions accepts an object containing the blinder seed, share seed, and match key as the second parameter.

```js
const walletSecrets = await generateWalletSecrets(signer);
const parameters: CreateWalletParameters = {
  blinderSeed: walletSecrets.blinder_seed,
  shareSeed: walletSecrets.share_seed,
  skMatch: walletSecrets.sk_match,
};

// Create the wallet using the secrets
await createWallet(config, parameters);
```

:::note
Make sure you are using an `ExternalConfig` object when calling `createWallet` or `lookupWallet` with wallet secrets. Otherwise, the SDK will attempt to rederive the wallet secrets from wallet seeds and fail.
:::

### Actions

Once you have created an Externally Managed Wallet, you can use it to interact with the relayer. When using an Externally Managed Wallet, you should instantiate an [`ExternalConfig`](#createExternalKeyConfig) object instead of a `Config` object and pass it as the first parameter actions. Otherwise, usage is the same as described in the [actions](#actions-1) section above.


### Key Rotation

Key rotation is an optional but recommended security practice that involves updating your wallet's cryptographic keys. While not required, failing to rotate keys may leak some privacy over time as the same key is reused across multiple operations. When using the default internally managed wallet, the SDK automatically rotates keys after each wallet update. For externally managed wallets, you'll need to handle key rotation manually.

#### Implementation

Keys can be rotated during any wallet update operation by providing a new public key. Your connected relayer will:
1. Verify the new public key is valid
2. Update the wallet's keychain
3. Use the new key for future operations

**Example**
```typescript
// Generate new signing keypair
const newSigningKey = generateNewSigningKey(); // Your key generation logic
const newPublicKey = derivePublicKey(newSigningKey);

// Execute operation with key rotation
const { taskId } = await deposit(config, {
  // Key rotation parameter
  newPublicKey: newPublicKey,
  
  // Normal deposit parameters
  fromAddr: account.address,
  mint: token.address,
  amount: depositAmount,
  permitNonce: nonce,
  permitDeadline: deadline,
  permit: signature,
});

// Update config with new public key
config.setPublicKey(newPublicKey);
```

:::info
Key rotation is supported in all wallet update operations including deposits, withdrawals, and order placement.
:::

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
