import { createPublicClient, defineChain, http } from "viem"
import { arbitrumSepolia } from "viem/chains"

const renegadeDevnet = defineChain({
  id: Number(process.env.NEXT_PUBLIC_CHAIN_ID),
  name: "Renegade Devnet",
  testnet: true,
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_URL],
    },
  },
})

export const chain =
  process.env.NEXT_PUBLIC_CHAIN_ID === "421614"
    ? arbitrumSepolia
    : renegadeDevnet

export const viemClient = createPublicClient({
  chain,
  transport: http(),
})
