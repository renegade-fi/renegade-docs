import { DepositProvider } from "@/contexts/Deposit/deposit-context"
import { env } from "@/env.mjs"
import { Renegade, Token } from "@renegade-fi/renegade-js"

import { MedianBanner } from "@/components/banners/median-banner"
import { OrdersAndCounterpartiesPanel } from "@/components/panels/orders-panel"
import { WalletsPanel } from "@/components/panels/wallets-panel"
import { DepositBody } from "@/app/deposit/body"

const renegade = new Renegade({
  relayerHostname: env.NEXT_PUBLIC_RENEGADE_RELAYER_HOSTNAME,
  relayerHttpPort: 3000,
  relayerWsPort: 4000,
  useInsecureTransport:
    env.NEXT_PUBLIC_NODE_ENV === "development" ? true : false,
  verbose: false,
})

export default async function Page() {
  const report = await renegade.queryExchangeHealthStates(
    new Token({ ticker: "WETH" }),
    new Token({ ticker: "USDC" })
  )
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: "1",
      }}
    >
      <MedianBanner report={report} />
      <div style={{ flexGrow: 1, display: "flex" }}>
        <WalletsPanel />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            overflowX: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: "1",
              position: "relative",
            }}
          >
            <DepositProvider>
              <DepositBody />
            </DepositProvider>
            <div
              style={{
                position: "absolute",
                right: "0",
                bottom: "0",
              }}
            >
              {/* <TaskStatus /> */}
            </div>
          </div>
        </div>
        <OrdersAndCounterpartiesPanel />
      </div>
    </div>
  )
}
