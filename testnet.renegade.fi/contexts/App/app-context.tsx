"use client"

import { PropsWithChildren, createContext, useContext, useState } from "react"

export enum ViewEnum {
  TRADING,
  DEPOSIT,
}

export interface AppContextValue {
  tokenIcons: Record<string, string>
  setView: (view: ViewEnum) => void
  view: ViewEnum
}

const AppStateContext = createContext<AppContextValue | undefined>(undefined)

function AppProvider({
  children,
  tokenIcons,
}: PropsWithChildren & { tokenIcons?: Record<string, string> }) {
  const [view, setView] = useState<ViewEnum>(ViewEnum.TRADING)
  return (
    <AppStateContext.Provider
      value={{
        tokenIcons: tokenIcons || {},
        setView,
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
