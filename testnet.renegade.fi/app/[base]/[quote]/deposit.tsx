"use client"

import { usePathname, useRouter } from "next/navigation"
import { useDeposit } from "@/contexts/Deposit/deposit-context"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { ViewEnum } from "@/contexts/Renegade/types"
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
import { useModal as useModalConnectKit } from "connectkit"
import { useAccount as useAccountWagmi } from "wagmi"

import { SignInModal } from "@/components/modals/signin-modal"
import { TokenSelectModal } from "@/components/modals/token-select-modal"
import { DepositStepper } from "@/components/steppers/deposit-stepper/deposit-stepper"
import { TaskStatus } from "@/components/task-status"

export function DepositBody() {
  const { address } = useAccountWagmi()
  const {
    isOpen: tokenMenuIsOpen,
    onOpen: onOpenTokenMenu,
    onClose: onCloseTokenMenu,
  } = useDisclosure()
  const {
    isOpen: stepperIsOpen,
    onOpen: onOpenStepper,
    onClose: onCloseStepper,
  } = useDisclosure()
  const {
    isOpen: signInIsOpen,
    onOpen: onOpenSignIn,
    onClose: onCloseSignIn,
  } = useDisclosure()
  const { baseTicker, baseTokenAmount, setBaseTicker, setBaseTokenAmount } =
    useDeposit()
  const { setOpen } = useModalConnectKit()
  const pathname = usePathname()
  const { accountId, setView, taskState, taskType } = useRenegade()
  const router = useRouter()

  const buttonText = !address
    ? "Connect Wallet to Deposit"
    : !accountId
    ? "Sign in to Deposit"
    : "Preview Deposit"
  const handleClick = () => {
    if (!address) {
      setOpen(true)
    } else if (!accountId) {
      onOpenSignIn()
    } else {
      onOpenStepper()
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
                onClick={() => {
                  const replace = `/${
                    baseTicker === "USDC" ? "WETH" : baseTicker
                  }/USDC`
                  if (pathname !== replace) {
                    router.replace(replace)
                  }
                  setView(ViewEnum.TRADING)
                }}
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
            <HStack
              userSelect="none"
              cursor="pointer"
              onClick={onOpenTokenMenu}
            >
              <Text cursor="pointer" variant="trading-body-button">
                {baseTicker}
              </Text>
              <ChevronDownIcon
                boxSize="20px"
                viewBox="6 6 12 12"
                color="white.100"
              />
            </HStack>
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
        <Box position="absolute" right="0" bottom="0">
          {taskState && taskType && <TaskStatus />}
        </Box>
      </Flex>
      {stepperIsOpen && <DepositStepper onClose={onCloseStepper} />}
      <SignInModal isOpen={signInIsOpen} onClose={onCloseSignIn} />
      <TokenSelectModal
        isOpen={tokenMenuIsOpen}
        onClose={onCloseTokenMenu}
        setToken={setBaseTicker}
      />
    </>
  )
}
