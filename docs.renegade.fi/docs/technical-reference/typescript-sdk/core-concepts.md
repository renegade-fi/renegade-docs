---
sidebar_position: 2
title: Core Concepts
hide_title: true
description: Core concepts of the Renegade protocol
slug: /technical-reference/typescript-sdk/core-concepts
---

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
