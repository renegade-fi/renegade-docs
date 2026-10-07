---
sidebar_position: 1
title: Quickstart
hide_title: true
description: How to get started with the Renegade Typescript SDK
slug: /technical-reference/typescript-sdk/quick-start
---

# Quickstart

## Installation

To add the Renegade SDK to your project, install the required packages.

```bash
npm install @renegade-fi/node@latest viem@latest
```

This SDK is responsible for interacting with a relayer (see [Core Concepts](./core-concepts#relayer)). Some actions, such as depositing funds into Renegade, require using your Ethereum wallet to sign messages or approve tokens. To perform these actions, we recommend using [viem](https://viem.sh/docs/getting-started).

## Darkpool Quick Start

1. **Set up your `RenegadeClient`**

First, set up your `RenegadeClient` with by generating a seed from your private key.

```js
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";
import { RenegadeClient } from "@renegade-fi/node";

// Setup the chain
const chainId = arbitrumSepolia.id;

// Setup a seed from which your Renegade wallet is derived
// This is done by deterministically signing a message with your private key
// The seed can be re-generated at any time using this same method
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const account = privateKeyToAccount(PRIVATE_KEY);

const message = RenegadeClient.generateSeedMessage(chainId);
const seed = await account.signMessage({ message });

// Finally, create the client with the seed
// The SDK will handle the process of generating a wallet from the seed
const renegadeClient = RenegadeClient.new({
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


:::tip 
We recomend using `viem` to perform on-chain interactions.
:::

2. **Interact with the protocol**

Now that you have a `RenegadeClient` and wallet set up, you can interact with the Renegade protocol. See [Wallet Actions](./wallet-actions) for more ways to interact with the protocol.

```js
import { createPublicClient, createWalletClient, http} from 'viem'
import { arbitrumSepolia } from 'viem/chains'
import { privateKeyToAccount } from "viem/accounts";

// Create a viem public client for RPC interactions
const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(),
})

// Create a viem wallet client for signing
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const account = privateKeyToAccount(PRIVATE_KEY);
const walletClient = createWalletClient({
    account,
    chain,
    transport: http(),
});

// ... Using the renegadeClient created above ... //
await renegadeClient.executeDeposit({
    amount: BigInt(10000000000000000), // 0.01 WETH
    mint: "0xc3414a7ef14aaaa9c4522dfc00a4e66e74e9c25a", // WETH on Arbitrum Sepolia
    publicClient,
    walletClient,
});
```