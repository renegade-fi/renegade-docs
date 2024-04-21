import { useConfig, waitForTaskCompletion } from "@sehyunchung/renegade-react"
import { useRef } from "react"
import { toast } from "sonner"

const useTaskCompletionToast = () => {
  const config = useConfig()
  const taskNameRef = useRef<string>()

  const executeTaskWithToast = async (taskId: string, initialText: string) => {
    const toastId = toast.loading(initialText)

    try {
      await waitForTaskCompletion(config, { id: taskId }, (t) => {
        if (t && !taskNameRef.current) taskNameRef.current = t.description
        toast.loading(`${t.description} task: ${t.state}`, {
          id: toastId,
        })
      })

      toast.success(`${taskNameRef.current} successful`, {
        id: toastId,
      })
    } catch (error) {
      toast.error(`${taskNameRef.current} failed`, {
        id: toastId,
      })
    }
  }

  return { executeTaskWithToast }
}

export default useTaskCompletionToast
