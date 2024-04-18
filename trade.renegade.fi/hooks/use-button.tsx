import { useModal as useModalConnectKit } from "connectkit"
import { useMemo } from "react"
import { useAccount as useAccountWagmi } from "wagmi"

import { useStatus } from "@sehyunchung/renegade-react"

export const useButton = ({
  connectText,
  onOpenSignIn,
  signInText,
}: {
  connectText?: string
  onOpenSignIn: () => void
  signInText?: string
}) => {
  const status = useStatus()
  const { address } = useAccountWagmi()
  const { setOpen } = useModalConnectKit()

  const { buttonText, buttonOnClick, cursor } = useMemo(() => {
    if (!address) {
      return {
        buttonText: connectText || "Connect Wallet",
        buttonOnClick: () => setOpen(true),
        cursor: "pointer",
      }
    } else if (status !== "in relayer") {
      return {
        buttonText: signInText || "Sign in",
        buttonOnClick: onOpenSignIn,
        cursor: "pointer",
      }
    }
    // else if (isLocked) {
    //   return {
    //     buttonText: "Please wait for task completion",
    //     buttonOnClick: () => {},
    //     cursor: "default",
    //   }
    // }
    else {
      return {
        buttonText: "",
        buttonOnClick: () => { },
        cursor: "pointer",
      }
    }
  }, [address, connectText, onOpenSignIn, setOpen, signInText, status])

  const shouldUse = buttonText

  return { buttonText, buttonOnClick, cursor, shouldUse }
}
