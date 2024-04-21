"use client"

import { Token } from "@sehyunchung/renegade-react"
import { PropsWithChildren, createContext, useContext, useState } from "react"
import { useLocalStorage } from "usehooks-ts"

export interface DepositContextValue {
  base: Token
  baseTicker: string
  baseTokenAmount: string
  setBaseTicker: (ticker: string) => void
  setBaseTokenAmount: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const DepositStateContext = createContext<DepositContextValue | undefined>(
  undefined
)

function DepositProvider({ children }: PropsWithChildren) {
  const [base, setBase] = useLocalStorage(
    "base",
    Token.findByTicker("WETH").ticker
  )
  const [baseTokenAmount, setBaseTokenAmount] = useState("")

  const handleSetBaseTokenAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (
      value === "" ||
      (!isNaN(parseFloat(value)) &&
        isFinite(parseFloat(value)) &&
        parseFloat(value) >= 0)
    ) {
      setBaseTokenAmount(value)
    }
  }

  return (
    <DepositStateContext.Provider
      value={{
        base: Token.findByTicker(base),
        baseTicker: base,
        baseTokenAmount,
        setBaseTicker: setBase,
        setBaseTokenAmount: handleSetBaseTokenAmount,
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
