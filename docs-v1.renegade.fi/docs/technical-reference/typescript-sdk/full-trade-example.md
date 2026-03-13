---
sidebar_position: 3
title: Full Trade Example
hide_title: true
description: A full example of how to use the Renegade SDK to place a trade
slug: /technical-reference/typescript-sdk/full-trade-example
---

# Full Trade Example
The following example demonstrates how to:
1. Deposit USDC into Renegade
2. Place an order to buy WETH
3. Cancel the order
4. Withdraw WETH from Renegade

## 1. Deposit USDC into Renegade

```typescript
import { RenegadeClient, type OrderMetadata } from "@renegade-fi/node";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";

// Constants
const PRIVATE_KEY: `0x${string}` = `0x${process.env.PKEY?.replace(/^0x/, "") ?? ""}` as `0x${string}`;
const USDC_MINT = "0xdf8d259c04020562717557f2b5a3cf28e92707d1";
const WETH_MINT = "0xc3414a7ef14aaaa9c4522dfc00a4e66e74e9c25a";

// Create a viem client
const account = privateKeyToAccount(PRIVATE_KEY);
const publicClient = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(),
})
const walletClient = createWalletClient({
    account,
    chain: arbitrumSepolia,
    transport: http(),
})

// Entrypoint
async function main() {
    // Create a Renegade client
    console.log("Creating Renegade client...");
    const chainId = arbitrumSepolia.id;
    const message = RenegadeClient.generateSeedMessage(chainId);
    const seed = await account.signMessage({ message });
    const renegadeClient = RenegadeClient.new({
        chainId,
        seed,
    });

    // Create a websocket to listen for order updates
    console.log("Subscribing to order updates...");
    const ws = await renegadeClient.createOrderWebSocket(
        async (metadata: OrderMetadata) => {
            await handleOrderUpdate(metadata, renegadeClient);
        }
    );
    await ws.connect();

    // Deposit USDC into Renegade
    console.log("Depositing USDC...");
    await renegadeClient.executeDeposit({
        mint: USDC_MINT,
        amount: BigInt(100000000),
        publicClient,
        walletClient,
    });

    // Place an order in the darkpool
    console.log("Placing order...");
    const amount = BigInt(1_000_000_000_000_000_000); // 1 WETH
    const id = crypto.randomUUID();
    await renegadeClient.placeOrder({
        id,
        quote: USDC_MINT,
        base: WETH_MINT,
        amount,
        side: "buy",
    });

    // Wait for a match
    await new Promise((resolve) => setTimeout(resolve, 30_000));
}

/**
 * Handle an order metadata update
 */
async function handleOrderUpdate(metadata: OrderMetadata, renegadeClient: RenegadeClient) {
    // Wait for only a single fill
    if (metadata.fills.length > 0) {
        console.log("Order partially filled, cancelling and withdrawing...");

        // Withdraw all balances
        await withdrawAllBalances(renegadeClient);
        // Cancel all orders
        await cancelAllOrders(renegadeClient);
    }
}

/**
 * Cancel all orders in a wallet
 */
async function cancelAllOrders(client: RenegadeClient) {
    const wallet = await client.getBackOfQueueWallet();
    wallet.orders.forEach(async (order) => {
        await client.cancelOrder({ id: order.id });
    })
}

/**
 * Withdraw all balances from a wallet
 */
async function withdrawAllBalances(client: RenegadeClient) {
    await client.payFees();

    const wallet = await client.getBackOfQueueWallet();
    wallet.balances.forEach(async (balance) => {
        await client.withdraw({
            mint: balance.mint,
            amount: balance.amount,
            destinationAddr: account.address,
        })
    })
}

main().catch(console.error);
```