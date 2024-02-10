import { useApp } from "@/contexts/App/app-context"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { Button, Flex, HStack, ModalBody, Text } from "@chakra-ui/react"
import { Keychain } from "@renegade-fi/renegade-js"
import { Unplug } from "lucide-react"
import { verifyMessage } from "viem"
import {
  useAccount as useAccountWagmi,
  useDisconnect as useDisconnectWagmi,
  useSignMessage as useSignMessageWagmi,
} from "wagmi"

import { useStepper } from "@/components/steppers/create-stepper/create-stepper"
import { client } from "@/app/providers"
import { useLocalStorage } from "usehooks-ts"

export function DefaultStep() {
  const { setIsOnboarding, setIsSigningIn } = useApp()
  const [, setSeed] = useLocalStorage<string | undefined>('seed', undefined)
  const { onClose } = useStepper()
  const { address } = useAccountWagmi()
  const { accountId, setAccount } = useRenegade()
  const { isLoading, signMessage } = useSignMessageWagmi({
    message: "Unlock your Renegade account.\nTestnet v0",
    async onSuccess(data, variables) {
      setIsSigningIn(true)
      // If Cloudflare is down, Smart Contract accounts cannot be verified
      // EOA accounts can be verified using verifyMessage util
      const valid = await client
        .verifyMessage({
          address: address ?? `0x`,
          message: variables.message,
          signature: data,
        })
        .then((res) => {
          if (!res) {
            return verifyMessage({
              address: address ?? `0x`,
              message: variables.message,
              signature: data,
            })
          }
          return res
        })
      if (!valid) {
        throw new Error("Invalid signature")
      }
      setAccount(accountId, new Keychain({ seed: data })).then(() => setSeed(data))
      // setSeed(data)
      setIsOnboarding(false)
      onClose()
    },
    onError() {
      setIsSigningIn(false)
    },
  })
  const { disconnect } = useDisconnectWagmi()

  return (
    <>
      <ModalBody>
        <Flex justifyContent="center" flexDirection="column" gap="4">
          <Text color="white.60" fontSize="0.9em">
            To trade on Renegade, we require a one-time signature to unlock and
            create your wallet.
          </Text>
          <div>
            <Button
              width="100%"
              height={isLoading ? "56px" : "40px"}
              color="white.90"
              fontWeight="800"
              transition="0.2s"
              isLoading={isLoading}
              loadingText="Signing in to Renegade"
              onClick={() => {
                signMessage()
              }}
            >
              <Text>Sign in to Renegade</Text>
            </Button>
            <Flex
              justifyContent="center"
              height={isLoading ? "0px" : "auto"}
              opacity={isLoading ? 0 : 1}
              transition="0.2s"
            >
              <Button
                color="white.50"
                fontFamily="Favorit"
                fontSize="1em"
                fontWeight="400"
                onClick={() => {
                  disconnect()
                  onClose()
                }}
                variant="transparent"
              >
                <HStack spacing="4px">
                  <Unplug size={18} />
                  <Text>
                    Disconnect L1 address 0x
                    {address ? address.slice(2, 6) : "????"}..
                  </Text>
                </HStack>
              </Button>
            </Flex>
          </div>
        </Flex>
      </ModalBody>
    </>
  )
}
