"use client"

import { TradingBody } from "./trading"
import { DepositBody } from "@/app/(desktop)/deposit"
import { WithdrawBody } from "@/app/(desktop)/withdraw"
import { ViewEnum, useApp } from "@/contexts/App/app-context"

export function Main() {
  const { view } = useApp()
  return (
    <>
      {view === ViewEnum.TRADING && <TradingBody />}
      {view === ViewEnum.DEPOSIT && <DepositBody />}
      {view === ViewEnum.WITHDRAW && <WithdrawBody />}
    </>
  )
}
