"use client"

import { useEffect } from "react"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { ViewEnum } from "@/contexts/Renegade/types"
import { useDisclosure } from "@chakra-ui/react"
import { useAccount } from "wagmi"

import { safeLocalStorageGetItem } from "@/lib/utils"
import { TestnetStepper } from "@/components/steppers/testnet-stepper/testnet-stepper"
import { DepositBody } from "@/app/[base]/[quote]/deposit"
import { TradingBody } from "@/app/[base]/[quote]/trading"

export function Main() {
  const { address } = useAccount()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { accountId, balances, view } = useRenegade()
  const CurrentView = {
    [ViewEnum.TRADING]: TradingBody,
    [ViewEnum.DEPOSIT]: DepositBody,
  }[view]

  useEffect(() => {
    const preloaded = safeLocalStorageGetItem(`${address}-preloaded`)
    if (address && !preloaded && accountId) {
      onOpen()
    }
  }, [accountId, address, balances, onOpen])

  return (
    <>
      <CurrentView />
      {isOpen && <TestnetStepper onClose={onClose} />}
    </>
  )
}
