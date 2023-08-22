import "./env.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false }
    // temporary WalletConnect outdated modules fix
    config.externals.push("pino-pretty", "lokijs", "encoding")
    return config
  },
}

export default nextConfig
