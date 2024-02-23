"use client"

import Link from "next/link"
import { DepositProvider, useDeposit } from "@/contexts/Deposit/deposit-context"
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

import { TokenSelectModal } from "@/components/modals/token-select-modal"
import DepositButton from "@/app/(desktop)/[base]/[quote]/deposit-button"
import { ViewEnum, useApp } from "@/contexts/App/app-context"

function DepositInner() {
  const { setView } = useApp()
  const {
    isOpen: tokenMenuIsOpen,
    onOpen: onOpenTokenMenu,
    onClose: onCloseTokenMenu,
  } = useDisclosure()
  const { baseTicker, baseTokenAmount, setBaseTicker, setBaseTokenAmount } =
    useDeposit()

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
              <Link
                href={`/${baseTicker === "USDC" ? "WETH" : baseTicker}/USDC`}
              >
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
              </Link>
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
            <HStack userSelect="none" onClick={onOpenTokenMenu}>
              <Text variant="trading-body-button">{baseTicker}</Text>
              <ChevronDownIcon
                boxSize="20px"
                viewBox="6 6 12 12"
                color="white.100"
              />
            </HStack>
          </HStack>
        </Box>
        <DepositButton />
      </Flex>
      <TokenSelectModal
        isOpen={tokenMenuIsOpen}
        onClose={onCloseTokenMenu}
        setToken={setBaseTicker}
      />
    </>
  )
}

export function DepositBody() {
  return (
    <DepositProvider>
      <DepositInner />
    </DepositProvider>
  )
}
