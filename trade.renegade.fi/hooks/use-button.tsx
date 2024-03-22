import { useModal as useModalConnectKit } from "connectkit"
import { useMemo } from "react"
import { useAccount as useAccountWagmi } from "wagmi"

import { useRenegade } from "@/contexts/Renegade/renegade-context"

export const useButton = ({
  connectText,
  onOpenSignIn,
  signInText,
}: {
  connectText?: string
  onOpenSignIn: () => void
  signInText?: string
}) => {
  const { accountId } = useRenegade()
  const { address } = useAccountWagmi()
  const { setOpen } = useModalConnectKit()

  const { buttonText, buttonOnClick, cursor } = useMemo(() => {
    if (!address) {
      return {
        buttonText: connectText || "Connect Wallet",
        buttonOnClick: () => setOpen(true),
        cursor: "pointer",
      }
    } else if (!accountId) {
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
        buttonOnClick: () => {},
        cursor: "pointer",
      }
    }
  }, [accountId, address, connectText, onOpenSignIn, setOpen, signInText])

  const shouldUse = buttonText

  return { buttonText, buttonOnClick, cursor, shouldUse }
}
