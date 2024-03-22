"use client"

import * as React from "react"
import {
  AccountId,
  Balance,
  BalanceId,
  CallbackId,
  Keychain,
  Order,
  OrderId,
  TaskId,
} from "@renegade-fi/renegade-js"
import { toast } from "sonner"
import { useLocalStorage } from "usehooks-ts"
import { useAccount } from "wagmi"

import { safeLocalStorageGetItem, safeLocalStorageSetItem } from "@/lib/utils"
import { renegade } from "@/app/providers"

import {
  Counterparty,
  CounterpartyOrder,
  PeerId,
  RenegadeContextType,
  TaskState,
  TaskType,
} from "./types"

const RenegadeContext = React.createContext<RenegadeContextType | undefined>(
  undefined
)

function RenegadeProvider({ children }: React.PropsWithChildren) {
  // Create balance, order, fee, an account states.
  const [accountId, setAccountId] = React.useState<AccountId>()
  const [balances, setBalances] = React.useState<Record<BalanceId, Balance>>({})
  const [orders, setOrders] = React.useState<Record<OrderId, Order>>({})

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

  // TODO: This logic should probably be moved to SDK
  // TODO: Should only do if wallet is connected
  const [seed, setSeed] = useLocalStorage<string | undefined>("seed", undefined)
  const attemptedAutoSignin = React.useRef<AccountId>()
  const initAccount = React.useCallback(async () => {
    if (!seed || attemptedAutoSignin.current || accountId) return
    try {
      console.log("Initializing account using saved seed: ", seed)
      const keychain = new Keychain({ seed })
      const _accountId = renegade.registerAccount(keychain)
      attemptedAutoSignin.current = _accountId
      // TODO: Will try to automatically create new wallet if relayer restarted
      await renegade.task
        .initializeAccount(_accountId)
        .then(([taskId, taskJob]) => {
          // TODO: Should I attempt to fund in this scenario
          setTask(taskId, TaskType.InitializeAccount)
          return taskJob
        })
        .then(() => {
          setAccountId(_accountId)
          refreshAccount(_accountId)
        })
    } catch (error) {
      console.error(
        "Tried to automatically sign in user, but failed with error: ",
        error
      )
      setAccountId(undefined)
      setSeed(undefined)
      if (attemptedAutoSignin.current) {
        await renegade.unregisterAccount(attemptedAutoSignin.current)
      }
    }
  }, [accountId, seed, setAccountId, setSeed])

  const [shouldAutoLogin] = useLocalStorage<boolean>("shouldAutoLogin", false)
  React.useEffect(() => {
    if (shouldAutoLogin) {
      initAccount()
    }
  }, [initAccount, shouldAutoLogin])

  const { address } = useAccount()
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
      .then(([taskId, taskJob]) => {
        setTask(taskId, TaskType.InitializeAccount)
        return taskJob
      })
      .then(() => {
        attemptedAutoSignin.current = accountId
        setAccountId(accountId)
        refreshAccount(accountId)

        const funded = safeLocalStorageGetItem(`funded_${accountId}`)
        if (funded) return

        // If the account has not been funded, fund it
        fetch(`/api/fund?address=${address}`, {
          method: "GET",
        }).then((response) => {
          if (response.ok) {
            return response.text().then(() => {
              toast.success("Your account has been funded with test funds.", {
                description: "Try depositing some funds to start trading.",
                duration: 10000,
              })
              safeLocalStorageSetItem(`funded_${accountId}`, "true")
              return
            })
          } else {
            toast.error(
              "Funding failed: An unexpected error occurred. Please try again."
            )
          }
        })
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
        balances,
        counterparties,
        orderBook,
        orders,
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
