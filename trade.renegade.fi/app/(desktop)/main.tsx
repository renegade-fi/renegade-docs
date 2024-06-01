"use client"

import { TradingBody } from "./trading"
import Deposit from "@/app/(desktop)/deposit"
import Withdraw from "@/app/(desktop)/withdraw"
import { ViewEnum, useApp } from "@/contexts/App/app-context"

export function Main() {
  const { view } = useApp()
  return (
    <>
      {view === ViewEnum.TRADING && <TradingBody />}
      {view === ViewEnum.DEPOSIT && <Deposit />}
      {view === ViewEnum.WITHDRAW && <Withdraw />}
    </>
  )
}
