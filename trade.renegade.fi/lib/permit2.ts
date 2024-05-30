import { Token } from "@renegade-fi/react"
import {
  TypedDataDomain,
  WalletClient,
  hashTypedData,
  verifyTypedData,
} from "viem"
import { publicKeyToAddress, recoverPublicKey } from "viem/utils"

export function millisecondsToSeconds(milliseconds: number): number {
  return Math.floor(milliseconds / 1000)
}

const TOKEN_PERMISSIONS = [
  { name: "token", type: "address" },
  { name: "amount", type: "uint256" },
]

const DEPOSIT_WITNESS = [{ name: "pkRoot", type: "uint256[4]" }]

const PERMIT_WITNESS_TRANSFER_FROM_TYPES = {
  PermitWitnessTransferFrom: [
    { name: "permitted", type: "TokenPermissions" },
    { name: "spender", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" },
    { name: "witness", type: "DepositWitness" },
  ],
  TokenPermissions: TOKEN_PERMISSIONS,
  DepositWitness: DEPOSIT_WITNESS,
}

/**
 * Signs a permit allowing a specified spender to transfer a specified amount of tokens from the signer's account.
 * This function constructs a domain and message for the permit, signs it using the wallet client, and verifies the signature.
 * It also ensures the public key recovered from the signature matches the wallet's public key.
 * @param {bigint} amount - The decimal-adjusted amount of tokens to permit the spender to transfer.
 * @param {number} chainId - The chain ID of the network.
 * @param {string} spender - The address of the spender who is permitted to transfer the tokens.
 * @param {string} permit2Address - The address of the deployed Permit2 contract.
 * @param {Token} token - The token object containing the address of the token to be transferred.
 * @param {WalletClient} walletClient - The wallet client used to sign the permit.
 *
 * @returns {Promise<{signature: string, nonce: bigint, deadline: bigint}>} An object containing the signature, nonce, and deadline of the permit.
 *
 * @throws {Error} Throws an error if the wallet client's account address is not found, the signature is invalid, or the recovered public key does not match the wallet's public key.
 */
export async function signPermit2({
  amount,
  chainId,
  spender,
  permit2Address,
  token,
  walletClient,
  pkRoot,
}: {
  amount: bigint
  chainId: number
  spender: `0x${string}`
  permit2Address: `0x${string}`
  token: Token
  walletClient: WalletClient
  pkRoot: bigint[]
}) {
  if (!walletClient.account)
    throw new Error("`0x${string}` not found on wallet client")

  // Construct Domain
  const domain: TypedDataDomain = {
    name: "Permit2",
    chainId,
    verifyingContract: permit2Address as `0x${string}`,
  }

  // Construct Message
  const message = {
    permitted: {
      token: token.address,
      amount,
    },
    spender,
    nonce: BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)),
    deadline: BigInt(millisecondsToSeconds(Date.now() + 1000 * 60 * 30)),
    witness: { pkRoot },
  } as const

  // Generate signature
  const signature = await walletClient.signTypedData({
    account: walletClient.account.address,
    domain,
    types: PERMIT_WITNESS_TRANSFER_FROM_TYPES,
    primaryType: "PermitWitnessTransferFrom",
    message,
  })

  // Verify signature
  const valid = await verifyTypedData({
    address: walletClient.account.address,
    domain,
    types: PERMIT_WITNESS_TRANSFER_FROM_TYPES,
    primaryType: "PermitWitnessTransferFrom",
    message,
    signature,
  })
  if (!valid) throw new Error("Invalid signature")

  // Ensure correct public key is recovered
  const hash = hashTypedData({
    domain,
    types: PERMIT_WITNESS_TRANSFER_FROM_TYPES,
    primaryType: "PermitWitnessTransferFrom",
    message,
  })
  const recoveredPubKey = publicKeyToAddress(
    await recoverPublicKey({
      hash,
      signature,
    })
  )
  if (recoveredPubKey !== walletClient.account.address)
    throw new Error("Recovered public key does not match wallet public key")

  return { signature, nonce: message.nonce, deadline: message.deadline }
}
