import { defineChain } from "viem"

export const arbitrumStylus = defineChain({
  id: 23011913,
  name: "Stylus testnet",
  network: "Arbitrum Stylus",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://stylus-testnet.arbitrum.io/rpc"],
      webSocket: ["wss://stylus-testnet.arbitrum.io/feed"],
    },
    public: {
      http: ["https://stylus-testnet.arbitrum.io/rpc"],
      webSocket: ["wss://stylus-testnet.arbitrum.io/feed"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://stylus-testnet-explorer.arbitrum.io/",
    },
  },
  contracts: {
    multicall2: {
      address: "0x42aaE78422EF3e8E6d0D88e58E25CA7C7Ecb9D5a",
      blockCreated: 26,
    },
  },
})
