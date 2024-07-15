import { chain } from "@/lib/viem"
import { NextRequest } from "next/server"
import { createPublicClient, http, parseAbiItem } from "viem"

export const runtime = "edge"

// Necessary because public RPC does not support getting logs
const viemClient = createPublicClient({
  chain,
  transport: http(process.env.RPC_URL),
})

export async function GET(req: NextRequest) {
  try {
    const blinderShare = BigInt(
      req.nextUrl.searchParams.get("blinderShare") || "0"
    )
    if (!blinderShare) {
      throw new Error("Blinder share is required")
    }
    const logs = await viemClient.getLogs({
      address: process.env.NEXT_PUBLIC_DARKPOOL_CONTRACT,
      event: parseAbiItem(
        "event WalletUpdated(uint256 indexed wallet_blinder_share)"
      ),
      args: {
        wallet_blinder_share: blinderShare,
      },
      fromBlock: BigInt(process.env.FROM_BLOCK || 0),
    })
    return new Response(JSON.stringify({ logs: logs.length }))
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error }), { status: 500 })
  }
}
