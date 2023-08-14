import {
  AccountId,
  Balance,
  BalanceId,
  Fee,
  FeeId,
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

export interface PriceReport {
  type: string
  topic: string
  baseToken: { [addr: string]: string }
  quoteToken: { [addr: string]: string }
  exchange: string
  midpointPrice: number
  localTimestamp: number
  reportedTimestamp: number
}

export interface RenegadeContextType {
  balances: Record<BalanceId, Balance>
  orders: Record<OrderId, Order>
  fees: Record<FeeId, Fee>
  accountId: AccountId | undefined
  taskId: TaskId | undefined
  taskType: TaskType | undefined
  taskState: TaskState | undefined
  counterparties: Record<PeerId, Counterparty>
  orderBook: Record<OrderId, CounterpartyOrder>
  setAccount: (oldAccountId?: AccountId, keychain?: Keychain) => Promise<void>
  setTask: (newTaskId?: TaskId, taskType?: TaskType) => Promise<void>
}

export enum TaskState {
  Completed = "Completed",
  FindingOpening = "FindingOpening",
  Proving = "Proving",
  SubmittingTx = "SubmittingTx",
  UpdatingValidityProofs = "UpdatingValidityProofs",
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
