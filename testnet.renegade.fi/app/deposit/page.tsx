import backgroundPattern from "@/icons/background_pattern.png"

import OrdersAndCounterpartiesPanel from "@/components/orders-panel"
import WalletsPanel from "@/components/wallets-panel"

import DepositBody from "../../components/deposit-body"
import { DepositProvider } from "./deposit-context"

export default async function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: "1",
        backgroundImage: `url(${backgroundPattern.src})`,
        backgroundSize: "cover",
      }}
    >
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
