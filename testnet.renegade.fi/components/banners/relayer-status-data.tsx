import { env } from "@/env.mjs"
import { Renegade } from "@renegade-fi/renegade-js"

import RelayerStatusBanner from "./relayer-banner"

const renegade = new Renegade({
  relayerHostname: env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME,
  relayerHttpPort: 3000,
  relayerWsPort: 4000,
  useInsecureTransport: true,
  verbose: false,
})

async function RelayerStatusData({
  baseToken,
  quoteToken,
}: {
  baseToken: string
  quoteToken: string
}) {
  const ping = await renegade
    ?.ping()
    .then(() => "live")
    .catch(() => "dead")
  return (
    <RelayerStatusBanner
      connectionState={ping}
      activeBaseTicker={baseToken}
      activeQuoteTicker={quoteToken}
    />
  )
}

export default RelayerStatusData
