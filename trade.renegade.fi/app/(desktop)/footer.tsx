"use client"

import { renegadeConfig } from "@/app/providers"
import { FAILED_REFRESH_WALLET_MSG, START_REFRESH_WALLET_MSG } from "@/lib/task"
import { Box, Flex, Link, Text } from "@chakra-ui/react"
import { useStatus, useWalletId } from "@renegade-fi/react"
import { refreshWallet } from "@renegade-fi/react/actions"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import logoDark from "@/icons/logo_dark.svg"

export const Footer = () => {
  const logoRef = useRef<HTMLDivElement>(null)
  const [showDownloadPrompt, setShowDownloadPrompt] = useState(false)
  const status = useStatus()
  const walletId = useWalletId()

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (logoRef.current?.contains(e.target as Node)) {
        e.preventDefault()
        setShowDownloadPrompt(true)
      }
    }

    document.addEventListener("contextmenu", handleContextMenu)
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
    }
  }, [])

  const handleRefreshWallet = async () => {
    if (status === "in relayer") {
      await refreshWallet(renegadeConfig)
        .then(() => toast.message(START_REFRESH_WALLET_MSG))
        .catch(() => toast.message(FAILED_REFRESH_WALLET_MSG))
    }
  }

  const network = process.env.NEXT_PUBLIC_RPC_URL.includes("dev")
    ? "DEVNET"
    : "TESTNET"

  return (
    <>
      <Flex
        position="relative"
        alignItems="center"
        width="100%"
        height="120px"
        onClick={() => setShowDownloadPrompt(false)}
        paddingX="40px"
      >
        <Flex alignItems="center" gap="30px">
          <Box ref={logoRef} minWidth="200px">
            <Image alt="" height="30" width="192" priority src={logoDark} />
          </Box>
          <Link
            color="white.90"
            fontSize="1.1em"
            fontWeight="300"
            opacity={showDownloadPrompt ? 1 : 0}
            transform={
              showDownloadPrompt ? "translateX(0px)" : "translateX(-15px)"
            }
            pointerEvents={showDownloadPrompt ? undefined : "none"}
            transition="0.2s"
            href="/logos.zip"
            isExternal
          >
            Download Logo Pack
          </Link>
        </Flex>
        <Text
          position="absolute"
          left="50%"
          color="text.primary"
          fontSize="1.1em"
          fontWeight="300"
          transform="translateX(-50%)"
          onClick={handleRefreshWallet}
        >
          {network}
        </Text>
      </Flex>
      <Text
        position="absolute"
        bottom="0"
        left="0"
        color="white.10"
        fontFamily="Favorit Mono"
        _hover={{ color: "text.primary" }}
        cursor="pointer"
        onClick={() => navigator.clipboard.writeText(walletId ?? "")}
      >
        {walletId}
      </Text>
    </>
  )
}
