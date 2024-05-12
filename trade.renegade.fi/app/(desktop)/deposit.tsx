"use client"

import DepositButton from "@/app/(desktop)/deposit-button"
import { ViewEnum, useApp } from "@/contexts/App/app-context"
import { useReadErc20BalanceOf } from "@/generated"
import { ChevronDownIcon, ChevronLeftIcon } from "@chakra-ui/icons"
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { Token } from "@renegade-fi/react"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useLocalStorage } from "usehooks-ts"
import { formatUnits } from "viem"
import { useAccount, useBlockNumber } from "wagmi"

import { TokenSelectModal } from "@/components/modals/token-select-modal"

export function DepositBody() {
  const { setView } = useApp()
  const {
    isOpen: tokenMenuIsOpen,
    onOpen: onOpenTokenMenu,
    onClose: onCloseTokenMenu,
  } = useDisclosure()
  const [baseTokenAmount, setBaseTokenAmount] = useState("")
  const [base] = useLocalStorage("base", "WETH", {
    initializeWithValue: false,
  })

  const handleSetBaseTokenAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (
      value === "" ||
      (!isNaN(parseFloat(value)) &&
        isFinite(parseFloat(value)) &&
        parseFloat(value) > 0)
    ) {
      setBaseTokenAmount(value)
    }
  }
  const { address } = useAccount()
  const token = Token.findByTicker(base)
  // Get L1 ERC20 balance
  const { data: l1Balance, queryKey: l1BalanceQueryKey } =
    useReadErc20BalanceOf({
      address: token.address,
      args: [address ?? "0x"],
    })
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({ watch: true })
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: l1BalanceQueryKey })
  }, [l1BalanceQueryKey, queryClient, blockNumber])

  const max = l1Balance ? formatUnits(l1Balance, token.decimals) : ""
  const handleSetMax = () => {
    if (max) {
      setBaseTokenAmount(max)
    }
  }

  const hideMaxButton = !max || baseTokenAmount === max

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
                Deposit
              </Text>
            </div>
            <InputGroup>
              <Input
                width="200px"
                paddingRight="3rem"
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
                  e.target.addEventListener(
                    "wheel",
                    (e) => e.preventDefault(),
                    {
                      passive: false,
                    }
                  )
                }
                placeholder="0.00"
                type="number"
                value={baseTokenAmount}
              />
              {!hideMaxButton && (
                <InputRightElement width="3.5rem">
                  <Button
                    color="white.60"
                    fontFamily="Favorit"
                    fontWeight="400"
                    onClick={handleSetMax}
                    size="xs"
                    variant="ghost"
                  >
                    Max
                  </Button>
                </InputRightElement>
              )}
            </InputGroup>
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
        <DepositButton
          baseTokenAmount={baseTokenAmount}
          setBaseTokenAmount={setBaseTokenAmount}
        />
      </Flex>
      <TokenSelectModal isOpen={tokenMenuIsOpen} onClose={onCloseTokenMenu} />
    </>
  )
}
