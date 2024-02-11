import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { env } from "@/env.mjs"
import {
  Button,
  Flex,
  ModalBody,
  ModalFooter,
  Text
} from "@chakra-ui/react"


import { useErc20Approve, usePrepareErc20Approve } from "@/generated"
import { CheckIcon } from "@chakra-ui/icons"
import { Token } from "@renegade-fi/renegade-js"
import { useStepper } from "../testnet-stepper"

const MAX_INT = BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935")

export function ApprovalStep() {
  const { accountId } = useRenegade()
  const { onNext } = useStepper()
  const { config: wethConfig } = usePrepareErc20Approve({
    address: Token.findAddressByTicker("WETH") as `0x${string}`,
    args: [env.NEXT_PUBLIC_DARKPOOL_CONTRACT as `0x${string}`, MAX_INT]
  })
  const { isLoading: wethIsLoading, isSuccess: wethIsSuccess, write: approveWETH } = useErc20Approve(wethConfig)

  const { config: usdcConfig } = usePrepareErc20Approve({
    address: Token.findAddressByTicker("USDC") as `0x${string}`,
    args: [env.NEXT_PUBLIC_DARKPOOL_CONTRACT as `0x${string}`, MAX_INT]
  })
  const { isLoading: usdcIsLoading, isSuccess: usdcIsSuccess, write: approveUSDC } = useErc20Approve(usdcConfig)

  const handleApproveWETH = async () => {
    if (!accountId || !approveWETH) return
    approveWETH()
  }

  const handleApproveUSDC = async () => {
    if (!accountId || !approveUSDC) return
    approveUSDC()
  }

  return (
    <>
      <ModalBody>
        <Flex
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          textAlign="center"
        >
          <Text
            marginBottom='4'
            color="white.50"
            fontFamily="Favorit Extended"
            fontSize="1.3em"
            fontWeight="200"
          >
            Approve the Renegade contract to use your testnet funds
          </Text>
          <Flex gap='4'>
            <Flex flexDirection='column'>
              <Text marginBottom='2' fontFamily="Aime" fontSize="2em" fontWeight="700" >
                WETH
              </Text>
              <Text fontFamily="Aime" fontSize="2em" fontWeight="700">
                USDC
              </Text>

            </Flex>
            <Flex flexDirection='column'>
              <Button marginBottom='3' isDisabled={wethIsSuccess} isLoading={wethIsLoading} onClick={handleApproveWETH}>
                {wethIsSuccess ? <CheckIcon /> : "Approve"}
              </Button>

              <Button isDisabled={usdcIsSuccess} isLoading={usdcIsLoading} onClick={handleApproveUSDC}>
                {usdcIsSuccess ? <CheckIcon /> : "Approve"}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </ModalBody >
      <ModalFooter justifyContent="center">
        <Button
          padding="20px"
          color="white.80"
          fontSize="1.2em"
          fontWeight="200"
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
          transition="0.15s"
          backgroundColor="transparent"
          isDisabled={!wethIsSuccess && !usdcIsSuccess}
          onClick={onNext}
        >
          Next
        </Button>
      </ModalFooter>
    </>
  )
}
