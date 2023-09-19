"use client"

import { PropsWithChildren, createContext, useContext, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { TaskType } from "@/contexts/Renegade/types"
import { Token } from "@renegade-fi/renegade-js"

import { renegade } from "@/app/providers"

export interface DepositContextValue {
  baseTicker: string
  baseTokenAmount: number
  onDeposit: () => Promise<void>
  setBaseTicker: (ticker: string) => void
  setBaseTokenAmount: (amount: number) => void
}

const DepositStateContext = createContext<DepositContextValue | undefined>(
  undefined
)

function DepositProvider({ children }: PropsWithChildren) {
  const params = useParams()
  const { accountId, clientWithSentry } = useRenegade()
  const router = useRouter()
  const baseTicker = params.base?.toString()
  const handleSetBaseToken = (token: string) => {
    router.push(`/${token}/${quoteTicker}`)
  }
  const quoteTicker = params.quote?.toString()
  const [baseTokenAmount, setBaseTokenAmount] = useState(0)

  async function handleDeposit() {
    return clientWithSentry(
      TaskType.Deposit,
      renegade.task.deposit,
      accountId,
      new Token({ ticker: baseTicker }),
      BigInt(baseTokenAmount)
    )
  }

  return (
    <DepositStateContext.Provider
      value={{
        baseTicker,
        baseTokenAmount,
        onDeposit: handleDeposit,
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
