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
import { useAccount as useAccountWagmi } from "wagmi";

import glyphDark from "../icons/glyph_dark.svg";

function ManageWalletButton(props: { onOpenGlobalModal: () => void }) {
  const { address } = useAccountWagmi();
  if (!address) {
    return null;
  }
  return (
    <Button variant="wallet-connect" onClick={props.onOpenGlobalModal}>
      <HStack spacing="0px">
        <Text>Manage Wallet 0x</Text>
        <Text>{address.slice(2, 6)}</Text>
      </HStack>
    </Button>
  );
}

function ConnectWalletButton() {
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
      <HStack spacing="20px" fontWeight="300" fontSize="1.1em" color="white.90">
        <Link
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
        <ManageWalletButton onOpenGlobalModal={props.onOpenGlobalModal} />
      </Flex>
    </Flex>
  );
}
