"use client"

import { ViewEnum, useApp } from "@/contexts/App/app-context"
import { Box } from "@chakra-ui/react"

import { TaskStatus } from "@/components/task-status"
import { DepositBody } from "@/app/(desktop)/[base]/[quote]/deposit"
import { TradingBody } from "@/app/(desktop)/[base]/[quote]/trading"

export function Main() {
  const { view } = useApp()
  const CurrentView = {
    [ViewEnum.TRADING]: TradingBody,
    [ViewEnum.DEPOSIT]: DepositBody,
  }[view]

  return (
    <>
      <CurrentView />
      <Box position="absolute" zIndex={1500} right="0" bottom="0">
        <TaskStatus />
      </Box>
    </>
  )
}
