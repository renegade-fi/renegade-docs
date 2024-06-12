"use client"

import { fundList, fundWallet } from "@/lib/utils"
import { chain, useConfig } from "@renegade-fi/react"
import { disconnect } from "@renegade-fi/react/actions"
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { createPublicClient } from "viem"
import { http, useAccount, useAccountEffect } from "wagmi"

export enum ViewEnum {
  TRADING,
  DEPOSIT,
  WITHDRAW,
}

export interface AppContextValue {
  setView: (view: ViewEnum) => void
  tokenIcons: Record<string, string>
  view: ViewEnum
}

const AppStateContext = createContext<AppContextValue | undefined>(undefined)

const publicClient = createPublicClient({
  chain,
  transport: http(),
})

function AppProvider({
  children,
  tokenIcons,
}: PropsWithChildren & { tokenIcons?: Record<string, string> }) {
  const [view, setView] = useState<ViewEnum>(ViewEnum.TRADING)

  const config = useConfig()

  // Browser Wallet
  const { connector } = useAccount()

  // Disconnect/fund wallet on change
  useEffect(() => {
    const handleConnectorUpdate = async (
      data: {
        accounts?: readonly `0x${string}`[] | undefined
        chainId?: number | undefined
      } & {
        uid: string
      }
    ) => {
      if (data.accounts) {
        disconnect(config)
        const balance = await publicClient.getBalance({
          address: data.accounts[0],
        })
        if (!balance) {
          fundWallet(fundList, data.accounts[0])
        }
      }
    }

    if (connector?.emitter) {
      connector.emitter.on("change", handleConnectorUpdate)
    }

    return () => {
      if (connector?.emitter) {
        connector?.emitter.off("change", handleConnectorUpdate)
      }
    }
  }, [config, connector?.emitter])

  useAccountEffect({
    onDisconnect() {
      disconnect(config)
    },
  })

  return (
    <AppStateContext.Provider
      value={{
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
