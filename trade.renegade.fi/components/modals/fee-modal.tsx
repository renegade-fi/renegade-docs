import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react"

export function FeeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="xs">
      <ModalOverlay />
      <ModalContent background="surfaces.1" borderRadius="10">
        <ModalHeader>Fee Breakdown</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <StatGroup>
            <Stat>
              <StatLabel>In-Protocol Fee</StatLabel>
              <StatNumber>0.02%</StatNumber>
            </Stat>

            <Stat>
              <StatLabel>Relayer Fee</StatLabel>
              <StatNumber>0.08%</StatNumber>
            </Stat>
          </StatGroup>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}
