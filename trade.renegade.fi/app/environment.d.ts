import Next from "next"

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_DARKPOOL_CONTRACT: `0x${string}`
      NEXT_PUBLIC_DATADOG_APPLICATION_ID: string
      NEXT_PUBLIC_DATADOG_CLIENT_TOKEN: string
      NEXT_PUBLIC_INTERCOM_APP_ID: string
      NEXT_PUBLIC_PERMIT2_CONTRACT: `0x${string}`
      NEXT_PUBLIC_PRICE_REPORTER_URL: string
      NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME: string
      NEXT_PUBLIC_RPC_URL: string
      NEXT_PUBLIC_URL: string
      NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: string
    }
  }
}
