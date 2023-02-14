import { Button, Flex, HStack, Icon, Spinner, Text } from "@chakra-ui/react";
import { verifyMessage } from "ethers/lib/utils";
import React from "react";
import { AiOutlineDisconnect } from "react-icons/ai";
import {
  useAccount as useAccountWagmi,
  useDisconnect as useDisconnectWagmi,
  useSignMessage as useSignMessageWagmi,
} from "wagmi";

import KeyStore from "../../../connections/KeyStore";
import KeyStoreContext from "../../../contexts/KeyStoreContext";

interface SignInButtonProps {
  isLoading: boolean;
  signMessage: () => void;
  onClose: () => void;
}
function SignInButton(props: SignInButtonProps) {
  return (
    <Button
      width="100%"
      height={props.isLoading ? "50px" : "40px"}
      transition="0.2s"
      marginTop="20px"
      fontWeight="800"
      backgroundColor="brown.light"
      color="white.90"
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
  );
}

function DisconnectWalletButton(props: { onClose: () => void }) {
  const { address } = useAccountWagmi();
  const { disconnect } = useDisconnectWagmi();
  return (
    <Button
      variant="transparent"
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

interface SignInModalProps {
  onClose: () => void;
}
export default function SignInModal(props: SignInModalProps) {
  const [, setKeyStoreState] = React.useContext(KeyStoreContext);
  const { isLoading, signMessage } = useSignMessageWagmi({
    message: KeyStore.CREATE_SK_ROOT_MESSAGE,
    async onSuccess(data, variables) {
      verifyMessage(variables.message, data); // TODO: Verify this output address.
      setKeyStoreState(await KeyStore.fromSignature(data));
      props.onClose();
    },
  });
  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <Text fontSize="0.9em" color="white.60">
        To trade on Renegade, we require a one-time signature to unlock and
        create your wallet.
      </Text>
      <SignInButton
        isLoading={isLoading}
        signMessage={signMessage}
        onClose={props.onClose}
      />
      <Flex
        marginTop="10px"
        alignItems="center"
        opacity={isLoading ? 0 : 1}
        height={isLoading ? "0px" : "40px"}
        transition="0.2s"
      >
        <DisconnectWalletButton onClose={props.onClose} />
      </Flex>
    </Flex>
  );
}
