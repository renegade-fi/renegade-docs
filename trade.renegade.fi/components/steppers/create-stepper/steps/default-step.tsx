import { useApp } from "@/contexts/App/app-context"
import {
  Button,
  Checkbox,
  Flex,
  HStack,
  ModalBody,
  Text,
  Tooltip,
} from "@chakra-ui/react"
import { useConfig } from "@renegade-fi/react"
import { CircleHelp, Unplug } from "lucide-react"
import { useLocalStorage } from "usehooks-ts"
import { verifyMessage } from "viem"
import {
  useAccount as useAccountWagmi,
  useDisconnect as useDisconnectWagmi,
  useSignMessage as useSignMessageWagmi,
} from "wagmi"

import { useStepper } from "@/components/steppers/create-stepper/create-stepper"

const ROOT_KEY_MESSAGE_PREFIX = "Unlock your Renegade Wallet on chain ID:"

export function DefaultStep() {
  const { onSignin } = useApp()
  const { onClose } = useStepper()
  const { address } = useAccountWagmi()
  const config = useConfig()
  const client = config.getViemClient()
  const [rememberMe, setRememberMe] = useLocalStorage("rememberMe", 0)
  const { signMessage, status } = useSignMessageWagmi({
    mutation: {
      async onSuccess(data, variables) {
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
        onSignin(data)
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
          <Flex gap="2">
            <Checkbox
              color="white.30"
              defaultChecked={!!rememberMe}
              id="remember-me"
              onChange={() => setRememberMe((prev) => (prev ? 0 : 1))}
              size="sm"
              value={rememberMe}
            />
            <Tooltip
              label="Only use this option if you are using a secure device that you own."
              placement="right"
            >
              <Flex gap="1">
                <Text color="white.60" fontSize="0.9em">
                  Remember Me
                </Text>
                <CircleHelp color="#999999" height="16" />
              </Flex>
            </Tooltip>
          </Flex>
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
                  message: `${ROOT_KEY_MESSAGE_PREFIX} ${client.chain?.id}`,
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
