import {
  CREATE_WALLET_ERROR,
  CREATE_WALLET_START,
  CREATE_WALLET_SUCCESS,
  LOOKUP_WALLET_ERROR,
  LOOKUP_WALLET_START,
  LOOKUP_WALLET_SUCCESS,
} from "@/constants/task-messages"
import { ViewEnum, useApp } from "@/contexts/App/app-context"
import { REMEMBER_ME_TOOLTIP } from "@/lib/tooltip-labels"
import {
  Button,
  Checkbox,
  Flex,
  HStack,
  ModalBody,
  Text,
} from "@chakra-ui/react"
import { chain, connect, useConfig } from "@renegade-fi/react"
import { CircleHelp, Unplug } from "lucide-react"
import { toast } from "sonner"
import { useLocalStorage } from "usehooks-ts"
import { createPublicClient, http, verifyMessage } from "viem"
import {
  useAccount as useAccountWagmi,
  useDisconnect as useDisconnectWagmi,
  useSignMessage as useSignMessageWagmi,
} from "wagmi"

import { useStepper } from "@/components/steppers/create-stepper/create-stepper"
import { Tooltip } from "@/components/tooltip"

const ROOT_KEY_MESSAGE_PREFIX = "Unlock your Renegade Wallet on chain ID:"

const publicClient = createPublicClient({
  chain,
  transport: http(),
})

export function DefaultStep() {
  const { setView } = useApp()
  const { onClose } = useStepper()
  const { address } = useAccountWagmi()
  const { disconnect } = useDisconnectWagmi()
  const [rememberMe, setRememberMe] = useLocalStorage("rememberMe", false)
  const config = useConfig()
  const { signMessage, status } = useSignMessageWagmi({
    mutation: {
      async onSuccess(data, variables) {
        // If Cloudflare is down, Smart Contract accounts cannot be verified
        // EOA accounts can be verified using verifyMessage util
        const valid = await publicClient
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
        const res = await connect(config, { seed: data })
        if (res?.job) {
          const { isLookup, job } = res
          toast.promise(job, {
            loading: isLookup ? LOOKUP_WALLET_START : CREATE_WALLET_START,
            success: () => {
              if (!isLookup) {
                setView(ViewEnum.DEPOSIT)
                return CREATE_WALLET_SUCCESS
              }
              return LOOKUP_WALLET_SUCCESS
            },
            error: isLookup ? LOOKUP_WALLET_ERROR : CREATE_WALLET_ERROR,
          })
        }
        onClose()
      },
    },
  })

  return (
    <>
      <ModalBody>
        <Flex
          justifyContent="center"
          flexDirection="column"
          gap="4"
          color="text.secondary"
        >
          <Text fontSize="0.9em">
            To trade on Renegade, we require a one-time signature to unlock and
            create your wallet.
          </Text>
          <Flex gap="2">
            <Checkbox
              isChecked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              size="sm"
            />
            <Flex
              gap="1"
              cursor="pointer"
              onClick={() => setRememberMe((prev) => !prev)}
            >
              <Text fontSize="0.9em">Remember Me</Text>
              <Tooltip label={REMEMBER_ME_TOOLTIP} placement="right">
                <CircleHelp height="16" />
              </Tooltip>
            </Flex>
          </Flex>
          <div>
            <Button
              width="100%"
              height={status === "pending" ? "56px" : "40px"}
              color="text.primary"
              fontWeight="800"
              transition="0.2s"
              isLoading={status === "pending"}
              loadingText="Signing in to Renegade"
              onClick={() => {
                signMessage({
                  message: `${ROOT_KEY_MESSAGE_PREFIX} ${chain.id}`,
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
