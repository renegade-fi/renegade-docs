"use client"

import { PropsWithChildren, createContext, useContext, useState } from "react"

export enum ViewEnum {
  TRADING,
  DEPOSIT,
}

export interface AppContextValue {
  isOnboarding: boolean
  setIsOnboarding: (isOnboarding: boolean) => void
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
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false)
  return (
    <AppStateContext.Provider
      value={{
        isOnboarding,
        setIsOnboarding,
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
