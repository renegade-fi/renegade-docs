"use client"

import { disconnect, useConfig } from "@sehyunchung/renegade-react"
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { useAccount } from "wagmi"

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
  const { address } = useAccount()
  const config = useConfig()
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
