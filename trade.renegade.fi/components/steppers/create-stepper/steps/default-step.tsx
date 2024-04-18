import { Button, Flex, HStack, ModalBody, Text } from "@chakra-ui/react"
import { Unplug } from "lucide-react"
import { verifyMessage } from "viem"
import {
  useAccount as useAccountWagmi,
  useDisconnect as useDisconnectWagmi,
  useSignMessage as useSignMessageWagmi,
} from "wagmi"

import { client } from "@/app/providers"
import { useStepper } from "@/components/steppers/create-stepper/create-stepper"
import { useApp } from "@/contexts/App/app-context"
import { stylusDevnetEc2 } from "@/lib/viem"
import { connect, useConfig, waitForTaskCompletion } from "@sehyunchung/renegade-react"
import { toast } from "sonner"

const ROOT_KEY_MESSAGE_PREFIX = "Unlock your Renegade Wallet on chain ID:"

export function DefaultStep() {
  const { setIsOnboarding, setIsSigningIn } = useApp()
  const { onClose } = useStepper()
  const { address } = useAccountWagmi()
  const config = useConfig()
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
        config.setState({ ...config.state, seed: data })
        const res = await connect(config)
        if (typeof res !== 'string' && res.taskId) {
          toast.promise(
            waitForTaskCompletion(config, { taskId: res.taskId }).then(() => {
              console.log("Current Status in toast:", config.state)
            }),
            {
              loading: "Creating or finding wallet.",
              success: "Wallet created or found",
              error: "Failed to create or find wallet",
            })
        }
        console.log("Current Status after toast:", config.state)
        if (config.state.status === 'in relayer') {
          setIsSigningIn(false)
        }
        // setAccount(accountId, new Keychain({ seed: data })).then(() =>
        //   setSeed(data)
        // )
        setIsOnboarding(false)
        onClose()
      },
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
              height={status === "pending" ? "56px" : "40px"}
              color="white.90"
              fontWeight="800"
              transition="0.2s"
              isLoading={status === "pending"}
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
              height={status === "pending" ? "0px" : "auto"}
              opacity={status === "pending" ? 0 : 1}
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
