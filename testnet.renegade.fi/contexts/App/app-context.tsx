"use client"

import { PropsWithChildren, createContext, useContext } from "react"

export interface AppContextValue {
  tokenIcons: Record<string, string>
}

const AppStateContext = createContext<AppContextValue | undefined>(undefined)

function AppProvider({
  children,
  tokenIcons,
}: PropsWithChildren & { tokenIcons: Record<string, string> }) {
  return (
    <AppStateContext.Provider
      value={{
        tokenIcons,
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
