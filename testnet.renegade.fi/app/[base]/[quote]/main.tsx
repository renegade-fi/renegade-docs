"use client"

import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { ViewEnum } from "@/contexts/Renegade/types"

import { TestnetStepper } from "@/components/steppers/testnet-stepper/testnet-stepper"
import { DepositBody } from "@/app/[base]/[quote]/deposit"
import { TradingBody } from "@/app/[base]/[quote]/trading"

export function Main() {
  const { view } = useRenegade()
  const CurrentView = {
    [ViewEnum.TRADING]: TradingBody,
    [ViewEnum.DEPOSIT]: DepositBody,
  }[view]

  return (
    <>
      <CurrentView />
      <TestnetStepper />
    </>
  )
}
