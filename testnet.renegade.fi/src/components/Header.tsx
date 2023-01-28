import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Link,
  Spacer,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { ConnectKitButton } from "connectkit";
import React from "react";
import {
  useAccount as useAccountWagmi,
  useDisconnect as useDisconnectWagmi,
  useEnsName as useEnsNameWagmi,
} from "wagmi";

import KeyStore from "../connections/KeyStore";
import KeyStoreContext from "../contexts/KeyStoreContext";
import glyphDark from "../icons/glyph_dark.svg";

/**
 * The initial "Connect Wallet" button. Only visible if the user has not
 * connected their wallet.
 */
export function ConnectWalletButton() {
  return (
    <ConnectKitButton.Custom>
      {({ isConnecting, isConnected, show }) => {
        if (isConnected) {
          return null;
        }
        let buttonBody: React.ReactElement;
        if (isConnecting) {
          buttonBody = (
            <HStack spacing="10px">
              <Text>Connecting to L1</Text>
              <Spinner size="sm" color="white.80" />
            </HStack>
          );
        } else {
          buttonBody = <Text>Connect Wallet</Text>;
        }
        return (
          <Button variant="wallet-connect" onClick={show}>
            {buttonBody}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}

/**
 * The "Sign In with..." button. Only visible if the user has connected their
 * wallet, but we have not re-derived the key hierarchy.
 */
function SignInButton(props: { onOpenGlobalModal: () => void }) {
  const { address } = useAccountWagmi();
  const { data } = useEnsNameWagmi({ address });
  const [keyStoreState] = React.useContext(KeyStoreContext);
  if (!address) {
    return null;
  }
  if (!KeyStore.isUnpopulated(keyStoreState)) {
    return null;
  }

  let buttonContent: React.ReactElement;
  if (data) {
    buttonContent = (
      <HStack spacing="4px">
        <Text>Sign in with</Text>
        <Text>{data}</Text>
      </HStack>
    );
  } else {
    buttonContent = (
      <HStack spacing="0px">
        <Text>Sign in with 0x</Text>
        <Text>{address.slice(2, 6)}</Text>
        <Text>{data}</Text>
      </HStack>
    );
  }

  return (
    <Button variant="wallet-connect" onClick={props.onOpenGlobalModal}>
      {buttonContent}
    </Button>
  );
}

/**
 * The "Disconnect..." button. Only visible if the user has
 * connected their wallet and we have populated the key hierarchy.
 */
function DisconnectWalletButton() {
  const { disconnect } = useDisconnectWagmi();
  const { address } = useAccountWagmi();
  const { data } = useEnsNameWagmi({ address });
  const [keyStoreState, setKeyStoreState] = React.useContext(KeyStoreContext);
  if (!address) {
    return null;
  }
  if (KeyStore.isUnpopulated(keyStoreState)) {
    return null;
  }

  let buttonContent: React.ReactElement;
  if (data) {
    buttonContent = (
      <HStack spacing="4px">
        <Text>Disconnect</Text>
        <Text>{data}</Text>
      </HStack>
    );
  } else {
    buttonContent = (
      <HStack spacing="0px">
        <Text>Disconnect 0x</Text>
        <Text>{address ? address.slice(2, 6) : "????"}</Text>
      </HStack>
    );
  }

  return (
    <Button
      variant="wallet-connect"
      background="white.10"
      onClick={() => {
        setKeyStoreState(KeyStore.default());
        disconnect();
      }}
    >
      {buttonContent}
    </Button>
  );
}

export default function Header(props: { onOpenGlobalModal: () => void }) {
  return (
    <Flex
      alignItems="center"
      width="100%"
      height="calc(2 * var(--banner-height))"
      borderBottom="var(--border)"
      borderColor="border"
    >
      <Box width="30%" userSelect="none">
        <Image height="var(--banner-height)" marginLeft="4%" src={glyphDark} />
      </Box>
      <Spacer />
      <HStack spacing="20px" fontSize="1.1em" color="white.80" fontWeight="300">
        <Link
          fontWeight="400"
          href="https://twitter.com/renegade_fi"
          isExternal
          color="white.100"
        >
          Twitter
        </Link>
        <Link href="https://discord.gg/renegade-fi" isExternal>
          Discord
        </Link>
        <Link href="https://docs.renegade.fi" isExternal>
          Docs
        </Link>
        <Link href="https://whitepaper.renegade.fi" isExternal>
          Whitepaper
        </Link>
      </HStack>
      <Spacer />
      <Flex width="30%" justifyContent="right" paddingRight="1.5%">
        <ConnectWalletButton />
        <SignInButton onOpenGlobalModal={props.onOpenGlobalModal} />
        <DisconnectWalletButton />
      </Flex>
    </Flex>
  );
}
