import React from "react"
import {
  RenegadeContextType,
  TaskState,
  TaskType,
} from "@/contexts/Renegade/types"
import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Text,
} from "@chakra-ui/react"

const TASK_TO_LATENCY: { [key in TaskType]?: { [key in TaskState]?: number } } =
  {
    [TaskType.InitializeAccount]: {
      [TaskState.Proving]: 2000,
      [TaskState.FindingMerkleOpening]: 1000,
      [TaskState.SubmittingTx]: 4000,
    },
    [TaskType.Deposit]: {
      [TaskState.Proving]: 12000,
      [TaskState.SubmittingTx]: 4000,
      [TaskState.UpdatingValidityProofs]: 18000,
    },
    [TaskType.Withdrawal]: {
      [TaskState.Proving]: 12000,
      [TaskState.SubmittingTx]: 4000,
      [TaskState.UpdatingValidityProofs]: 18000,
    },
    [TaskType.PlaceOrder]: {
      [TaskState.Proving]: 12000,
      [TaskState.SubmittingTx]: 4000,
      [TaskState.UpdatingValidityProofs]: 18000,
    },
    [TaskType.ModifyOrder]: {
      [TaskState.Proving]: 12000,
      [TaskState.SubmittingTx]: 4000,
      [TaskState.UpdatingValidityProofs]: 18000,
    },
    [TaskType.CancelOrder]: {
      [TaskState.Proving]: 12000,
      [TaskState.SubmittingTx]: 4000,
      [TaskState.UpdatingValidityProofs]: 18000,
    },
  }

interface TaskStatusState {
  taskType?: TaskType
  taskState?: TaskState
  taskStartTime?: number
  currentTime?: number
}
export class TaskStatus extends React.Component<
  Record<string, never>,
  TaskStatusState
> {
  constructor(props: Record<string, never>) {
    super(props)
    this.state = {}
    this.refreshCurrentTime = this.refreshCurrentTime.bind(this)
  }

  componentDidMount() {
    this.refreshCurrentTime()
  }

  componentDidUpdate() {
    const { taskType, taskState } = this.context as RenegadeContextType
    if (
      taskType === this.state.taskType &&
      taskState === this.state.taskState
    ) {
      return
    }
    const currentTime = Date.now()
    this.setState({
      taskType,
      taskState,
      taskStartTime: currentTime,
      currentTime,
    })
  }

  refreshCurrentTime() {
    this.setState({ currentTime: Date.now() })
    setTimeout(this.refreshCurrentTime, 100)
  }

  render() {
    const { orders, taskType, taskState } = this.context as RenegadeContextType
    let progress = 0
    if (
      taskType &&
      taskState &&
      this.state.currentTime &&
      this.state.taskStartTime
    ) {
      progress =
        (100 * (this.state.currentTime - this.state.taskStartTime)) /
        // @ts-ignore
        TASK_TO_LATENCY[taskType][taskState]
      progress = Math.min(Math.ceil(progress), 100)
    }
    if (taskState === TaskState.Completed) {
      progress = 100
    }
    // If we're updating validity proofs, and there are no orders, this operation will completely immediately.
    if (
      taskState === TaskState.UpdatingValidityProofs &&
      Object.keys(orders).length === 0
    ) {
      progress = 100
    }
    const displayedTaskType = {
      [TaskType.InitializeAccount]: "Creating a New Account",
      [TaskType.Deposit]: "Depositing Tokens",
      [TaskType.Withdrawal]: "Withdrawing Tokens",
      [TaskType.PlaceOrder]: "Placing an Order",
      [TaskType.ModifyOrder]: "Modifying an Order",
      [TaskType.CancelOrder]: "Cancelling an Order",
      [TaskType.ApproveFee]: "Approving a Fee",
      [TaskType.ModifyFee]: "Modifying a Fee",
      [TaskType.RevokeFee]: "Revoking a Fee",
    }[taskType || TaskType.InitializeAccount] // If taskType is undefined, we won't use this displayedTaskType anyway.
    const displayedTaskState = {
      [TaskState.Proving]: "Generating ZK Proof",
      [TaskState.SubmittingTx]: "Submitting",
      [TaskState.FindingMerkleOpening]: "Finalizing",
      [TaskState.UpdatingValidityProofs]: "Finalizing",
      [TaskState.Completed]: "Completed",
    }[taskState || TaskState.Proving] // If taskState is undefined, we won't use this displayedTaskState anyway.
    const isDisplayed = taskState && taskState !== TaskState.Completed
    return (
      <Flex
        alignItems="center"
        justifyContent="center"
        flexDirection="row"
        gap="10px"
        margin="0 40px 30px 0"
        opacity={isDisplayed ? 1 : 0}
        transform={isDisplayed ? "translateX(0)" : "translateX(30%)"}
        transition="all 0.25s ease-in-out"
        transitionDelay={isDisplayed ? "0s" : "5s"}
      >
        <CircularProgress
          color="green"
          capIsRound={true}
          isIndeterminate={
            progress === 100 && taskState !== TaskState.Completed
          }
          size="40px"
          thickness="8px"
          trackColor="white.10"
          value={progress}
        >
          <CircularProgressLabel color="white.60" fontSize="0.3em">
            {progress === 100 && taskState !== TaskState.Completed
              ? 99
              : progress}
          </CircularProgressLabel>
        </CircularProgress>
        <Box alignItems="start" justifyContent="center" flexDirection="column">
          <Text fontFamily="Favorit Expanded" fontSize="1.1em">
            {displayedTaskState}
          </Text>
          <Text color="white.60" fontSize="0.9em">
            {displayedTaskType}
          </Text>
        </Box>
      </Flex>
    )
  }
}
