import { Button, Flex, HStack, ModalBody, Text } from "@chakra-ui/react"
import { Keychain } from "@renegade-fi/renegade-js"
import { Unplug } from "lucide-react"
import { useLocalStorage } from "usehooks-ts"
import { verifyMessage } from "viem"
import {
  useAccount as useAccountWagmi,
  useDisconnect as useDisconnectWagmi,
  useSignMessage as useSignMessageWagmi,
} from "wagmi"

import { client } from "@/app/providers"
import { useStepper } from "@/components/steppers/create-stepper/create-stepper"
import { useApp } from "@/contexts/App/app-context"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import { stylusDevnetEc2 } from "@/lib/chain"

const ROOT_KEY_MESSAGE_PREFIX = "Unlock your Renegade Wallet on chain ID:";

export function DefaultStep() {
  const { setIsOnboarding, setIsSigningIn } = useApp()
  const [, setSeed] = useLocalStorage<string | undefined>("seed", undefined)
  const { onClose } = useStepper()
  const { address } = useAccountWagmi()
  const { accountId, setAccount } = useRenegade()
  const { signMessage, status } = useSignMessageWagmi({
    mutation: {
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
        setAccount(accountId, new Keychain({ seed: data })).then(() =>
          setSeed(data)
        )
        setIsOnboarding(false)
        onClose()
      },
    }
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
              height={status === 'pending' ? "56px" : "40px"}
              color="white.90"
              fontWeight="800"
              transition="0.2s"
              isLoading={status === 'pending'}
              loadingText="Signing in to Renegade"
              onClick={() => {
                signMessage({
                  message: `${ROOT_KEY_MESSAGE_PREFIX} ${stylusDevnetEc2.id}`,
                })
              }}
            >
              <Text>Sign in to Renegade</Text>
            </Button>
            <Flex
              justifyContent="center"
              height={status === 'pending' ? "0px" : "auto"}
              opacity={status === 'pending' ? 0 : 1}
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
