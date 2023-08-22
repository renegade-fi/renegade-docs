import React from "react"
import { useRenegade } from "@/contexts/Renegade/renegade-context"
import {
  Button,
  Flex,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react"
import { Keychain } from "@renegade-fi/renegade-js"
import { verifyMessage } from "ethers"
import { AiOutlineDisconnect } from "react-icons/ai"
import {
  useAccount as useAccountWagmi,
  useDisconnect as useDisconnectWagmi,
  useSignMessage as useSignMessageWagmi,
} from "wagmi"

interface SignInButtonProps {
  isLoading: boolean
  signMessage: () => void
  onClose: () => void
}
function SignInButton(props: SignInButtonProps) {
  return (
    <Button
      width="100%"
      height={props.isLoading ? "50px" : "40px"}
      marginTop="20px"
      color="white.90"
      fontWeight="800"
      transition="0.2s"
      backgroundColor="brown.light"
      onClick={() => props.signMessage()}
    >
      <HStack spacing="10px">
        <Spinner
          width={props.isLoading ? "17px" : "0px"}
          height={props.isLoading ? "17px" : "0px"}
          opacity={props.isLoading ? 1 : 0}
          transition="0.2s"
          speed="0.8s"
        />
        <Text>Sign in to Renegade</Text>
      </HStack>
    </Button>
  )
}

function DisconnectWalletButton(props: { onClose: () => void }) {
  const { address } = useAccountWagmi()
  const { disconnect } = useDisconnectWagmi()
  return (
    <Button
      padding="0"
      color="white.50"
      fontFamily="Favorit"
      fontSize="1.05em"
      fontWeight="400"
      onClick={() => {
        disconnect()
        props.onClose()
      }}
      variant="transparent"
    >
      <HStack spacing="0px">
        <Icon as={AiOutlineDisconnect} marginRight="5px" />
        <Text>Disconnect L1 address 0x</Text>
        <Text>{address ? address.slice(2, 6) : "????"}..</Text>
      </HStack>
    </Button>
  )
}

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
}
export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const { accountId, setAccount } = useRenegade()
  const { isLoading, signMessage } = useSignMessageWagmi({
    message: "Unlock your Renegade account.\nTestnet v0",
    async onSuccess(data, variables) {
      verifyMessage(variables.message, data) // TODO: Verify this output address.
      setAccount(accountId, new Keychain({ seed: data }))
      onClose()
    },
  })
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay
        background="rgba(0, 0, 0, 0.25)"
        backdropFilter="blur(8px)"
      />
      <ModalContent background="brown" borderRadius="10px">
        <ModalHeader paddingBottom="0">Unlock your Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Text color="white.60" fontSize="0.9em">
              To trade on Renegade, we require a one-time signature to unlock
              and create your wallet.
            </Text>
            <SignInButton
              isLoading={isLoading}
              signMessage={signMessage}
              onClose={onClose}
            />
            <Flex
              alignItems="center"
              height={isLoading ? "0px" : "40px"}
              marginTop="10px"
              opacity={isLoading ? 0 : 1}
              transition="0.2s"
            >
              <DisconnectWalletButton onClose={onClose} />
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
