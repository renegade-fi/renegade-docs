---
sidebar_position: 3
title: Core Concepts
hide_title: true
description: Core concepts of the Renegade protocol
slug: /technical-reference/typescript-sdk/core-concepts
---

## Protocol Core Concepts

The following sections describe the protocol concepts which are core to SDK use. For more information on the protocol, see the [Protocol Architecture](../../core-concepts/mpc-zkp) page.

### Relayer
A relayer is responsible for managing user orders. This involves generating proofs for wallet updates, finding counterparties for trades, serving user API requests, etc.

Each relayer manages one or more user wallets, and has **read only** access to the wallet state. That is, a relayer may view the plaintext wallets they manage, but may not modify them. In order to modify a wallet (place an order, deposit assets, etc.); users sign updates to their wallet state which authorize a relayer to make the update on their behalf. Users then enqueue an update task via the relayer's asynchronous task API.

:::note
Relayers manage **task queues** for each wallet, which provide an asynchronous API for wallet updates. For this reason, two methods exist for fetching a wallet's state: [`getWallet`](./wallet-actions#getwallet) (current wallet state) and [`getBackOfQueueWallet`](./wallet-actions#getbackofqueuewallet) (wallet state after current task queue commits).
:::

### Wallet
A wallet is a data structure that contains a user's balances, orders, and keys. To create a Renegade wallet, you must deterministically sign a message using your _Ethereum_ wallet to generate a derivation key. This derivation key is used to derive the required fields of a wallet, such as the keychain, wallet id, and cryptographic blinders which keep your wallet state private. Learn more about keychains [here](../../advanced-concepts/super-relayers).

## SDK Core Concepts

### Actions
This SDK exposes **actions** that are used to interact with a relayer; such as fetching a wallet's state or placing an order. Actions that access private wallet data require authorization headers, which are automatically added for you when using the SDK. You can browse the list of available actions on the [Wallet Actions](./wallet-actions) page.

### Types
This SDK provides types for various data structures used in the API. 

- [`Wallet`](https://github.com/renegade-fi/typescript-sdk/blob/main/packages/core/src/types/wallet.ts#L34): contains a user's balances, orders, and keys.
- [`Order`](https://github.com/renegade-fi/typescript-sdk/blob/main/packages/core/src/types/order.ts#L10): contains an order's parameters.
- [`Balance`](https://github.com/renegade-fi/typescript-sdk/blob/main/packages/core/src/types/wallet.ts#L15): contains the amount of an ERC-20 token a user has in addition to the fee amount owed for that token.
- [`KeyChain`](https://github.com/renegade-fi/typescript-sdk/blob/main/packages/core/src/types/wallet.ts#L22): contains a user's key hierarchy.
- [`OrderMetadata`](https://github.com/renegade-fi/typescript-sdk/blob/main/packages/core/src/types/order.ts#L30): contains useful metadata such as the order's ID, status, creation time, and [`PartialOrderFills`](https://github.com/renegade-fi/typescript-sdk/blob/main/packages/core/src/types/order.ts#L38) since creation.
- [`Task`](https://github.com/renegade-fi/typescript-sdk/blob/main/packages/core/src/types/task.ts#L1): contains a task's ID, status, type, and creation time.
