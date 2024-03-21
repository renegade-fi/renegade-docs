"use client"

import React, { createRef, useEffect, useState } from "react"
import Image from "next/image"
import { useApp } from "@/contexts/App/app-context"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import glyphDark from "@/icons/glyph_dark.svg"
import {
  useErc20Allowance,
  useErc20Approve,
  usePrepareErc20Approve,
  usePrepareErc20Write,
  usePrepareWethDeposit,
  useWethBalanceOf,
  useWethDeposit,
} from "@/src/generated"
import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { Keychain } from "@renegade-fi/renegade-js"
import { ConnectKitButton } from "connectkit"
import {
  useAccount as useAccountWagmi,
  useDisconnect as useDisconnectWagmi,
  useEnsName as useEnsNameWagmi,
} from "wagmi"

import { useButton } from "@/hooks/use-button"
import { CreateStepper } from "@/components/steppers/create-stepper/create-stepper"
import { renegade } from "@/app/providers"

function FancyUnderline(props: { children: React.ReactElement }) {
  const [isHovering, setIsHovering] = React.useState(false)
  const [isCompleted, setIsCompleted] = React.useState(false)
  const [delay, setDelay] = React.useState<NodeJS.Timeout | null>(null)
  return (
    <Box
      position="relative"
      onMouseEnter={() => {
        setIsHovering(true)
        setIsCompleted(false)
        if (delay) clearTimeout(delay)
        setDelay(setTimeout(() => setIsCompleted(true), 250))
      }}
      onMouseLeave={() => {
        setIsHovering(false)
        if (delay) clearTimeout(delay)
        setDelay(setTimeout(() => setIsCompleted(false), 250))
      }}
    >
      {React.cloneElement(props.children, {
        textDecoration: "none",
        _hover: {
          textDecoration: "none",
        },
      })}
      <Box
        position="absolute"
        bottom="2px"
        left="0"
        width="100%"
        height="1.5px"
        opacity={isCompleted ? "0" : "1"}
        transform={isHovering ? "scaleX(1)" : "scaleX(0)"}
        transformOrigin="left"
        transition="transform 0.25s"
        backgroundColor={props.children.props.color || "white.80"}
      />
      <Box
        position="absolute"
        right="0"
        bottom="2px"
        width="100%"
        height="1.5px"
        opacity={isCompleted ? "1" : "0"}
        transform={isHovering ? "scaleX(1)" : "scaleX(0)"}
        transformOrigin="right"
        transition="transform 0.25s"
        backgroundColor={props.children.props.color || "white.80"}
      />
    </Box>
  )
}

interface GlyphProps {
  glyphRef: React.RefObject<HTMLDivElement>
  showDownloadPrompt: boolean
}
function Glyph(props: GlyphProps) {
  return (
    <Flex
      alignItems="center"
      gap="20px"
      width="30%"
      marginLeft="1.2%"
      userSelect="none"
    >
      <Box ref={props.glyphRef}>
        <Image alt="Renegade Logo" height="38" src={glyphDark} />
      </Box>
      <Link
        color="white.90"
        fontWeight="300"
        opacity={props.showDownloadPrompt ? 1 : 0}
        transform={
          props.showDownloadPrompt ? "translateX(0px)" : "translateX(-10px)"
        }
        pointerEvents={props.showDownloadPrompt ? undefined : "none"}
        transition="0.2s"
        href="https://renegade.fi/logos.zip"
        isExternal
      >
        Download Logo Pack
      </Link>
    </Flex>
  )
}

/**
 * The initial "Connect Wallet" button. Only visible if the user has not
 * connected their wallet.
 */
export function ConnectWalletButton() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show }) => {
        if (isConnected) {
          return null
        }
        return (
          <Button onClick={show} variant="wallet-connect">
            Connect Wallet
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}

/**
 * The "Sign In with..." button. Only visible if the user has connected their
 * wallet, but we have not re-derived the key hierarchy.
 */
export function SignInButton() {
  const { address } = useAccountWagmi()
  const { isSigningIn } = useApp()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data } = useEnsNameWagmi({ address })
  const { accountId } = useRenegade()
  const signInText = data
    ? `Sign in with ${data}`
    : `Sign in with 0x${address?.slice(2, 6)}`
  const { buttonOnClick, buttonText } = useButton({
    connectText: "Connect Wallet",
    onOpenSignIn: onOpen,
    signInText,
  })
  if (!address || accountId) {
    return null
  }

  return (
    <>
      <Button
        cursor={isSigningIn ? "default" : "pointer"}
        isLoading={isSigningIn}
        loadingText="Signing in"
        onClick={isSigningIn ? () => {} : buttonOnClick}
        variant="wallet-connect"
      >
        {buttonText}
      </Button>
      {isOpen && <CreateStepper onClose={onClose} />}
    </>
  )
}

