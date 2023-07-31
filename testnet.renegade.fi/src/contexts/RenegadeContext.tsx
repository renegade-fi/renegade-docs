import { useToast } from "@chakra-ui/react";
import {
  AccountId,
  Balance,
  BalanceId,
  Fee,
  FeeId,
  Keychain,
  Order,
  OrderId,
  Renegade,
  TaskId,
} from "@renegade-fi/renegade-js";
import React from "react";

export interface PriceReport {
  type: string;
  topic: string;
  baseToken: { [addr: string]: string };
  quoteToken: { [addr: string]: string };
  exchange: string;
  midpointPrice: number;
  localTimestamp: number;
  reportedTimestamp: number;
}

export const DEFAULT_PRICE_REPORT = {
  type: "pricereportmedian",
  topic: "",
  baseToken: { addr: "" },
  quoteToken: { addr: "" },
  exchange: "",
  midpointPrice: 0,
  localTimestamp: 0,
  reportedTimestamp: 0,
};

export enum TaskType {
  InitializeAccount = "InitializeAccount",
  Deposit = "Deposit",
  Withdrawal = "Withdrawal",
  PlaceOrder = "PlaceOrder",
  ModifyOrder = "ModifyOrder",
  CancelOrder = "CancelOrder",
  ApproveFee = "ApproveFee",
  ModifyFee = "ModifyFee",
  RevokeFee = "RevokeFee",
}

export enum TaskState {
  Proving = "Proving",
  SubmittingTx = "SubmittingTx",
  FindingMerkleOpening = "FindingMerkleOpening",
  UpdatingValidityProofs = "UpdatingValidityProofs",
  Completed = "Completed",
}

export interface Counterparty {
  peerId: string;
  clusterId: string;
  multiaddr: string;
}
export interface CounterpartyOrder {
  orderId: OrderId;
  publicShareNullifier: bigint[];
  isLocal: boolean;
  clusterId: string;
  state: string;
  timestamp: bigint;
  handshakeState: "not-matching" | "in-progress" | "completed";
}
type PeerId = string;

export type RenegadeContextType = {
  // Account state.
  balances: Record<BalanceId, Balance>;
  orders: Record<OrderId, Order>;
  fees: Record<FeeId, Fee>;
  accountId?: AccountId;
  // Task state.
  taskId?: TaskId;
  taskType?: TaskType;
  taskState?: TaskState;
  // Cluster state.
  counterparties: Record<PeerId, Counterparty>;
  orderBook: Record<OrderId, CounterpartyOrder>;
  // Setters for account and task state.
  setAccount: (oldAccountId?: AccountId, keychain?: Keychain) => void;
  setTask: (newTaskId: TaskId, newTaskType: TaskType) => void;
  // Account refresh.
  refreshAccount: (accountId: AccountId) => void;
};

const RenegadeContext = React.createContext<RenegadeContextType>({
  balances: {},
  orders: {},
  fees: {},
  counterparties: {},
  orderBook: {},
  setAccount: () => undefined,
  setTask: () => undefined,
  refreshAccount: () => undefined,
});

