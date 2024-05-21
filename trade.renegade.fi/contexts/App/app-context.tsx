"use client"

import { FUNDED_ADDRESSES } from "@/constants/storage-keys"
import { fundList, fundWallet } from "@/lib/utils"
import { connect, disconnect, useConfig } from "@renegade-fi/react"
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { toast } from "sonner"
import { useReadLocalStorage } from "usehooks-ts"
import { Hex } from "viem"
import { useAccount, useAccountEffect } from "wagmi"

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

  const fundedAddresses = useReadLocalStorage<string[]>(FUNDED_ADDRESSES, {
    initializeWithValue: false,
  })
  const config = useConfig()

  // Browser Wallet
  const { address } = useAccount()

  useAccountEffect({
    onDisconnect() {
      disconnect(config)
    },
  })

  // Sign In + Funding
  const { executeTaskWithToast } = useTaskCompletionToast()

  // Attempt to fund once wallet is connected
  useEffect(() => {
    if (address && (!fundedAddresses || !fundedAddresses.includes(address))) {
      fundWallet(fundList, address)
    }
  }, [address, fundedAddresses])

  const handleSignin = async (seed: Hex) => {
    const res = await connect(config, { seed })
    if (res?.taskId) {
      await executeTaskWithToast(res.taskId, "Connecting...")
    }
    if (address && (!fundedAddresses || !fundedAddresses.includes(address))) {
      toast.promise(fundWallet(fundList.slice(0, 2), address!), {
        loading: "Funding account...",
        success: "Successfully funded account.",
        error:
          "Funding failed: An unexpected error occurred. Please try again.",
      })

      // Fund additional tokens in background
      fundWallet(fundList.slice(2), address!)
    }
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
