"use client"

import { TradingBody } from "./trading"
import { ViewEnum, useApp } from "@/contexts/App/app-context"
import dynamic from "next/dynamic"

const Deposit = dynamic(() => import("./deposit"), { ssr: false })
const Withdraw = dynamic(() => import("./withdraw"), { ssr: false })

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
