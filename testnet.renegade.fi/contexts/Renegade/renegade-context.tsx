"use client"

import * as React from "react"
import { useToast } from "@chakra-ui/react"
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
  Token,
} from "@renegade-fi/renegade-js"
import { useAccount } from "wagmi"

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
  const { address } = useAccount()
  // Create balance, order, fee, an account states.
  const [balances, setBalances] = React.useState<Record<BalanceId, Balance>>({})
  const [orders, setOrders] = React.useState<Record<OrderId, Order>>({})
  const [fees, setFees] = React.useState<Record<FeeId, Fee>>({})
  const [accountId, setAccountId] = React.useState<AccountId>()

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

  // TODO: Does not include existing peers
  // Stream network, order book, and MPC events.
  const networkCallbackId = React.useRef<CallbackId>()
  React.useEffect(() => {
    if (networkCallbackId.current) return
    const handleNetworkListener = async () => {
      console.log("adding listener")
      await renegade
        .registerNetworkCallback((message: string) => {
          console.log("[Network]", message)
          const networkEvent = JSON.parse(message)
          const networkEventType = networkEvent.type
          const networkEventPeer = networkEvent.peer
          if (networkEventType === "NewPeer") {
            setCounterparties((counterparties) => {
              const newCounterparties = { ...counterparties }
              newCounterparties[networkEventPeer.id] = {
                peerId: networkEventPeer.id,
                clusterId: networkEventPeer.cluster_id,
                multiaddr: networkEventPeer.addr,
              } as Counterparty
              return newCounterparties
            })
          } else if (networkEventType === "PeerExpired") {
            setCounterparties((counterparties) => {
              const newCounterparties = { ...counterparties }
              delete newCounterparties[networkEventPeer.id]
              return newCounterparties
            })
          } else {
            console.error("Unknown network event type:", networkEventType)
          }
        })
        .then((callbackId) => (networkCallbackId.current = callbackId))
    }
    handleNetworkListener()
    return () => {
      if (networkCallbackId.current) {
        renegade.releaseCallback(networkCallbackId.current)
      }
    }
  }, [])

  // Define the setAccount handler. This handler unregisters the previous
  // account ID, registers the new account ID, and starts an initializeAccount
  // task.
  //
  // Once the new initializeAccount task has completed, we register a callback
  // to stream all account events.
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
    const [taskId, taskJob] = await renegade.task.initializeAccount(accountId)
    setTask(taskId, TaskType.InitializeAccount)
    await taskJob.then(() => setTask(undefined, undefined))
    setAccountId(accountId)
    refreshAccount(accountId)
    await renegade.registerAccountCallback(
      () => refreshAccount(accountId),
      accountId,
      -1
    )
  }

  const refreshAccount = (accountId?: AccountId) => {
    if (!accountId) return
    setBalances(renegade.getBalances(accountId))
    setOrders(renegade.getOrders(accountId))
  }

  React.useEffect(() => {
    const handlePreload = async () => {
      const preloaded = localStorage.getItem(`${address}-preloaded`)
      if (preloaded || !accountId || Object.keys(balances).length) {
        return
      }
      localStorage.setItem(`${address}-preloaded`, "true")
      const [depositTaskId, depositTaskJob] = await renegade.task.deposit(
        accountId,
        new Token({ ticker: "WETH" }),
        BigInt(10)
      )
      setTask(depositTaskId, TaskType.Deposit)
      await depositTaskJob
    }
    handlePreload()
  }, [accountId, address, balances])

  // Define the setTask handler. Given a new task ID, this handler starts
  // streaming task updates to the task state.
  async function setTask(newTaskId?: TaskId, taskType?: TaskType) {
    if (newTaskId === "DONE") {
      return
    }
    if (!newTaskId) {
      setTaskId(undefined)
      setTaskType(undefined)
      setTaskState(undefined)
      return
    }
    setTaskId(newTaskId)
    setTaskType(taskType)
    setTaskState(TaskState.Proving)
    await renegade.registerTaskCallback((message: string) => {
      const taskUpdate = JSON.parse(message).state
      setTaskState(taskUpdate.state as TaskState)
    }, newTaskId)
  }

  return (
    <RenegadeContext.Provider
      value={{
        balances,
        orders,
        fees,
        accountId,
        taskId,
        taskType,
        taskState,
        counterparties,
        orderBook,
        setAccount,
        setTask,
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
