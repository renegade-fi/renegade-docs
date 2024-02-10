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
import { useLocalStorage } from "usehooks-ts"

const RenegadeContext = React.createContext<RenegadeContextType | undefined>(
  undefined
)

function RenegadeProvider({ children }: React.PropsWithChildren) {
  // Create balance, order, fee, an account states.
  const [accountId, setAccountId] = React.useState<AccountId>()
  const [, setBalances] = React.useState<Record<BalanceId, Balance>>({})
  const [fees] = React.useState<Record<FeeId, Fee>>({})
  const [, setOrders] = React.useState<Record<OrderId, Order>>({})
  const [isLocked, setIsLocked] = React.useState<boolean>(false)

  // Create task states.
  const [taskId, setTaskId] = React.useState<TaskId>()
  const [taskType, setTaskType] = React.useState<TaskType>()
  const [taskState, setTaskState] = React.useState<TaskState>()

  // Create network (counterparties) and order book states.
  const [counterparties, setCounterparties] = React.useState<
    Record<PeerId, Counterparty>
  >({})
  const [orderBook] = React.useState<Record<OrderId, CounterpartyOrder>>({})

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

  // TODO: Reset this if fetching fails
  // const [accountId, setAccountId] = useLocalStorage<AccountId | undefined>('accountId', undefined)
  const [seed, setSeed] = useLocalStorage<string | undefined>('seed', undefined)

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

  const isRegistered = React.useRef<boolean>(false)

  const count = React.useRef(0)
  const initAccount = React.useCallback(async () => {
    if (!seed || isRegistered.current || accountId) return
    try {
      isRegistered.current = true
      count.current += 1
      console.log("Count: ", count.current)
      console.log("Initializing account using saved seed: ", seed)
      const keychain = new Keychain({ seed })
      // await renegade.unregisterAccount
      const _accountId = renegade.registerAccount(keychain)
      console.log("Account ID from relayer: ", _accountId)
      console.log("Attempting to initialize account: ", _accountId)
      await renegade.task
        .initializeAccount(_accountId)
        .then(([taskId, taskJob]) => {
          if (taskId !== "DONE") {
            // Account was not registered with Relayer before
            throw new Error("Account was not registered with Relayer before")
          }
          return taskJob
        })
        .then(() => {
          console.log("Job done, setting account ID: ", _accountId)
          setAccountId(_accountId)
          refreshAccount(_accountId)
          isRegistered.current = true
        })
    } catch (error) {
      console.error("Tried to automatically sign in user, but failed with error: ", error)
      setAccountId(undefined)
      setSeed(undefined)
      // renegade.unregisterAccount(_accountId)
    }
  }, [accountId, seed, setAccountId, setSeed])

  // TODO: Not working
  React.useEffect(() => {
    initAccount()
  }, [accountId, initAccount, seed])


  // Define the setAccount handler. This handler unregisters the previous
  // account ID, registers the new account ID, and starts an initializeAccount
  // task.
  async function setAccount(
    oldAccountId?: AccountId,
    keychain?: Keychain
  ): Promise<void> {
    console.log("Manually setting account: ", keychain)
    if (oldAccountId) {
      console.log("Unregistering old account: ", oldAccountId)
      await renegade.unregisterAccount(oldAccountId)
    }
    if (!keychain) {
      setAccountId(undefined)
      return
    }
    // Register and initialize the new account.
    const accountId = renegade.registerAccount(keychain)
    console.log("From SDK: ", accountId)
    await renegade.task
      .initializeAccount(accountId)
      .then(([taskId, taskJob]) => {
        setTask(taskId, TaskType.InitializeAccount)
        return taskJob
      })
      .then(() => {
        isRegistered.current = true
        setAccountId(accountId)
        refreshAccount(accountId)
      })
  }

  // TODO: Does not include existing peers
  // Stream network, order book, and MPC events.
  const networkCallbackId = React.useRef<CallbackId>()
  React.useEffect(() => {
    if (networkCallbackId.current) return
    const handleNetworkListener = async () => {
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
      if (!networkCallbackId.current) return
      renegade.releaseCallback(networkCallbackId.current)
      networkCallbackId.current = undefined
    }
  }, [])

  const refreshAccount = (accountId?: AccountId) => {
    if (!accountId) return
    setBalances(renegade.getBalances(accountId))
    setOrders(renegade.getOrders(accountId))
    setIsLocked(renegade.getIsLocked(accountId))
  }

  function setTask(newTaskId?: TaskId, taskType?: TaskType) {
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
        counterparties,
        fees,
        isLocked,
        orderBook,
        refreshAccount,
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
