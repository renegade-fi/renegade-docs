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
  Text,
} from "@chakra-ui/react";
import { verifyMessage } from "ethers/lib/utils";
import React from "react";
import { AiOutlineDisconnect } from "react-icons/ai";
import {
  useAccount as useAccountWagmi,
  useDisconnect as useDisconnectWagmi,
  useSignMessage as useSignMessageWagmi,
} from "wagmi";

import KeyStore from "../connections/KeyStore";
import KeyStoreContext from "../contexts/KeyStoreContext";

function SignInButton() {
  const keyStore = React.useContext(KeyStoreContext);
  const { signMessage } = useSignMessageWagmi({
    message: KeyStore.SIGN_IN_MESSAGE,
    onSuccess(data, variables) {
      const address = verifyMessage(variables.message, data); // TODO: Validate this addr?
      keyStore.populateFromSignature(data);
    },
  });
  return (
    <Button
      width="100%"
      marginTop="20px"
      fontFamily="Favorit Expanded"
      fontWeight="800"
      backgroundColor="brown.light"
      color="white.90"
      onClick={() => signMessage()}
    >
      Sign in to Renegade
    </Button>
  );
}

function DisconnectWalletButton(props: { onClose: () => void }) {
  const { address } = useAccountWagmi();
  const { disconnect } = useDisconnectWagmi();
  return (
    <Button
      variant="transparent"
      marginTop="10px"
      padding="0"
      fontFamily="Favorit"
      fontWeight="400"
      fontSize="1.05em"
      color="white.50"
      onClick={() => {
        disconnect();
        props.onClose();
      }}
    >
      <HStack spacing="0px">
        <Icon as={AiOutlineDisconnect} marginRight="5px" />
        <Text>Disconnect L1 address 0x</Text>
        <Text>{address ? address.slice(2, 6) : "????"}..</Text>
      </HStack>
    </Button>
  );
}

interface GlobalModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
export default function GlobalModal(props: GlobalModalProps) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered size="sm">
      <ModalOverlay
        background="rgba(0, 0, 0, 0.25)"
        backdropFilter="blur(8px)"
      />
      <ModalContent borderRadius="10px" background="brown">
        <ModalHeader paddingBottom="0">Unlock your Wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize="0.9em" color="white.60">
              To trade on Renegade, we require a one-time signature to unlock
              and create your wallet.
            </Text>
            <SignInButton />
            <DisconnectWalletButton onClose={props.onClose} />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
