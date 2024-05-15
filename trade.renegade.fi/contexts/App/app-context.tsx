"use client"

import { fundList, fundWallet } from "@/lib/utils"
import { connect, disconnect, useConfig } from "@renegade-fi/react"
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { toast } from "sonner"
import { useReadLocalStorage } from "usehooks-ts"
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

  // Sign In + Funding
  const { executeTaskWithToast } = useTaskCompletionToast()
  const funded = useReadLocalStorage(`funded_${address}`)

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
