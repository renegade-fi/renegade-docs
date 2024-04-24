"use client"

import WithdrawButton from "@/app/(desktop)/withdraw-button"
import { ViewEnum, useApp } from "@/contexts/App/app-context"
import { ChevronDownIcon, ChevronLeftIcon } from "@chakra-ui/icons"
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { useState } from "react"
import { useLocalStorage } from "usehooks-ts"

import { TokenSelectModal } from "@/components/modals/trading-token-select-modal"

export function WithdrawBody() {
  const { setView } = useApp()
  const {
    isOpen: tokenMenuIsOpen,
    onOpen: onOpenTokenMenu,
    onClose: onCloseTokenMenu,
  } = useDisclosure()
  const [base] = useLocalStorage("base", "WBTC", {
    initializeWithValue: false,
  })
  const [baseTokenAmount, setBaseTokenAmount] = useState("")

  const handleSetBaseTokenAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (
      value === "" ||
      (!isNaN(parseFloat(value)) &&
        isFinite(parseFloat(value)) &&
        parseFloat(value) >= 0)
    ) {
      setBaseTokenAmount(value)
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
                fontWeight="600"
                onClick={() => setView(ViewEnum.TRADING)}
                variant="link"
              >
                <ChevronLeftIcon />
                Back to Trading
              </Button>
              <Text color="white.50" fontSize="34px">
                Withdraw
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
              onChange={handleSetBaseTokenAmount}
              onFocus={(e) =>
                e.target.addEventListener("wheel", (e) => e.preventDefault(), {
                  passive: false,
                })
              }
              placeholder="0.00"
              type="number"
              value={baseTokenAmount}
            />
            <HStack
              userSelect="none"
              cursor="pointer"
              onClick={onOpenTokenMenu}
            >
              <Text variant="trading-body-button">{base}</Text>
              <ChevronDownIcon
                boxSize="20px"
                viewBox="6 6 12 12"
                color="white.100"
              />
            </HStack>
          </HStack>
        </Box>
        <WithdrawButton baseTicker={base} baseTokenAmount={baseTokenAmount} />
      </Flex>
      <TokenSelectModal isOpen={tokenMenuIsOpen} onClose={onCloseTokenMenu} />
    </>
  )
}
