"use client"

import { OrderToaster } from "@/app/order-toaster"
import { TaskToaster } from "@/app/task-toaster"
import { AppProvider } from "@/contexts/App/app-context"
import { PriceProvider } from "@/contexts/PriceContext/price-context"
import { env } from "@/env.mjs"
import { safeLocalStorageGetItem } from "@/lib/utils"
import { menuAnatomy } from "@chakra-ui/anatomy"
import { CacheProvider } from "@chakra-ui/next-js"
import {
  ChakraProvider,
  ColorModeScript,
  type ThemeConfig,
  createMultiStyleConfigHelpers,
  extendTheme,
  keyframes,
} from "@chakra-ui/react"
import { datadogLogs } from "@datadog/browser-logs"
import { datadogRum } from "@datadog/browser-rum"
import {
  RenegadeProvider,
  createConfig as createSDKConfig,
} from "@renegade-fi/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConnectKitProvider, getDefaultConfig } from "connectkit"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { PropsWithChildren, useEffect } from "react"
import { IntercomProvider } from "react-use-intercom"
import { Toaster } from "sonner"
import { http } from "viem"
import { WagmiProvider, createConfig } from "wagmi"

dayjs.extend(relativeTime)

/*
 * ┌─────────────────────┐
 * │    Chakra Config    |
 * └─────────────────────┘
 */

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
        fontSize: "0.85em",
        fontWeight: "700",
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

const rememberMe = safeLocalStorageGetItem("rememberMe") === "1"
export const renegadeConfig = createSDKConfig({
  darkPoolAddress: env.NEXT_PUBLIC_DARKPOOL_CONTRACT as `0x${string}`,
  priceReporterUrl: env.NEXT_PUBLIC_PRICE_REPORTER_URL,
  relayerUrl: env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME,
  rpcUrl: env.NEXT_PUBLIC_RPC_URL,
  shouldPersist: rememberMe,
  ssr: true,
})

const renegadeChain = renegadeConfig.getRenegadeChain()

/*
 * ┌─────────────────────┐
 * │    Wallet Config    |
 * └─────────────────────┘
 */
export const wagmiConfig = createConfig(
  getDefaultConfig({
    appDescription:
      "On-chain dark pool. MPC-based cryptocurrency DEX for anonymous crosses at midpoint prices.",
    appName: "Renegade | On-Chain Dark Pool",
    appIcon: "https://www.renegade.fi/glyph_light.svg",
    appUrl: "https://renegade.fi",
    chains: [renegadeChain],
    ssr: true,
    transports: {
      [renegadeChain.id]: http(),
    },
    walletConnectProjectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  })
)

const queryClient = new QueryClient()

export function Providers({
  children,
  icons,
}: PropsWithChildren & {
  icons?: Record<string, string>
}) {
  useEffect(() => {
    async function loadUtils() {
      datadogRum.init({
        applicationId: env.NEXT_PUBLIC_DATADOG_APPLICATION_ID,
        clientToken: env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
        site: "us5.datadoghq.com",
        service: "staging-interface",
        env: "staging",
        version: "1.0.0",
        sessionSampleRate: 100,
        sessionReplaySampleRate: 100,
        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: "allow",
        startSessionReplayRecordingManually: true,
      })

      datadogLogs.init({
        clientToken: env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
        site: "us5.datadoghq.com",
        service: "staging-interface",
        env: "staging",
        forwardErrorsToLogs: true,
        forwardConsoleLogs: "all",
        sessionSampleRate: 100,
      })

      datadogRum.startSessionReplayRecording()
    }
    loadUtils()
    return () => {
      datadogRum.stopSessionReplayRecording()
    }
  }, [])
  return (
    <>
      <IntercomProvider appId={env.NEXT_PUBLIC_INTERCOM_APP_ID} autoBoot>
        <CacheProvider>
          <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <RenegadeProvider
              reconnectOnMount={!!rememberMe}
              config={renegadeConfig}
            >
              <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
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
                    <PriceProvider>
                      <AppProvider tokenIcons={icons}>
                        <Toaster position="bottom-center" richColors />
                        <TaskToaster />
                        <OrderToaster />
                        {children}
                      </AppProvider>
                    </PriceProvider>
                  </ConnectKitProvider>
                </QueryClientProvider>
              </WagmiProvider>
            </RenegadeProvider>
          </ChakraProvider>
        </CacheProvider>
      </IntercomProvider>
    </>
  )
}
