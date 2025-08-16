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

### Key Components

The external key management flow consists of three main components:

1. **Wallet Secrets** - The **secret** cryptographic material you generate and store:
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
```js
import { generateWalletSecrets } from "@renegade-fi/node"
```

**Parameters**
- `signer`: A function that generates a secp256k1 signature for a given message
  - Input: Unhashed message as hex string
  - Output: Signature as hex string with recovery bit
  - Must NOT prefix with Ethereum signed message header

**Example**
```js
// Create a signer function that generates a secp256k1 signature for a given message
const signer = async (message: string) => {
  // Hash the raw message (do not add Ethereum message prefix)
  const hashedMessage = keccak256(message);
  
  // Sign the hash with your private key
  const sig = await secp.signAsync(
    hashedMessage.slice(2), // Remove the '0x' prefix
    env.PRIVATE_KEY.slice(2), // Remove the '0x' prefix
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

### createExternalKeyConfig

Creates a configuration object for interacting with the relayer using an externally managed wallet. The required secrets should be obtained from [generateWalletSecrets](#generating-wallet-secrets) first.

**Import**
```js
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
```js
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
  relayerUrl: "https://arbitrum-sepolia.cluster0.renegade.fi:3000",
  websocketUrl: "wss://arbitrum-sepolia.cluster0.renegade.fi:4000",
  darkPoolAddress: "0x9af58f1ff20ab22e819e40b57ffd784d115a9ef5",
  viemClient: publicClient,
});
```

**Signing Function Example**
```js
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
```js
import { type ExternalConfig } from '@renegade-fi/node'
```


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

Once you have created an Externally Managed Wallet, you can use it to interact with the relayer. When using an Externally Managed Wallet, you should instantiate an `ExternalConfig` object instead of a `Config` object and pass it as the first parameter actions. Otherwise, usage is the same as described in the [Wallet Actions](./wallet-actions) page.


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