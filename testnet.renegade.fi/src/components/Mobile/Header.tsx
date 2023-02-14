import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Box, Flex, Image, Link, Spacer, Text } from "@chakra-ui/react";
import React from "react";

import glyphDark from "../../icons/glyph_dark.svg";

const headerHeight = "calc(2 * var(--banner-height))";

interface OverlayMenuProps {
  showOverlay: boolean;
  setShowOverlay: (showOverlay: boolean) => void;
}
function OverlayMenu(props: OverlayMenuProps) {
  return (
    <Box
      background={props.showOverlay ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0)"}
      pointerEvents={props.showOverlay ? "auto" : "none"}
      onClick={() => props.setShowOverlay(false)}
      transition="0.2s"
      position="absolute"
      left="0"
      right="0"
      top="0"
      bottom="0"
      zIndex="2"
    >
      <Box
        background="#111"
        height="100%"
        width="80%"
        position="absolute"
        right={props.showOverlay ? "20%" : "100%"}
        opacity={props.showOverlay ? "1" : "0.5"}
        transition="0.15s"
        transitionDelay="0.05s"
        overflow="hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Flex alignItems="center" justifyContent="center" padding="18px">
          <Image height="30px" width="auto" src={glyphDark} />
          <Spacer />
          <CloseIcon
            height="20px"
            opacity="0.6"
            width="auto"
            onClick={() => props.setShowOverlay(false)}
          />
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
          padding="15px 0 0 20px"
          gap="5px"
          color="white.80"
          fontWeight="normal"
        >
          <Text
            fontFamily="Favorit Expanded"
            fontSize="1.4em"
            fontWeight="bold"
            color="white"
          >
            Get Priority Access
          </Text>
          <Link href="https://renegadefi.typeform.com/access" isExternal>
            Onboarding Form
          </Link>
          <Text
            marginTop="25px"
            fontFamily="Favorit Expanded"
            fontSize="1.4em"
            fontWeight="bold"
            color="white"
          >
            Technical Resources
          </Text>
          <Link href="https://docs.renegade.fi" isExternal>
            Documentation
          </Link>
          <Link href="https://whitepaper.renegade.fi" isExternal>
            Whitepaper
          </Link>
          <Text
            marginTop="25px"
            fontFamily="Favorit Expanded"
            fontSize="1.4em"
            fontWeight="bold"
            color="white"
          >
            Social Profiles
          </Text>
          <Link href="https://twitter.com/renegade_fi" isExternal>
            Twitter
          </Link>
          <Link href="https://discord.gg/renegade-fi" isExternal>
            Discord
          </Link>
          <Link href="https://renegadefi.substack.com" isExternal>
            Substack
          </Link>
          <Text
            marginTop="25px"
            fontFamily="Favorit Expanded"
            fontSize="1.4em"
            fontWeight="bold"
            color="white"
          >
            Contact Info
          </Text>
          <Link href="mailto:chris@renegade.fi" isExternal>
            Email Us
          </Link>
          <Link href="https://twitter.com/renegade_fi" isExternal>
            Twitter DM
          </Link>
        </Flex>
      </Box>
    </Box>
  );
}

export default function Header() {
  const [showOverlay, setShowOverlay] = React.useState(false);
  return (
    <Flex
      alignItems="center"
      width="100%"
      height={headerHeight}
      padding="0 5% 0 5%"
      borderBottom="var(--border)"
      borderColor={showOverlay ? "white.20" : "border"}
      transition="0.2s"
    >
      <Image height="50%" src={glyphDark} />
      <Spacer />
      <HamburgerIcon
        height="40px"
        width="auto"
        onClick={() => setShowOverlay(true)}
      />
      <OverlayMenu showOverlay={showOverlay} setShowOverlay={setShowOverlay} />
    </Flex>
  );
}
