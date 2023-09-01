"use client"

import * as React from "react"
import {
  AccountId,
  Balance,
  BalanceId,
  CallbackId,
  Fee,
  FeeId,
  Keychain,
  Order,
  OrderId,
  TaskId,
} from "@renegade-fi/renegade-js"

import { renegade } from "@/app/providers"

import {
  Counterparty,
  CounterpartyOrder,
  PeerId,
  RenegadeContextType,
  TaskState,
  TaskType,
} from "./types"

type RenegadeProviderProps = { children: React.ReactNode }

const RenegadeContext = React.createContext<RenegadeContextType | undefined>(
  undefined
)

function RenegadeProvider({ children }: RenegadeProviderProps) {
  // Create balance, order, fee, an account states.
  const [accountId, setAccountId] = React.useState<AccountId>()
  const [balances, setBalances] = React.useState<Record<BalanceId, Balance>>({})
  const [fees, setFees] = React.useState<Record<FeeId, Fee>>({})
  const [orders, setOrders] = React.useState<Record<OrderId, Order>>({})

  // Create task states.
  const [taskId, setTaskId] = React.useState<TaskId>()
  const [taskType, setTaskType] = React.useState<TaskType>()
  const [taskState, setTaskState] = React.useState<TaskState>()

  // Create network (counterparties) and order book states.
  const [counterparties, setCounterparties] = React.useState<
    Record<PeerId, Counterparty>
  >({})
  const [orderBook, setOrderBook] = React.useState<
    Record<OrderId, CounterpartyOrder>
  >({})

  const taskCallbackId = React.useRef<CallbackId>()
  React.useEffect(() => {
    if (taskCallbackId.current || !taskId) return
    const handleTaskListener = async () => {
      await renegade
        .registerTaskCallback((message: string) => {
          const taskUpdate = JSON.parse(message).state
          setTaskState(taskUpdate as TaskState)
        }, taskId)
        .then((callbackId) => (taskCallbackId.current = callbackId))
    }
    handleTaskListener()

    return () => {
      // should cleanup when taskId updates
      if (!taskCallbackId.current) return
      renegade.releaseCallback(taskCallbackId.current)
      taskCallbackId.current = undefined
    }
  }, [taskId])

  const accountCallbackId = React.useRef<CallbackId>()
  React.useEffect(() => {
    if (accountCallbackId.current || !accountId) return
    const handleAccountListener = async () => {
      await renegade
        .registerAccountCallback(() => {
          refreshAccount(accountId)
        }, accountId)
        .then((callbackId) => (accountCallbackId.current = callbackId))
    }
    handleAccountListener()

    return () => {
      if (!accountCallbackId.current) return
      renegade.releaseCallback(accountCallbackId.current)
      accountCallbackId.current = undefined
    }
  }, [accountId])

  // Define the setAccount handler. This handler unregisters the previous
  // account ID, registers the new account ID, and starts an initializeAccount
  // task.
  async function setAccount(
    oldAccountId?: AccountId,
    keychain?: Keychain
  ): Promise<void> {
    if (oldAccountId) {
      await renegade.unregisterAccount(oldAccountId)
    }
    if (!keychain) {
      setAccountId(undefined)
      return
    }
    // Register and initialize the new account.
    const accountId = renegade.registerAccount(keychain)
    await renegade.task
      .initializeAccount(accountId)
      .then(([taskId]) => setTask(taskId, TaskType.InitializeAccount))
    setAccountId(accountId)
    refreshAccount(accountId)
  }

  const refreshAccount = (accountId?: AccountId) => {
    if (!accountId) return
    setBalances(renegade.getBalances(accountId))
    setOrders(renegade.getOrders(accountId))
  }

  async function setTask(newTaskId: TaskId, taskType: TaskType) {
    if (newTaskId === "DONE") {
      return
    }
    setTaskId(newTaskId)
    setTaskType(taskType)
    setTaskState(TaskState.Proving)
  }

  return (
    <RenegadeContext.Provider
      value={{
        accountId,
        balances,
        counterparties,
        fees,
        orderBook,
        orders,
        setAccount,
        setTask,
        taskId,
        taskState,
        taskType,
      }}
    >
      {children}
    </RenegadeContext.Provider>
  )
}

function useRenegade() {
  const context = React.useContext(RenegadeContext)
  if (context === undefined) {
    throw new Error("useRenegade must be used within a RenegadeProvider")
  }
  return context
}

export { RenegadeContext, RenegadeProvider, useRenegade }
