import "./env.mjs"
import analyzer from "@next/bundle-analyzer"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: function (config, options) {
    config.experiments = {
      asyncWebAssembly: true,
      syncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
    }
    config.resolve.fallback = {
      fs: false,
    }
    // temporary WalletConnect outdated modules fix
    config.externals.push("pino-pretty", "lokijs", "encoding")
    // patchWasmModuleImport(config, options.isServer)
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
// function patchWasmModuleImport(config, isServer) {
//   config.experiments = Object.assign(config.experiments || {}, {
//     asyncWebAssembly: true,
//   })
//   config.module.defaultRules = [
//     {
//       type: "javascript/auto",
//       resolve: {},
//     },
//     {
//       test: /\.json$/i,
//       type: "json",
//     },
//   ]
//   config.optimization.moduleIds = "named"

//   config.module.rules.push({
//     test: /\.wasm$/,
//     type: "asset/resource",
//   })

//   // TODO: improve this function -> track https://github.com/vercel/next.js/issues/25852
//   if (isServer) {
//     config.output.webassemblyModuleFilename =
//       "./../static/wasm/[modulehash].wasm"
//   } else {
//     config.output.webassemblyModuleFilename = "static/wasm/[modulehash].wasm"
//   }
// }

// const nextConfig = {
//   reactStrictMode: true,
//   webpack: (config) => {
//     config.resolve.fallback = { fs: false }
//     // temporary WalletConnect outdated modules fix
//     config.externals.push("pino-pretty", "lokijs", "encoding")
//     config.experiments = {
//       asyncWebAssembly: true,
//       syncWebAssembly: true,
//       layers: true,
//       topLevelAwait: true,
//     }
//     patchWasmModuleImport(config, options.isServer);
//     return config
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "assets-cdn.trustwallet.com",
//         port: "",
//         pathname: "/blockchains/ethereum/assets/**",
//       },
//     ],
//   },
// }

export default analyzer({ enabled: process.env.ANALYZE === "true" })(nextConfig)
