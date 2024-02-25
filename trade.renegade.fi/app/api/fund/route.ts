import { Token } from "@renegade-fi/renegade-js"
import {
  createPublicClient,
  createWalletClient,
  formatEther,
  formatUnits,
  http,
  parseAbi,
  parseEther,
  parseUnits,
} from "viem"
import { privateKeyToAccount } from "viem/accounts"

import { stylusDevnetEc2 } from "@/lib/chain"

const abi = parseAbi([
  "function transfer(address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 amount)",
])

export async function GET(request: Request) {
  if (!process.env.DEV_PRIVATE_KEY) {
    return new Response("DEV_PRIVATE_KEY is required", {
      status: 400,
    })
  }

  const { searchParams } = new URL(request.url)
  const recipient = searchParams.get("address") as `0x${string}`
  if (!recipient) {
    return new Response("Address is required", {
      status: 400,
    })
  }

  try {
    // Account to fund from
    const account = privateKeyToAccount(
      process.env.DEV_PRIVATE_KEY as `0x${string}`
    )

    const publicClient = createPublicClient({
      chain: stylusDevnetEc2,
      transport: http(),
    })

    const walletClient = createWalletClient({
      account,
      chain: stylusDevnetEc2,
      transport: http(),
    })

    const ethAmount = parseEther("0.1")
    const wethAmount = parseEther("1")
    const usdcAmount = parseUnits("3000", 18)

    const balance = await publicClient.getBalance({
      address: recipient,
    })
    if (balance >= ethAmount) {
      return new Response("Already funded", {
        status: 208,
      })
    }

    const transactionCount = await publicClient.getTransactionCount({
      address: account.address,
    })

    // Fund with ETH
    const hash = await walletClient.sendTransaction({
      account,
      to: recipient,
      value: ethAmount,
      nonce: transactionCount,
    })
    const transaction = await publicClient.waitForTransactionReceipt({
      hash,
    })
    console.log(
      `Funded ${recipient} with ${formatEther(
        ethAmount
      )} ETH. Transaction hash: ${transaction.transactionHash}`
    )

    // Fund with WETH
    const { request: wethRequest } = await publicClient.simulateContract({
      account,
      address: Token.findAddressByTicker("WETH") as `0x${string}`,
      abi,
      functionName: "transfer",
      args: [recipient, wethAmount],
      nonce: transactionCount + 1,
    })

    const wethHash = await walletClient.writeContract(wethRequest)
    const wethTransaction = await publicClient.waitForTransactionReceipt({
      hash: wethHash,
    })
    console.log(
      `Funded ${recipient} with ${formatUnits(
        wethAmount,
        18
      )} WETH. Transaction hash: ${wethTransaction.transactionHash}`
    )

    // Fund with UDSC
    const { request: usdcRequest } = await publicClient.simulateContract({
      account,
      address: Token.findAddressByTicker("USDC") as `0x${string}`,
      abi,
      functionName: "transfer",
      args: [recipient, usdcAmount],
      nonce: transactionCount + 2,
    })

    const usdcHash = await walletClient.writeContract(usdcRequest)
    const usdcTransaction = await publicClient.waitForTransactionReceipt({
      hash: usdcHash,
    })
    console.log(
      `Funded ${recipient} with ${formatUnits(
        usdcAmount,
        18
      )} USDC. Transaction hash: ${usdcTransaction.transactionHash}`
    )

    return new Response("Success!", {
      status: 200,
    })
  } catch (error) {
    return new Response(`Error funding ${recipient}: ${error}`, {
      status: 500,
    })
  }
}
