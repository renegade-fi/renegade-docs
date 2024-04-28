import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_DARKPOOL_CONTRACT: z.string().min(1),
    NEXT_PUBLIC_DATADOG_APPLICATION_ID: z.string().min(1),
    NEXT_PUBLIC_DATADOG_CLIENT_TOKEN: z.string().min(1),
    NEXT_PUBLIC_INTERCOM_APP_ID: z.string().min(1),
    NEXT_PUBLIC_PERMIT2_CONTRACT: z.string().min(1),
    NEXT_PUBLIC_PRICE_REPORTER_URL: z.string().min(1),
    NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME: z.string().min(1),
    NEXT_PUBLIC_RPC_URL: z.string().min(1),
    NEXT_PUBLIC_URL: z.string().min(1),
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1),
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_DARKPOOL_CONTRACT: process.env.NEXT_PUBLIC_DARKPOOL_CONTRACT,
    NEXT_PUBLIC_DATADOG_APPLICATION_ID:
      process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID,
    NEXT_PUBLIC_DATADOG_CLIENT_TOKEN:
      process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
    NEXT_PUBLIC_INTERCOM_APP_ID: process.env.NEXT_PUBLIC_INTERCOM_APP_ID,
    NEXT_PUBLIC_PERMIT2_CONTRACT: process.env.NEXT_PUBLIC_PERMIT2_CONTRACT,
    NEXT_PUBLIC_PRICE_REPORTER_URL: process.env.NEXT_PUBLIC_PRICE_REPORTER_URL,
    NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME:
      process.env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME,
    NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  },
})
