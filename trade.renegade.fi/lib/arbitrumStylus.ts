import { defineChain } from "viem"

export const arbitrumStylus = defineChain({
  id: 412346,
  name: "Stylus testnet",
  network: "Arbitrum Stylus",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://localhost:8547"],
      webSocket: [
        "wss://mainnet.infura.io/ws/v3/68c04ec6f9ce42c5becbed52a464ef81",
      ],
    },
    public: {
      http: ["http://localhost:8547"],
      webSocket: [
        "wss://mainnet.infura.io/ws/v3/68c04ec6f9ce42c5becbed52a464ef81",
      ],
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
