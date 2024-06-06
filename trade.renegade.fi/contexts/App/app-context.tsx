"use client"

import { FUNDED_ADDRESSES } from "@/constants/storage-keys"
import { fundList, fundWallet } from "@/lib/utils"
import { disconnect, useConfig } from "@renegade-fi/react"
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { useReadLocalStorage } from "usehooks-ts"
import { useAccount, useAccountEffect } from "wagmi"

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
  const { address, connector } = useAccount()

  // Disconnect/fund wallet on change
  useEffect(() => {
    const handleConnectorUpdate = (
      data: {
        accounts?: readonly `0x${string}`[] | undefined
        chainId?: number | undefined
      } & {
        uid: string
      }
    ) => {
      if (data.accounts) {
        disconnect(config)
        if (!fundedAddresses || !fundedAddresses.includes(data.accounts[0])) {
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
  }, [connector, config, fundedAddresses])

  // Attempt to fund once wallet is connected
  useEffect(() => {
    if (address && (!fundedAddresses || !fundedAddresses.includes(address))) {
      fundWallet(fundList, address)
    }
  }, [address, fundedAddresses])

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
