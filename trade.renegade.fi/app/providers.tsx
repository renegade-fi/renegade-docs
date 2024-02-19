"use client"

import { PropsWithChildren, useEffect } from "react"
import { AppProvider } from "@/contexts/App/app-context"
import { ExchangeProvider } from "@/contexts/Exchange/exchange-context"
import { RenegadeProvider } from "@/contexts/Renegade/renegade-context"
import { env } from "@/env.mjs"
import { menuAnatomy } from "@chakra-ui/anatomy"
import { CacheProvider } from "@chakra-ui/next-js"
import {
  ChakraProvider,
  ColorModeScript,
  createMultiStyleConfigHelpers,
  extendTheme,
  keyframes,
  type ThemeConfig,
} from "@chakra-ui/react"
import { Renegade } from "@renegade-fi/renegade-js"
import { ConnectKitProvider, getDefaultConfig } from "connectkit"
import { IntercomProvider } from "react-use-intercom"
import { Toaster } from "sonner"
import { createPublicClient, http } from "viem"
import { WagmiConfig, createConfig } from "wagmi"

import { stylusDevnetEc2 } from "@/lib/stylus"

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys)

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
}

const gradientShiftAimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
     background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

const styles = {
  global: {
    body: {
      fontFamily: "Favorit Extended",
      fontWeight: "400",
      fontSize: "0.9em",
      color: "white",
      bg: "black",
    },
  },
}

const colors = {
  green: "#43e043",
  red: "#e04943",
  brown: "#231f20",
  "brown.light": "#372f2f",
  "white.100": "#ffffff",
  "white.90": "#e6e6e6",
  "white.80": "#cccccc",
  "white.70": "#b3b3b3",
  "white.60": "#999999",
  "white.50": "#94938d",
  "white.40": "#666666",
  "white.30": "#4d4d4d",
  "white.20": "#333333",
  "white.10": "#1a1a1a",
  "white.5": "#0d0d0d",
  surfaces: {
    1: "#1e1e1e",
  },
}

const menuStyle = definePartsStyle({
  list: {
    minWidth: "auto",
    padding: "0",
    background: "transparent",
  },
  item: {
    minWidth: "auto",
    padding: "0",
    background: "transparent",
    fontSize: "1.3em",
    color: "white.100",
    _hover: {
      background: "rgba(255, 255, 255, 0.05)",
    },
    _focus: {
      background: "rgba(255, 255, 255, 0.05)",
    },
  },
})

const components = {
  Text: {
    variants: {
      "status-green": {
        fontSize: "0.85em", fontWeight: "700",
        color: "green",
        textShadow: "0 0 5px green",
      },
      "status-red": {
        fontSize: "0.85em",
        fontWeight: "700",
        color: "red",
        textShadow: "0 0 5px red",
      },
      "status-gray": {
        fontSize: "0.85em",
        fontWeight: "700",
        color: "white.30",
      },
      "trading-body-button": {
        fontFamily: "Aime",
        fontSize: "1.3em",
        fontWeight: "700",
        color: "white.100",
      },
      "trading-body-button-blurred": {
        fontFamily: "Aime",
        fontSize: "1.3em",
        fontWeight: "700",
        color: "white.50",
      },
      "rotate-left": {
        lineHeight: "1",
        transform: "rotate(180deg)",
        writingMode: "vertical-rl",
        textOrientation: "sideways",
      },
      "rotate-right": {
        lineHeight: "1",
        writingMode: "vertical-rl",
        textOrientation: "sideways",
      },
      blurred: {
        filter: "blur(5px)",
        transition: "filter 0.3s ease-in-out",
      },
    },
  },
  Button: {
    variants: {
      "wallet-connect": {
        fontWeight: "400",
        fontSize: "1.1em",
        color: "white",
        background:
          "linear-gradient(135deg, #000000 0%,#3d3d3d 14%,#3d3d3d 14%,#111111 21%,#3d3d3d 39%,#010101 50%,#3d3d3d 61%,#161616 67%,#3d3d3d 80%,#212121 85%,#1b1b1b 100%)",
        backgroundSize: "400% 400%",
        animation: `${gradientShiftAimation} 45s ease infinite`,
        border: "var(--border)",
        borderColor: "white.20",
        _hover: {
          animationPlayState: "paused",
          borderColor: "white.60",
        },
      },
    },
  },
  Menu: defineMultiStyleConfig({ baseStyle: menuStyle }),
}
const theme = extendTheme({ config, styles, colors, components })

const wagmiConfig = createConfig(
  getDefaultConfig({
    alchemyId: "",
    walletConnectProjectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    appName: "Renegade | On-Chain Dark Pool",
    appDescription:
      "On-chain dark pool. MPC-based cryptocurrency DEX for anonymous crosses at midpoint prices.",
    appUrl: "https://renegade.fi",
    appIcon: "https://www.renegade.fi/glyph_light.svg",
    chains: [stylusDevnetEc2],
  })
)

export const client = createPublicClient({
  chain: stylusDevnetEc2,
  transport: http(),
})

export const renegade = new Renegade({
  relayerHostname: env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME,
  relayerHttpPort: 3000,
  relayerWsPort: 4000,
  useInsecureTransport:
    env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME === "localhost",
  verbose: false,
})

export function Providers({
  children,
  icons,
}: PropsWithChildren & {
  icons?: Record<string, string>
}) {
  useEffect(() => {
    async function loadUtils() {
      await renegade.init()
    }
    loadUtils()
  }, [])
  return (
    <>
      <IntercomProvider appId={env.NEXT_PUBLIC_INTERCOM_APP_ID} autoBoot>
        <CacheProvider>
          <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <WagmiConfig config={wagmiConfig}>
              <ConnectKitProvider
                mode="dark"
                customTheme={{
                  "--ck-overlay-background": "rgba(0, 0, 0, 0.25)",
                  "--ck-overlay-backdrop-filter": "blur(8px)",
                  "--ck-font-family": "Favorit Extended",
                  "--ck-border-radius": "10px",
                  "--ck-body-background": "#1e1e1e",
                  "--ck-spinner-color": "#ffffff",
                }}
              >
                <RenegadeProvider>
                  <ExchangeProvider>
                    <AppProvider tokenIcons={icons}>
                      <Toaster
                        position="bottom-center"
                        toastOptions={{
                          style: {
                            background: "black",
                            borderColor: "#262626",
                            color: "inherit",
                          },
                        }}
                      />
                      {children}
                    </AppProvider>
                  </ExchangeProvider>
                </RenegadeProvider>
              </ConnectKitProvider>
            </WagmiConfig>
          </ChakraProvider>
        </CacheProvider>
      </IntercomProvider>
    </>
  )
}