/**
 * The "Disconnect..." button. Only visible if the user has
 * connected their wallet and we have populated the key hierarchy.
 */
function DisconnectWalletButton() {
  const { disconnect } = useDisconnectWagmi()
  const { address } = useAccountWagmi()
  const { data } = useEnsNameWagmi({ address })
  const { accountId, setAccount } = useRenegade()
  if (!address || !accountId) {
    return null
  }

  let buttonContent: React.ReactElement
  if (data) {
    buttonContent = (
      <HStack spacing="4px">
        <Text>Disconnect</Text>
        <Text>{data}</Text>
      </HStack>
    )
  } else {
    buttonContent = (
      <HStack spacing="0px">
        <Text>Disconnect 0x</Text>
        <Text>{address ? address.slice(2, 6) : "????"}</Text>
      </HStack>
    )
  }

  return (
    <Button
      background="white.10"
      onClick={() => {
        setAccount(accountId, undefined)
        disconnect()
      }}
      variant="wallet-connect"
    >
      {buttonContent}
    </Button>
  )
}

export function MainNav() {
  const [showDownloadPrompt, setshowDownloadPrompt] = useState(false)
  const glyphRef = createRef<HTMLDivElement>()
  const { data: wethAllowance } = useErc20Allowance({
    address: "0x408Da76E87511429485C32E4Ad647DD14823Fdc4",
    args: [
      "0x3f1eae7d46d88f08fc2f8ed27fcb2ab183eb2d0e",
      "0xd92773693917f0ff664f85c3cb698c33420947ff",
    ],
  })
  console.log("🚀 ~ MainNav ~ wethAllowance:", wethAllowance)

  const { data: wethBalance } = useWethBalanceOf({
    address: "0x408Da76E87511429485C32E4Ad647DD14823Fdc4",
    args: ["0x3f1eae7d46d88f08fc2f8ed27fcb2ab183eb2d0e"],
  })
  console.log("🚀 ~ MainNav ~ wethBalance:", wethBalance)

  const { config: approveConfig } = usePrepareErc20Approve({
    address: "0x408Da76E87511429485C32E4Ad647DD14823Fdc4",
    args: ["0xd92773693917f0ff664f85c3cb698c33420947ff", BigInt(10)],
  })
  const {
    data,
    isLoading,
    isSuccess,
    write: approveWeth,
  } = useErc20Approve(approveConfig)

  // const { config } = usePrepareWethDeposit({
  //   address: "0x408Da76E87511429485C32E4Ad647DD14823Fdc4",
  // })
  // const { data: wethDepositData, write: depositWeth } = useWethDeposit(config)

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (glyphRef.current?.contains(e.target as Node)) {
        e.preventDefault()
        setshowDownloadPrompt(true)
      }
    }
    window.addEventListener("contextmenu", handleContextMenu)
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu)
    }
  }, [glyphRef])

  const handleClick = async () => {
    if (!approveWeth) {
      console.log("No write")
      return
    }
    approveWeth()
    console.log("🚀 ~ MainNav ~ data:", data)
    // if (!depositWeth) {
    //   console.log("No deposit")
    //   return
    // }
    // depositWeth()
    // console.log("🚀 ~ MainNav ~ wethDepositData:", wethDepositData)
  }

  return (
    <Flex
      alignItems="center"
      width="100%"
      height="calc(2 * var(--banner-height))"
      borderBottom="var(--border)"
      onClick={() => setshowDownloadPrompt(false)}
    >
      <Glyph glyphRef={glyphRef} showDownloadPrompt={showDownloadPrompt} />
      <Spacer />
      <HStack
        color="white.80"
        fontSize="1.1em"
        fontWeight="300"
        textDecoration="none"
        onClick={(event) => event.stopPropagation()}
        spacing="20px"
      >
        <Button onClick={handleClick}>Allow</Button>
        <FancyUnderline>
          <Link
            color="white.100"
            fontWeight="400"
            href="https://twitter.com/renegade_fi"
            isExternal
          >
            Twitter
          </Link>
        </FancyUnderline>
        <FancyUnderline>
          <Link href="https://discord.gg/renegade-fi" isExternal>
            Discord
          </Link>
        </FancyUnderline>
        <FancyUnderline>
          <Link href="https://docs.renegade.fi" isExternal>
            Docs
          </Link>
        </FancyUnderline>
        <FancyUnderline>
          <Link href="https://whitepaper.renegade.fi" isExternal>
            Whitepaper
          </Link>
        </FancyUnderline>
      </HStack>
      <Spacer />
      <Flex justifyContent="right" width="30%" paddingRight="1.5%">
        <Box onClick={(event) => event.stopPropagation()}>
          <ConnectWalletButton />
          <SignInButton />
          <DisconnectWalletButton />
        </Box>
      </Flex>
    </Flex>
  )
}
