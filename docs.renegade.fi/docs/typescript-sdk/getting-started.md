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
### Create Config

Create and export a new Renegade config using `createConfig`.

```jsx
import { createConfig } from "@renegade-fi/node"

export const config = createConfig({
  darkPoolAddress: "0x30bd8eab29181f790d7e495786d4b96d7afdc518",
  priceReporterUrl: "mainnet.price-reporter.renegade.fi",
  relayerUrl: "mainnet.cluster0.renegade.fi",
  viemClient: publicClient,
})
```

:::tip

Follow the instructions [here](https://viem.sh/docs/clients/public) to properly configure `viemClient` for either the Arbitrum One chain or the Arbitrum Sepolia chain, depending on which environment you want to use.

:::

### Use the SDK

Now, you can pass the `config` to use actions.

```jsx
import { backOfQueueWallet } from "@renegade-fi/node"
import { createConfig } from "@renegade-fi/node"

const config = createConfig({
  darkPoolAddress: "0x30bd8eab29181f790d7e495786d4b96d7afdc518",
  priceReporterUrl: "mainnet.price-reporter.renegade.fi",
  relayerUrl: "mainnet.cluster0.renegade.fi",
  viemClient: publicClient,
})

const wallet = await getBackOfQueueWallet(config)
```

### Environment Setup

:::note

You must expose a `TOKEN_MAPPING` environment variable to use the SDK. You can do so by adding a `.env` file in the root of your project. See this [repo](https://stackblitz.com/edit/nodets-bnycf1?file=.env.example&view=editor) for an example.

:::

- Node Version
    - We recommend using Node v22
    - Typescript config
        - Take a look at this [example repo](https://stackblitz.com/edit/nodets-bnycf1?file=tsconfig.json&view=editor) for a reference `tsconfig.json`.
    
    
- Helpful values to know
    - Mainnet (Arbitrum One)
        - Darkpool contract address: `0x30bd8eab29181f790d7e495786d4b96d7afdc518`
        - Permit2 contract address: `0x000000000022D473030F116dDEE9F6B43aC78BA3`
        - Chain ID: `42161`
        - Chain name: `Arbitrum One`
        - Chain RPC URL: [`https://arb1.arbitrum.io/rpc`](https://arb1.arbitrum.io/rpc)
            - You should use your own Alchemy / Infura RPC url here instead
        - Token mapping: download JSON [here](https://github.com/renegade-fi/token-mappings/raw/main/mainnet.json)
        - Renegade Price Reporter: [`mainnet.price-reporter.renegade.fi`](http://mainnet.price-reporter.renegade.fi/)
        - Renegade Relayer: [`mainnet.cluster0.renegade.fi`](http://mainnet.cluster0.renegade.fi/)
    - Testnet (Arbitrum Sepolia)
        - Darkpool contract address: `0x9af58f1ff20ab22e819e40b57ffd784d115a9ef5`
        - Permit2 contract address: `0x9458198bcc289c42e460cb8ca143e5854f734442`
        - Chain ID: `421614`
        - Chain name: `Arbitrum Sepolia`
        - Chain RPC URL: [`https://sepolia-rollup.arbitrum.io/rpc`](https://sepolia-rollup.arbitrum.io/rpc)
            - You should use your own Alchemy / Infura RPC url here instead
        - Token mapping: download JSON [here](https://github.com/renegade-fi/token-mappings/raw/main/testnet.json)
        - Renegade Price Reporter: [`testnet.price-reporter.renegade.fi`](http://testnet.price-reporter.renegade.fi/)
        - Renegade Relayer: [`testnet.cluster0.renegade.fi`](http://testnet.cluster0.renegade.fi/)

## Configuration

### `createConfig`

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

## Actions

### `createWallet`

Action for starting a `create wallet` task on your connected relayer.

**Import**

```jsx
import { createWallet } from "@renegade-fi/node"
```

**Usage**

```jsx
import { createConfig, createWallet, ROOT_KEY_MESSAGE_PREFIX, } from "@renegade-fi/node"
import { privateKeyToAccount } from "viem/accounts"
import { createPublicClient, http } from "viem"
import { arbitrum } from "viem/chains"
 
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

### `lookupWallet`

Action for starting a `lookup wallet` task on your connected relayer.

**Import**

```jsx
import { lookupWallet } from "@renegade-fi/node"
```

**Usage**

```jsx
import { createConfig, lookupWallet } from "@renegade-fi/node"
import { createPublicClient, http } from "viem"
import { arbitrum } from "viem/chains"
 
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

### `getWalletFromRelayer`

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

[`Wallet`](https://github.com/renegade-fi/typescript-sdk/blob/bd7455916d3b69f35511337e2cf6b681247dd654/packages/core/src/types/wallet.ts#L34)

**Error**

An error may be thrown if 

- a `seed` does not exist in the provided `config`
- the wallet is not currently indexed by your connected relayer, in which case you should `createWallet` or `lookupWallet`
- the API request authorization is incorrect / missing

### `getBackOfQueueWallet`

Action for fetching the back of queue wallet state from your connected relayer.

> Your connected relayer will manage a queue of tasks for you. By fetching the back of queue wallet, you are fetching your wallet state *after* all tasks in the queue have completed. If a task fails, all subsequent tasks will transition to the `Failed` state and your queue will be cleared.

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

[`Wallet`](https://github.com/renegade-fi/typescript-sdk/blob/bd7455916d3b69f35511337e2cf6b681247dd654/packages/core/src/types/wallet.ts#L34)

**Error**

An error may be thrown if 

- a `seed` does not exist in the provided `config`
- the wallet is not currently indexed by your connected relayer, in which case you should `createWallet` or `lookupWallet`
- the API request authorization is incorrect / missing

### `deposit`

Action for starting a `deposit` task on your connected relayer.

:::warning

You most likely want to use `executeDeposit` instead, as it will check for and execute ERC-20 allowances and permits as needed.

:::

**Import**

```jsx
import { deposit } from "@renegade-fi/node"
```

**Usage**

```jsx
const { taskId } = await deposit(config, {
  fromAddr: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  mint: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
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

### `executeDeposit`

Action for starting a `deposit` task on your connected relayer, sending a transaction to approve the ERC-20 and signing a Permit2 `permit` if needed.

**Import**

```jsx
import { executeDeposit } from "@renegade-fi/node"
```

**Usage**

```jsx
import { createPublicClient, http } from "viem"
import { arbitrum } from "viem/chains"
import { createConfig } from '@wagmi/core'

 const viemConfig = createConfig({
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
  mint: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
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

### `withdraw`

Action for starting a `withdraw` task on your connected relayer.

:::warning

You most likely want to use `executeWithdraw` instead, as it will check for and pay fees if needed.

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
  mint: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
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

### `executeWithdrawal`

Action for starting a `withdraw` task on your connected relayer, paying fees if needed.

**Import**

```jsx
import { executeWithdrawal } from "@renegade-fi/node"
```

**Usage**

```jsx
await executeWithdrawal(config, {
  destinationAddr: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  mint: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
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

### `payFees`

Action for starting necessary `payFee` task(s) on your connected relayer.

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

### `createOrder`

Action for starting a `place order` task on your connected relayer.

**Import**

```jsx
import { createOrder } from "@renegade-fi/node"
```

**Usage**

```jsx
await createOrder(config, {
  base: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
  quote: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
  side: "buy",
  amount: BigInt(1000000000000000000),
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
    - `“buy” | “sell”`
    - The side this order is for

**Return Type**

`Promise<{ taskId: string }>`

Promise that resolves to the ID of the `place order` task in the connected relayer.

**Error**

- a `seed` does not exist in the provided `config`
- the provided `base` mint does not exist in the token mapping
- the provided `quote` mint does not exist in the token mapping
- the API request authorization is incorrect / missing

### `cancelOrder`

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

- a `seed` does not exist in the provided `config`
- the provided `id` mint does not exist in the wallet’s list of orders
- the API request authorization is incorrect / missing

## Examples

### Creating a wallet, placing and canceling an order

[Stackblitz Demo](https://stackblitz.com/edit/nodets-bnycf1?embed=1&file=src/main.ts&view=editor)

### Deposit (Coming soon)

### Withdraw (Coming soon)