export function prepareRenegadeContext(
  renegade: Renegade,
): RenegadeContextType {
  // Create balance, order, fee, an account states.
  const [balances, setBalances] = React.useState<Record<BalanceId, Balance>>(
    {},
  );
  const [orders, setOrders] = React.useState<Record<OrderId, Order>>({});
  const [fees, setFees] = React.useState<Record<FeeId, Fee>>({});
  const [accountId, setAccountId] = React.useState<AccountId>();

  // Create task states.
  const [taskId, setTaskId] = React.useState<TaskId>();
  const [taskType, setTaskType] = React.useState<TaskType>();
  const [taskState, setTaskState] = React.useState<TaskState>();

  // Create network (counterparties) and order book states.
  const [counterparties, setCounterparties] = React.useState<
    Record<PeerId, Counterparty>
  >({});
  const [orderBook, setOrderBook] = React.useState<
    Record<OrderId, CounterpartyOrder>
  >({});

  // Stream network, order book, and MPC events.
  renegade.registerNetworkCallback((message: string) => {
    console.log("[Network]", message);
    const networkEvent = JSON.parse(message);
    const networkEventType = networkEvent.type;
    const networkEventPeer = networkEvent.peer;
    if (networkEventType === "NewPeer") {
      setCounterparties((counterparties) => {
        const newCounterparties = { ...counterparties };
        newCounterparties[networkEventPeer.id] = {
          peerId: networkEventPeer.id,
          clusterId: networkEventPeer.cluster_id,
          multiaddr: networkEventPeer.addr,
        } as Counterparty;
        return newCounterparties;
      });
    } else if (networkEventType === "PeerExpired") {
      setCounterparties((counterparties) => {
        const newCounterparties = { ...counterparties };
        delete newCounterparties[networkEventPeer.id];
        return newCounterparties;
      });
    } else {
      console.error("Unknown network event type:", networkEventType);
    }
  });

  renegade.registerOrderBookCallback((message: string) => {
    console.log("[Order Book]", message);
    const orderBookEvent = JSON.parse(message);
    const orderBookEventType = orderBookEvent.type;
    const orderBookEventOrder = orderBookEvent.order;
    if (
      orderBookEventType === "NewOrder" ||
      orderBookEventType === "OrderStateChange"
    ) {
      setOrderBook((orderBook) => {
        const newOrderBook = { ...orderBook };
        newOrderBook[orderBookEventOrder.id] = {
          orderId: orderBookEventOrder.id,
          publicShareNullifier: orderBookEventOrder.public_share_nullifier,
          isLocal: orderBookEventOrder.local,
          clusterId: orderBookEventOrder.cluster,
          state: orderBookEventOrder.state,
          timestamp: orderBookEventOrder.timestamp,
          handshakeState: "not-matching",
        } as CounterpartyOrder;
        return newOrderBook;
      });
    } else {
      console.error("Unknown order book event type:", orderBookEventType);
    }
  });

  const toast = useToast();
  let lastToastTime = 0;
  renegade.registerMpcCallback((message: string) => {
    console.log("[MPC]", message);
    const mpcEvent = JSON.parse(message);
    const mpcEventOrderId = mpcEvent.local_order_id;
    if (Date.now() - lastToastTime < 500) {
      return;
    } else {
      lastToastTime = Date.now();
    }
    const toastId =
      mpcEvent.type === "HandshakeCompleted"
        ? "handshake-completed"
        : "handshake-started";
    if (!toast.isActive(toastId)) {
      toast({
        id: toastId,
        title: `MPC ${
          mpcEvent.type === "HandshakeCompleted" ? "Finished" : "Started"
        }`,
        description: `A handshake with a counterparty has ${
          mpcEvent.type === "HandshakeCompleted" ? "completed" : "begun"
        }.`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }
    if (orderBook[mpcEventOrderId]) {
      const handshakeState =
        mpcEvent.type === "HandshakeCompleted" ? "completed" : "in-progress";
      setOrderBook((orderBook) => {
        const newOrderBook = { ...orderBook };
        newOrderBook[mpcEventOrderId].handshakeState = handshakeState;
        return newOrderBook;
      });
    }
  });

  // Define the setAccount handler. This handler unregisters the previous
  // account ID, registers the new account ID, and starts an initializeAccount
  // task.
  //
  // Once the new initializeAccount task has completed, we register a callback
  // to stream all account events.
  async function setAccount(
    oldAccountId?: AccountId,
    keychain?: Keychain,
  ): Promise<void> {
    if (oldAccountId) {
      await renegade.unregisterAccount(oldAccountId);
    }
    // TODO: Tear down the previously-registered callback ID.
    if (!keychain) {
      setAccountId(undefined);
      return;
    }
    // Register and initialize the new account.
    const accountId = renegade.registerAccount(keychain);
    const [taskId, taskJob] = await renegade.task.initializeAccount(accountId);
    setTask(taskId, TaskType.InitializeAccount);
    await taskJob;
    setAccountId(accountId);
    // After the initialization has completed, query the current balances,
    // orders, and fees, and start streaming.
    const refreshAccount = () => {
      setBalances(renegade.getBalances(accountId));
      setOrders(renegade.getOrders(accountId));
      setFees(renegade.getFees(accountId));
    };
    refreshAccount();
    await renegade.registerAccountCallback(refreshAccount, accountId, -1);
  }

  // Define the setTask handler. Given a new task ID, this handler starts
  // streaming task updates to the task state.
  async function setTask(newTaskId: TaskId, taskType: TaskType) {
    if (newTaskId === "DONE") {
      return;
    }
    setTaskId(newTaskId);
    setTaskType(taskType);
    setTaskState(TaskState.Proving);
    // toast({
    //   title: "New Task State",
    //   description: "Proving",
    //   status: "info",
    //   duration: 5000,
    //   isClosable: true,
    // });
    await renegade.registerTaskCallback((message: string) => {
      const taskUpdate = JSON.parse(message).state;
      setTaskState(taskUpdate.state as TaskState);
      // toast({
      //   title: "New Task State",
      //   description: taskUpdate.state,
      //   status: "info",
      //   duration: 5000,
      //   isClosable: true,
      // });
    }, newTaskId);
  }

  const refreshAccount = (accountId: AccountId) => {
    setBalances(renegade.getBalances(accountId));
    setOrders(renegade.getOrders(accountId));
    setFees(renegade.getFees(accountId));
  };

  return {
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
    refreshAccount,
  };
}

export default RenegadeContext;
