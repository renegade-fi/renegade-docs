"use client"

import { fundList, fundWallet } from "@/lib/utils"
import {
  OrderState,
  Token,
  UseOrderHistoryWebSocketReturnType,
  connect,
  disconnect,
  formatAmount,
  useConfig,
  useOrderHistory,
  useOrderHistoryWebSocket,
  useOrders,
} from "@renegade-fi/react"
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { toast } from "sonner"
import { useLocalStorage } from "usehooks-ts"
import { Hex } from "viem"
import { useAccount } from "wagmi"

import useTaskCompletionToast from "@/hooks/use-task-completion-toast"

export enum ViewEnum {
  TRADING,
  DEPOSIT,
  WITHDRAW,
}

export interface AppContextValue {
  setView: (view: ViewEnum) => void
  tokenIcons: Record<string, string>
  view: ViewEnum
  onSignin: (seed: Hex) => Promise<void>
}

const AppStateContext = createContext<AppContextValue | undefined>(undefined)

function AppProvider({
  children,
  tokenIcons,
}: PropsWithChildren & { tokenIcons?: Record<string, string> }) {
  const [view, setView] = useState<ViewEnum>(ViewEnum.TRADING)

  // Order History Panel
  const orderHistory = useOrderHistory()
  const incomingOrder = useOrderHistoryWebSocket()
  const orders = useOrders()
  const orderMetadataRef = useRef<
    Map<string, UseOrderHistoryWebSocketReturnType>
  >(new Map())

  // Hydrate initial filled states
  useEffect(() => {
    orderHistory.forEach((order) => {
      if (orderMetadataRef.current.get(order.id)) return
      orderMetadataRef.current.set(order.id, order)
    })
  }, [orderHistory])

  useEffect(() => {
    if (incomingOrder) {
      const {
        id,
        filled,
        state,
        data: { base_mint, amount, side },
      } = incomingOrder
      const base = Token.findByAddress(base_mint)
      const formattedAmount = formatAmount(amount, base)
      const formattedFilled = formatAmount(filled, base)
      const lastFilled = orderMetadataRef.current.get(id)?.filled || BigInt(0)

      // Ignore duplicate events
      if (orderMetadataRef.current.get(id)?.state === state) {
        return
      }

      // TODO: Race condition if user orders gets update quicker than order history
      if (state === OrderState.Created && !orders.find((o) => o.id === id)) {
        toast.success(
          `Order created: ${side} ${formattedAmount} ${base.ticker}`
        )
      } else if (state === OrderState.Filled) {
        toast.success(
          `Order completely filled: ${
            side === "Buy" ? "Bought" : "Sold"
          } ${formattedFilled} ${base.ticker}`
        )
      } else if (filled > lastFilled) {
        const currentFill = filled - lastFilled
        const formattedCurrentFill = formatAmount(currentFill, base)
        toast.success(
          `Order partially filled: ${
            side === "Buy" ? "Bought" : "Sold"
          } ${formattedCurrentFill} ${base.ticker}`
        )
      } else if (state === OrderState.Cancelled) {
        toast.success(
          `Order cancelled: ${side} ${formattedAmount} ${base.ticker}`
        )
      }

      orderMetadataRef.current.set(id, incomingOrder)
    }
  }, [incomingOrder, orders])

  const config = useConfig()

  // Browser Wallet
  const { address } = useAccount()
  const prevAddressRef = useRef<string>()
  useEffect(() => {
    if (
      prevAddressRef.current &&
      address &&
      prevAddressRef.current !== address
    ) {
      disconnect(config)
    }
    prevAddressRef.current = address
  }, [address, config])

  // Funding
  const [funded] = useLocalStorage(`funded_${address}`, false)
  const { executeTaskWithToast } = useTaskCompletionToast()
  const handleSignin = async (seed: Hex) => {
    const res = await connect(config, { seed })
    if (res?.taskId) {
      await executeTaskWithToast(res.taskId, "Connecting...")
    }
    if (funded) return
    toast.promise(
      fundWallet(
        [
          { ticker: "WETH", amount: "10" },
          { ticker: "USDC", amount: "1000000" },
        ],
        address!
      ),
      {
        loading: "Funding account...",
        success: "Your account has been funded with test funds.",
        error:
          "Funding failed: An unexpected error occurred. Please try again.",
      }
    )

    // Fund additional wallets in background
    fundWallet(fundList, address!)
  }

  return (
    <AppStateContext.Provider
      value={{
        onSignin: handleSignin,
        setView,
        tokenIcons: tokenIcons || {},
        view,
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

function useApp() {
  const context = useContext(AppStateContext)
  if (context === undefined) {
    throw new Error("useApp must be used within a AppProvider")
  }
  return context
}

export { AppProvider, useApp }
