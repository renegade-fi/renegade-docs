"use client"

import { PropsWithChildren, createContext, useContext, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Token } from "@renegade-fi/renegade-js"

import { getToken } from "@/lib/utils"

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
  const params = useParams()
  const router = useRouter()
  const base = params.base?.toString()
  const baseToken = getToken({ input: base })
  const handleSetBaseToken = (token: string) => {
    router.push(`/${token}`)
  }
  const [baseTokenAmount, setBaseTokenAmount] = useState("")

  const handleSetBaseTokenAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(parseFloat(value)) && isFinite(parseFloat(value)) && parseFloat(value) >= 0)) {
      setBaseTokenAmount(value);
    }
  };

  return (
    <DepositStateContext.Provider
      value={{
        base: baseToken,
        baseTicker: Token.findTickerByAddress(`0x${baseToken.address}`),
        baseTokenAmount,
        setBaseTicker: handleSetBaseToken,
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