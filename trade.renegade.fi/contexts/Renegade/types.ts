import {
  AccountId,
  Balance,
  BalanceId,
  Keychain,
  Order,
  OrderId,
  TaskId,
} from "@renegade-fi/renegade-js"

export interface Counterparty {
  clusterId: string
  multiaddr: string
  peerId: string
}

export interface CounterpartyOrder {
  clusterId: string
  handshakeState: "not-matching" | "in-progress" | "completed"
  isLocal: boolean
  orderId: OrderId
  publicShareNullifier: bigint[]
  state: string
  timestamp: bigint
}

export type PeerId = string

export interface RenegadeContextType {
  accountId: AccountId | undefined
  balances: Record<BalanceId, Balance>
  counterparties: Record<PeerId, Counterparty>
  orderBook: Record<OrderId, CounterpartyOrder>
  orders: Record<OrderId, Order>
  pkRoot: bigint[]
  refreshAccount: (accountId?: AccountId) => void
  setAccount: (oldAccountId?: AccountId, keychain?: Keychain) => Promise<void>
  setTask: (newTaskId?: TaskId, taskType?: TaskType) => void
  taskId: TaskId | undefined
  taskState: TaskState | undefined
  taskType: TaskType | undefined
}

export enum TaskState {
  "Completed" = "Completed",
  "Finding Opening" = "Finding Opening",
  Proving = "Proving",
  "Submitting Tx" = "Submitting Tx",
  "Updating Validity Proofs" = "Updating Validity Proofs",
}

export enum TaskType {
  ApproveFee = "ApproveFee",
  CancelOrder = "CancelOrder",
  Deposit = "Deposit",
  InitializeAccount = "InitializeAccount",
  ModifyFee = "ModifyFee",
  ModifyOrder = "ModifyOrder",
  PlaceOrder = "PlaceOrder",
  RevokeFee = "RevokeFee",
  Withdrawal = "Withdrawal",
}
