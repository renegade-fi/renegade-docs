import "./env.mjs"
import analyzer from "@next/bundle-analyzer"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false }
    // temporary WalletConnect outdated modules fix
    config.externals.push("pino-pretty", "lokijs", "encoding")
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets-cdn.trustwallet.com",
        port: "",
        pathname: "/blockchains/ethereum/assets/**",
      },
    ],
  },
}

export default analyzer({ enabled: process.env.ANALYZE === "true" })(nextConfig)
