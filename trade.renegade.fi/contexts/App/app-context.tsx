"use client"

import { PropsWithChildren, createContext, useContext, useState } from "react"

export enum ViewEnum {
  TRADING,
  DEPOSIT,
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
