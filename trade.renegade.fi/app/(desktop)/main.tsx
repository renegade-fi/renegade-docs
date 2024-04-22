"use client"

import { DepositBody } from "@/app/(desktop)/deposit"
import { TradingBody } from "@/app/(desktop)/trading"
import { WithdrawBody } from "@/app/(desktop)/withdraw"
import { ViewEnum, useApp } from "@/contexts/App/app-context"

export function Main() {
  const { view } = useApp()
  const CurrentView = {
    [ViewEnum.TRADING]: TradingBody,
    [ViewEnum.DEPOSIT]: DepositBody,
    [ViewEnum.WITHDRAW]: WithdrawBody,
  }[view]

  return (
    <>
      <CurrentView />
    </>
  )
}
