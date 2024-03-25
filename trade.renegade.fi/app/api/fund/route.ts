import { Token } from "@renegade-fi/renegade-js"
import {
  createPublicClient,
  createWalletClient,
  formatEther,
  http,
  parseAbi,
  parseEther
} from "viem"
import { privateKeyToAccount } from "viem/accounts"

import { formatAmount, parseAmount } from "@/lib/utils"
import { stylusDevnetEc2 } from "@/lib/viem"

const TOKENS_TO_FUND: { ticker: string; amount: string }[] = [
  {
    ticker: "WETH",
    amount: "10"
  },
  {
    ticker: "USDC",
    amount: "100000"
  },
  {
    ticker: "WBTC",
    amount: "3"
  },
  {
    ticker: "DYDX",
    amount: "3"
  }
]

// TODO: Make sure mint works
const abi = parseAbi([
  "function mint(address _address, uint256 value) external",
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

    let transactionCount = await publicClient.getTransactionCount({
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

    for (const { ticker, amount } of TOKENS_TO_FUND) {
      const token = new Token({ ticker })
      const tokenAmount = parseAmount(amount, token)

      const { request: tokenRequest } = await publicClient.simulateContract({
        account,
        address: Token.findAddressByTicker(ticker) as `0x${string}`,
        abi,
        functionName: "mint",
        args: [recipient, tokenAmount],
        nonce: ++transactionCount,
      });

      const tokenHash = await walletClient.writeContract(tokenRequest);
      const tokenTransaction = await publicClient.waitForTransactionReceipt({
        hash: tokenHash,
      });
      console.log(
        `Funded ${recipient} with ${formatAmount(
          tokenAmount,
          token
        )} ${ticker}. Transaction hash: ${tokenTransaction.transactionHash}`
      );
    }

    return new Response("Success!", {
      status: 200,
    })
  } catch (error) {
    return new Response(`Error funding ${recipient}: ${error}`, {
      status: 500,
    })
  }
}
