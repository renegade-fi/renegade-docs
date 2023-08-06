"use client"

import React from "react"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { View } from "@/contexts/Renegade/types"

import DepositBody from "./deposit-body"
import TradingBody from "./trading-body"

const MainViews: { [key in View]: () => React.JSX.Element } = {
  [View.DEPOSIT]: DepositBody,
  [View.TRADING]: TradingBody,
}
export default function Main() {
  const { view } = useRenegade()
  const CurrentView = MainViews[view]
  return <CurrentView />
}
