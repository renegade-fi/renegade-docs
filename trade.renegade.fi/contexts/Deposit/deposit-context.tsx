"use client"

import { PropsWithChildren, createContext, useContext, useState } from "react"
import { useParams, useRouter } from "next/navigation"

export interface DepositContextValue {
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
  const baseTicker = params.base?.toString()
  const handleSetBaseToken = (token: string) => {
    router.push(`/${token}`)
  }
  const [baseTokenAmount, setBaseTokenAmount] = useState(0)

  return (
    <DepositStateContext.Provider
      value={{
        baseTicker,
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
