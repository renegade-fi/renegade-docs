import { Renegade, Token } from "@renegade-fi/renegade-js"

import { env } from "@/env.mjs"
import { getTokenBannerData } from "@/lib/utils"

import { MobileBody } from "./body"
import { MobileNav } from "./main-nav"

export const dynamic = "force-dynamic"

const renegade = new Renegade({
  relayerHostname: env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME,
  relayerHttpPort: 3000,
  relayerWsPort: 4000,
  useInsecureTransport:
    env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME === "localhost",
  verbose: false,
})
export default async function Page() {
  const prices = await getTokenBannerData(renegade)
  const report = await renegade.queryExchangeHealthStates(
    new Token({ ticker: "WBTC" }),
    new Token({ ticker: "USDC" })
  )
  return (
    <div style={{ height: "100vh", overflowY: "hidden" }}>
      <MobileNav />
      <MobileBody prices={prices} report={report} />
    </div>
  )
}
