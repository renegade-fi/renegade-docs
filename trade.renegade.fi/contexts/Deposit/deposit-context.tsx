"use client"

import { Token } from "@renegade-fi/renegade-js"
import { useParams, useRouter } from "next/navigation"
import { PropsWithChildren, createContext, useContext, useState } from "react"

import { getToken } from "@/lib/utils"

export interface DepositContextValue {
  base: Token
  baseTicker: string
  baseTokenAmount: number
  setBaseTicker: (ticker: string) => void
  setBaseTokenAmount: (amount: number) => void
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
  const [baseTokenAmount, setBaseTokenAmount] = useState(0)

  return (
    <DepositStateContext.Provider
      value={{
        base: baseToken,
        baseTicker: Token.findTickerByAddress(`0x${baseToken.address}`),
        baseTokenAmount,
        setBaseTicker: handleSetBaseToken,
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
