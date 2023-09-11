"use client"

import { createContext, useContext, useState } from "react"

type DepositProviderProps = { children: React.ReactNode }

export interface DepositContextValue {
  baseTicker: string
  setBaseTicker: (ticker: string) => void
  baseTokenAmount: number
  setBaseTokenAmount: (amount: number) => void
}

const DepositStateContext = createContext<DepositContextValue | undefined>(
  undefined
)

function DepositProvider({ children }: DepositProviderProps) {
  const [baseTicker, setBaseTicker] = useState("WETH")
  const [baseTokenAmount, setBaseTokenAmount] = useState(0)

  return (
    <DepositStateContext.Provider
      value={{
        baseTicker,
        setBaseTicker: setBaseTicker,
        baseTokenAmount,
        setBaseTokenAmount,
      }}
    >
      {children}
    </DepositStateContext.Provider>
  )
}

function useDeposit() {
  const context = useContext(DepositStateContext)
  if (context === undefined) {
    throw new Error("useDeposit must be used within a DepositProvider")
  }
  return context
}

export { DepositProvider, useDeposit }
