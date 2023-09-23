import { useRenegade } from "@/contexts/Renegade/renegade-context"
import {
  Button,
  Flex,
  HStack,
  ModalBody,
  Spinner,
  Text,
} from "@chakra-ui/react"
import { Keychain } from "@renegade-fi/renegade-js"
import { Unplug } from "lucide-react"
import {
  useAccount as useAccountWagmi,
  useDisconnect as useDisconnectWagmi,
  useSignMessage as useSignMessageWagmi,
} from "wagmi"

import { useStepper } from "@/components/steppers/create-stepper/create-stepper"
import { client } from "@/app/providers"

export function DefaultStep() {
  const { onClose, onNext } = useStepper()
  const { address } = useAccountWagmi()
  const { accountId, setAccount } = useRenegade()
  const { isLoading, signMessage } = useSignMessageWagmi({
    message: "Unlock your Renegade account.\nTestnet v0",
    async onSuccess(data, variables) {
      const valid = await client.verifyMessage({
        address: address ?? `0x`,
        message: variables.message,
        signature: data,
      })
      if (!valid) {
        throw new Error("Invalid signature")
      }
      setAccount(accountId, new Keychain({ seed: data }))
      onNext()
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
          <Button
            color="white.90"
            fontWeight="800"
            transition="0.2s"
            onClick={() => signMessage()}
          >
            <HStack spacing="10px">
              <Spinner
                width={isLoading ? "17px" : "0px"}
                height={isLoading ? "17px" : "0px"}
                opacity={isLoading ? 1 : 0}
                transition="0.2s"
                speed="0.8s"
              />
              <Text>Sign in to Renegade</Text>
            </HStack>
          </Button>
          <Button
            padding="0"
            color="white.50"
            fontFamily="Favorit"
            fontSize="1.05em"
            fontWeight="400"
            disabled={isLoading}
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
                {address ? address.slice(2, 6) : "????"}
                ..
              </Text>
            </HStack>
          </Button>
        </Flex>
      </ModalBody>
    </>
  )
}
