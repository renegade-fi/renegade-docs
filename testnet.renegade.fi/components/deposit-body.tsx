"use client"

import React, { createRef, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { ChevronDownIcon, ChevronLeftIcon } from "@chakra-ui/icons"
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Input,
  Text,
  keyframes,
  useDisclosure,
} from "@chakra-ui/react"

import { useDeposit } from "../app/deposit/deposit-context"
import { TICKER_TO_LOGO_URL_HANDLE } from "../lib/tokens"
import SignInModal from "./modals/signin-modal"
import DepositStepper from "./steppers/deposit-stepper/deposit-stepper"

interface SingleBaseTokenProps {
  ticker: string
}

interface SelectableProps {
  text: string
  onClick: () => void
  activeModal?: "buy-sell" | "base-token" | "quote-token"
}
const Selectable = React.forwardRef(
  (props: SelectableProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <HStack
        ref={ref}
        userSelect="none"
        cursor="pointer"
        onClick={props.onClick}
      >
        <Text
          variant={
            props.activeModal
              ? "trading-body-button-blurred"
              : "trading-body-button"
          }
        >
          {props.text}
        </Text>
        <ChevronDownIcon boxSize="20px" viewBox="6 6 12 12" color="white.100" />
      </HStack>
    )
  }
)
Selectable.displayName = "selectable"

export default function DepositBody() {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: signInIsOpen,
    onOpen: onOpenSignIn,
    onClose: onCloseSignIn,
  } = useDisclosure()
  const { baseTicker, baseTokenAmount, setBaseTicker, setBaseTokenAmount } =
    useDeposit()
  const { accountId } = useRenegade()
  const [activeModal, setActiveModal] = useState<
    "buy-sell" | "base-token" | "quote-token"
  >()

  const baseTokenSelectableRef = createRef<HTMLDivElement>()

  function SingleBaseToken({ ticker }: SingleBaseTokenProps) {
    const [imageUrl, setImageUrl] = useState("DEFAULT.png")
    useEffect(() => {
      const getLogos = async () => {
        await TICKER_TO_LOGO_URL_HANDLE.then((TICKER_TO_LOGO_URL) =>
          setImageUrl(TICKER_TO_LOGO_URL[ticker])
        )
      }
      getLogos()
    }, [ticker])

    return (
      <HStack
        as={Button}
        margin="5px"
        padding="8px"
        color="border"
        border="var(--border)"
        borderRadius="5px"
        onClick={() => {
          setActiveModal(undefined)
          setBaseTicker(ticker)
        }}
      >
        <Image width="20px" height="20px" alt="Ticker" src={imageUrl} />
        <Text color="white.90" fontSize="0.8em">
          {ticker}
        </Text>
      </HStack>
    )
  }

  function BaseTokenMenu() {
    return (
      <Flex
        position="absolute"
        top="0"
        right="0"
        bottom="0"
        left="0"
        alignItems="center"
        justifyContent="center"
        userSelect="none"
        pointerEvents={activeModal ? "auto" : "none"}
        transition="0.1s"
        backdropFilter={activeModal ? "blur(8px)" : ""}
        onClick={() => setActiveModal(undefined)}
      >
        <Flex
          alignItems="center"
          flexDirection="column"
          maxWidth="25%"
          minHeight="75%"
          padding="25px"
          fontSize="1.5em"
          border="var(--border)"
          borderColor="white.30"
          borderRadius="15px"
          animation={`${popAnimation(1.015)} 0.1s ease both`}
          backgroundColor="white.5"
          hidden={activeModal !== "base-token"}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <Text width="100%" color="white.80" fontSize="0.8em" textAlign="left">
            Select a Token
          </Text>
          <Input
            width="100%"
            margin="15px 10px 0 10px"
            fontFamily="Favorit"
            fontSize="0.8em"
            borderRadius="10px"
            placeholder="Search name or paste ERC-20 address"
            type="text"
          />
          <Flex flexWrap="wrap" margin="15px 0 0 0">
            {["WBTC", "WETH", "UNI", "CRV", "AAVE", "LDO"].map((ticker) => {
              return (
                <Box key={ticker}>
                  <SingleBaseToken ticker={ticker} />
                </Box>
              )
            })}
          </Flex>
        </Flex>
      </Flex>
    )
  }

  const buttonText = !!accountId ? "Preview Deposit" : "Sign in to Deposit"
  const handleClick = () => {
    if (accountId) {
      onOpen()
    } else {
      onOpenSignIn()
    }
  }

  return (
    <>
      <Flex
        position="relative"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        flexGrow="1"
      >
        <Box
          transform={baseTokenAmount ? "translateY(-15px)" : "translateY(10px)"}
          transition="0.15s"
        >
          <HStack fontFamily="Aime" fontSize="1.8em" spacing="20px">
            <div>
              <Button
                position="absolute"
                top="-24px"
                onClick={() => router.push(`/${baseTicker}/USDC`)}
                variant="link"
              >
                <ChevronLeftIcon />
                Back to Trading
              </Button>
              <Text color="white.50" fontSize="34px">
                Let&apos;s get started by depositing{" "}
              </Text>
            </div>
            <Input
              width="200px"
              fontFamily="Favorit"
              fontSize="0.8em"
              borderColor="whiteAlpha.300"
              borderRadius="100px"
              _focus={{
                borderColor: "white.50 !important",
                boxShadow: "none !important",
              }}
              _placeholder={{ color: "whiteAlpha.400" }}
              outline="none !important"
              onChange={(e) => setBaseTokenAmount(parseFloat(e.target.value))}
              onFocus={(e) =>
                e.target.addEventListener("wheel", (e) => e.preventDefault(), {
                  passive: false,
                })
              }
              placeholder="0.00"
              type="number"
              value={baseTokenAmount || ""}
            />
            <Selectable
              text={baseTicker}
              onClick={() => setActiveModal("base-token")}
              activeModal={activeModal}
              ref={baseTokenSelectableRef}
            />
          </HStack>
        </Box>
        <Button
          padding="20px"
          color="white.80"
          fontSize="1.2em"
          fontWeight="200"
          opacity={baseTokenAmount ? 1 : 0}
          borderWidth="thin"
          borderColor="white.40"
          borderRadius="100px"
          _hover={{
            borderColor: "white.60",
            color: "white",
          }}
          _focus={{
            backgroundColor: "transparent",
          }}
          transform={baseTokenAmount ? "translateY(10px)" : "translateY(-10px)"}
          visibility={baseTokenAmount ? "visible" : "hidden"}
          cursor={baseTokenAmount ? "pointer" : "default"}
          transition="0.15s"
          backgroundColor="transparent"
          onClick={handleClick}
        >
          {buttonText}
        </Button>
      </Flex>
      {activeModal === "base-token" && <BaseTokenMenu />}
      {isOpen && <DepositStepper onClose={onClose} />}
      <SignInModal isOpen={signInIsOpen} onClose={onCloseSignIn} />
    </>
  )
}
function popAnimation(maxScale: number) {
  return keyframes`
    0% {
      transform: scale(0.95);
      opacity: 0;
    }
    75% {
      transform: scale(${maxScale});
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  `
}
