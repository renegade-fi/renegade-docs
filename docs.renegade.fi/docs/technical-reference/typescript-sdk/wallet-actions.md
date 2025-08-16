---
sidebar_position: 4
title: Wallet Actions
hide_title: true
description: How to use your Renegade wallet with the SDK
slug: /technical-reference/typescript-sdk/wallet-actions
---

# Wallet Actions

The SDK provides a set of functions to interact with your Renegade wallet.


## Renegade Client

### new

**Usage**

```js
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";

const chainId = arbitrumSepolia.id;

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const account = privateKeyToAccount(PRIVATE_KEY);

const message = RenegadeClient.generateSeedMessage(chainId);
const seed = await account.signMessage({ message });

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
const client = RenegadeClient.newArbitrumOneClient({
    seed,
});
```

### newArbitrumSepoliaClient

Same as `new` but with Arbitrum Sepolia's chain ID preset.

**Usage**

```js
const client = RenegadeClient.newArbitrumOneClient({
    seed
});
```

### newBaseMainnetClient

Same as `new` but with Base Mainnet's chain ID preset.

**Usage**

```js
const client = RenegadeClient.newBaseMainnetClient({
    seed
});
```

### newBaseSepoliaClient

Same as `new` but with Base Sepolia's chain ID preset.

**Usage**

```js
const client = RenegadeClient.newBaseSepoliaClient({
    seed
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

**Example**

Check out the usage of `createWallet` in the [Create Wallet](https://stackblitz.com/github/renegade-fi/typescript-sdk/tree/main/examples/relayer/create-wallet) example.

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

**Example**

Check out the usage of `lookupWallet` in the [Lookup Wallet](https://stackblitz.com/github/renegade-fi/typescript-sdk/tree/main/examples/relayer/lookup-wallet) example.

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

**Example**

Check out the usage of `getWallet` in the [Get Wallet](https://stackblitz.com/github/renegade-fi/typescript-sdk/tree/main/examples/relayer/get-wallet) example.

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

**Example**

Check out the usage of `getBackOfQueueWallet` in the [Get Back of Queue Wallet](https://stackblitz.com/github/renegade-fi/typescript-sdk/tree/main/examples/relayer/get-back-of-queue-wallet) example.

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

**Example**

Check out the usage of `executeDeposit` in the [Deposit](https://stackblitz.com/github/renegade-fi/typescript-sdk/tree/main/examples/relayer/deposit) example.

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

**Example**

Check out the usage of `executeWithdraw` in the [Withdraw](https://stackblitz.com/github/renegade-fi/typescript-sdk/tree/main/examples/relayer/withdraw) example.

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

**Example**

Check out the usage of `payFees` in the [Pay Fees](https://stackblitz.com/github/renegade-fi/typescript-sdk/tree/main/examples/relayer/pay-fees) example.

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

**Example**

Check out the usage of `placeOrder` in the [Place Order](https://stackblitz.com/github/renegade-fi/typescript-sdk/tree/main/examples/relayer/place-order) example.

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

**Example**

Check out the usage of `cancelOrder` in the [Cancel Order](https://stackblitz.com/github/renegade-fi/typescript-sdk/tree/main/examples/relayer/cancel-order) example.

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

**Example**

Check out the usage of `getOrderHistory` in the [Get Order History](https://stackblitz.com/github/renegade-fi/typescript-sdk/tree/main/examples/relayer/get-order-history) example.


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

**Example**

Check out the usage of `generateSeedMessage` in the [Get Wallet](https://stackblitz.com/github/renegade-fi/typescript-sdk/tree/main/examples/relayer/get-wallet) example.


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

```js
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