---
sidebar_position: 5
title: External Key Management
hide_title: true
description: How to manage your Renegade wallet with external keys
slug: /technical-reference/typescript-sdk/external-key-management
---

# External Key Management

Renegade supports external key management as an alternative to the default managed wallet approach. This allows you to maintain complete control over your wallet's cryptographic secrets rather than having them derived and managed by the SDK.

:::note
Importantly, this enables using a Renegade wallet with a non-deterministic signer; e.g. an MPC wallet provider. The wallet secrets may be generated ahead of time and custodied independently of the key management system.
:::

### Generating Wallet Secrets

`RenegadeClient.generateKeychain` creates the cryptographic materials needed for an externally managed wallet. 

**Import**
```js
import { RenegadeClient } from "@renegade-fi/node";
```

**Parameters**
- `sign`: A function that generates a secp256k1 signature for a given message
  - Input: Unhashed message as hex string
  - Output: Signature as hex string with recovery bit
  - Must NOT prefix with Ethereum signed message header

**Usage**
```js
import * as secp from "@noble/secp256k1";
import { RenegadeClient } from "@renegade-fi/node";
import { concatHex, keccak256, numberToHex } from "viem/utils";
// Create a signer function that generates a secp256k1 signature for a given message
const signMessage = async (message: string) => {
    // Hash the raw message (do not add Ethereum message prefix)
    const hashedMessage = keccak256(message as `0x${string}`);

    // Sign the hash with your private key
    const sig = await secp.signAsync(hashedMessage.slice(2), privateKey.slice(2), {
        lowS: true,
        extraEntropy: false,
    });

    // Format signature as r[32] || s[32] || v[1]
    return concatHex([
        numberToHex(sig.r, { size: 32 }), // r component
        numberToHex(sig.s, { size: 32 }), // s component
        numberToHex(sig.recovery ? 1 : 0, { size: 1 }), // recovery bit
    ]);
};

const walletSecrets = await RenegadeClient.generateKeychain({
    sign: signMessage,
});
```

:::warning Important
The `signMessage` function and `publicKey` must form a valid signing pair. The relayer will verify that signatures produced by `signMessage` can be verified using `publicKey`.
:::

:::info
The example above uses `@noble/secp256k1@2` as `@noble/secp256k1@3` has some breaking changes to the `signAsync` API
:::

**Return Type**
```js
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

### RenegadeClient
The [RenegadeClient](./wallet-actions.md#renegade-client) can be instantiated using the wallet secrets from above. Then, all available meethods will use the externally managed keychain to interact with your connected relayer.

Be sure to use `RenegadeClient.newWithExternalKeychain` to instantiate the client and pass in your wallet secrets like so:
```js
const chain = arbitrumSepolia;
const chainId = chain.id;

const privateKey = process.env.PKEY;
const account = privateKeyToAccount(privateKey);
const address = account.address;
const publicKey = account.publicKey;

const signMessage = async (message: string) => {
    // Hash the raw message (do not add Ethereum message prefix)
    const hashedMessage = keccak256(message as `0x${string}`);

    // Sign the hash with your private key
    const sig = await secp.signAsync(hashedMessage.slice(2), privateKey.slice(2), {
        lowS: true,
        extraEntropy: false,
    });

    // Format signature as r[32] || s[32] || v[1]
    return concatHex([
        numberToHex(sig.r, { size: 32 }), // r component
        numberToHex(sig.s, { size: 32 }), // s component
        numberToHex(sig.recovery ? 1 : 0, { size: 1 }), // recovery bit
    ]);
};

const walletSecrets = await RenegadeClient.generateKeychain({
    sign: signMessage,
});

// Instantiate a RenegadeClient using your externally managed keychain
const client = RenegadeClient.newWithExternalKeychain({
    chainId,
    publicKey,
    signMessage,
    walletSecrets,
});
```

Then, you can either create your wallet (if not already created) or lookup your existing wallet (to index it in your connected relayer's state):

```js
// Create a new wallet
await client.createWallet();

// or if you've already created a wallet for these set of secrets:

// Lookup an existing wallet
await client.lookupWallet();
```

Then, you'll be able to perform wallet actions, like fetching the latest state or placing an order:

```js
const wallet = await client.getWallet();

console.log("Wallet ID:", wallet.id);
```

For a full list of examples of actions you can perform on externally managed wallets, check out [this repo](https://github.com/renegade-fi/typescript-sdk/tree/main/examples/external-keychain).

### Key Rotation

Key rotation is an optional but recommended security practice that involves updating your wallet's cryptographic keys. While not required, failing to rotate keys may leak some privacy over time as the same key is reused across multiple operations. When using the default internally managed wallet, the SDK automatically rotates keys after each wallet update. For externally managed wallets, you'll need to handle key rotation manually.

#### Implementation

Keys can be rotated during any wallet update operation by providing a new public key. Your connected relayer will:
1. Verify the new public key is valid
2. Update the wallet's keychain
3. Use the new key for future operations

**Example**
```js
// Generate new signing keypair
const newSigningKey = generateNewSigningKey(); // Your key generation logic
const newPublicKey = derivePublicKey(newSigningKey);

// Execute operation with key rotation
const { taskId } = await client.deposit({
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
```

:::info
Key rotation is supported in all wallet update operations including deposits, withdrawals, and order placement.
:::