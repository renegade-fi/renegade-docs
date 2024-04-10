"use client"

import { DepositBody } from "@/app/(desktop)/[base]/[quote]/deposit"
import { TradingBody } from "@/app/(desktop)/[base]/[quote]/trading"
import { ViewEnum, useApp } from "@/contexts/App/app-context"

export function Main() {
  const { view } = useApp()
  const CurrentView = {
    [ViewEnum.TRADING]: TradingBody,
    [ViewEnum.DEPOSIT]: DepositBody,
  }[view]

  return (
    <>
      <CurrentView />
    </>
  )
}
