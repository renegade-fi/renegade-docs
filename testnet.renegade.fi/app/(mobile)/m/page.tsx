import { env } from "@/env.mjs"
import { Renegade, Token } from "@renegade-fi/renegade-js"

import { getTokenBannerData } from "@/lib/utils"
import { MobileBody } from "@/components/mobile/body"
import { MobileNav } from "@/components/mobile/main-nav"

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
    <>
      <MobileNav />
      <MobileBody prices={prices} report={report} />
    </>
  )
}
