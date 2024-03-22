"use client"

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import { useRenegade } from "@/contexts/Renegade/renegade-context"

export enum ViewEnum {
  TRADING,
  DEPOSIT,
}

export interface AppContextValue {
  isOnboarding: boolean
  isSigningIn: boolean
  setIsOnboarding: (isOnboarding: boolean) => void
  setIsSigningIn: (isSigningIn: boolean) => void
  setView: (view: ViewEnum) => void
  tokenIcons: Record<string, string>
  view: ViewEnum
}

const AppStateContext = createContext<AppContextValue | undefined>(undefined)

function AppProvider({
  children,
  tokenIcons,
}: PropsWithChildren & { tokenIcons?: Record<string, string> }) {
  const { accountId } = useRenegade()
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false)
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false)
  const [view, setView] = useState<ViewEnum>(ViewEnum.TRADING)

  useEffect(() => {
    let timeout = setTimeout(() => {
      if (accountId) {
        setIsSigningIn(false)
      }
    }, 3000)
    return () => clearTimeout(timeout)
  }, [accountId])

  return (
    <AppStateContext.Provider
      value={{
        isOnboarding,
        isSigningIn,
        setIsOnboarding,
        setIsSigningIn,
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
