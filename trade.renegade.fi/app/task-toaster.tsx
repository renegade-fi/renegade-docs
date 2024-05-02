import {
  generateCompletionToastMessage,
  generateFailedToastMessage,
  generateStartToastMessage,
} from "@/lib/task"
import { useDisclosure } from "@chakra-ui/react"
import {
  Task,
  TaskType,
  useTaskHistory,
  useTaskHistoryWebSocket,
} from "@renegade-fi/react"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

import { FeeModal } from "@/components/modals/fee-modal"

export function TaskToaster() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const incomingTask = useTaskHistoryWebSocket()
  const taskHistory = useTaskHistory()
  const taskRef = useRef<Map<string, Task>>(new Map())

  // Hydrate initial task history
  useEffect(() => {
    taskHistory.forEach((task) => {
      if (taskRef.current.get(task.id)) return
      taskRef.current.set(task.id, task)
    })
  }, [taskHistory])

  useEffect(() => {
    if (incomingTask) {
      // Ignore duplicate events
      if (taskRef.current.get(incomingTask.id)?.state === incomingTask.state) {
        return
      }
      taskRef.current.set(incomingTask.id, incomingTask)

      // Order toaster handles SettleMatch task completion
      if (incomingTask.task_info.task_type === TaskType.SettleMatch) {
        return
      }

      if (incomingTask.state === "Completed") {
        const message = generateCompletionToastMessage(incomingTask)
        toast.success(message)
        return
      } else if (incomingTask.state === "Failed") {
        const message = generateFailedToastMessage(incomingTask)
        toast.error(message)
      } else if (incomingTask.state === "Proving") {
        const message = generateStartToastMessage(incomingTask)
        toast.message(message)
      } else if (incomingTask.state === "Proving Payment") {
        const message = generateStartToastMessage(incomingTask)
        toast.message(message, {
          action: {
            label: "What's this?",
            onClick: (event) => {
              event.preventDefault()
              onOpen()
            },
          },
        })
      }
    }
  }, [incomingTask, onOpen])

  return <FeeModal isOpen={isOpen} onClose={onClose} />
}