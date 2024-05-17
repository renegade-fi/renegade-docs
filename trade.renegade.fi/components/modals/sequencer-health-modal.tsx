import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { chain } from "@renegade-fi/react"
import { TriangleAlert } from "lucide-react"
import { useEffect } from "react"
import "simplebar-react/dist/simplebar.min.css"
import { createPublicClient, http } from "viem"

const publicClient = createPublicClient({
  chain: chain,
  transport: http(),
})
type SequencerHealthModalProps = {}
export function SequencerHealthModal({}: SequencerHealthModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    const pingSequencerHealth = async () => {
      try {
        const chainId = await publicClient.getChainId()
        if (!chainId) {
          onOpen()
        }
      } catch (_) {
        onOpen()
      }
    }

    pingSequencerHealth()
    const intervalId = setInterval(pingSequencerHealth, 5000)

    return () => clearInterval(intervalId)
  }, [onOpen])

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="sm">
      <ModalOverlay
        background="rgba(0, 0, 0, 0.25)"
        backdropFilter="blur(8px)"
      />
      <ModalContent background="surfaces.1" borderRadius="10">
        <ModalHeader>
          <TriangleAlert />
        </ModalHeader>
        <ModalBody>
          <ModalCloseButton />
          <Text>
            We&apos;re having trouble connecting to the testnet sequencer. You
            may experience degraded performance.
          </Text>
        </ModalBody>
        <ModalFooter gap="2">
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
