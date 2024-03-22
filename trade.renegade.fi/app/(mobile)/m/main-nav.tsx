"use client"

import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons"
import { Box, Flex, Link, Spacer, Text } from "@chakra-ui/react"
import Image from "next/image"
import React from "react"

import glyphDark from "@/icons/glyph_dark.svg"

const headerHeight = "calc(2 * var(--banner-height))"

interface OverlayMenuProps {
  showOverlay: boolean
  setShowOverlay: (showOverlay: boolean) => void
}
function OverlayMenu(props: OverlayMenuProps) {
  return (
    <Box
      position="absolute"
      zIndex="2"
      top="0"
      right="0"
      bottom="0"
      left="0"
      background={props.showOverlay ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0)"}
      pointerEvents={props.showOverlay ? "auto" : "none"}
      transition="0.2s"
      onClick={() => props.setShowOverlay(false)}
    >
      <Box
        position="absolute"
        right={props.showOverlay ? "20%" : "100%"}
        overflow="hidden"
        width="80%"
        height="100%"
        background="#111"
        opacity={props.showOverlay ? "1" : "0.5"}
        transition="0.15s"
        onClick={(e) => e.stopPropagation()}
        transitionDelay="0.05s"
      >
        <Flex alignItems="center" justifyContent="center" padding="18px">
          <Image alt="Renegade Logo" height="32" src={glyphDark} />
          <Spacer />
          <CloseIcon
            height="16px"
            opacity="0.6"
            width="auto"
            onClick={() => props.setShowOverlay(false)}
          />
        </Flex>
        <Flex
          alignItems="flex-start"
          justifyContent="center"
          flexDirection="column"
          gap="5px"
          padding="15px 0 0 20px"
          color="white.80"
          fontWeight="normal"
        >
          <Text
            color="white"
            fontFamily="Favorit Expanded"
            fontSize="1.4em"
            fontWeight="bold"
          >
            Get Priority Access
          </Text>
          <Link href="https://renegadefi.typeform.com/access" isExternal>
            Onboarding Form
          </Link>
          <Text
            marginTop="25px"
            color="white"
            fontFamily="Favorit Expanded"
            fontSize="1.4em"
            fontWeight="bold"
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
            color="white"
            fontFamily="Favorit Expanded"
            fontSize="1.4em"
            fontWeight="bold"
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
            color="white"
            fontFamily="Favorit Expanded"
            fontSize="1.4em"
            fontWeight="bold"
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
  )
}

export function MobileNav() {
  const [showOverlay, setShowOverlay] = React.useState(false)
  return (
    <Flex
      alignItems="center"
      width="100%"
      height={headerHeight}
      padding="0 5% 0 5%"
      borderColor={showOverlay ? "white.20" : "border"}
      borderBottom="var(--border)"
      transition="0.2s"
    >
      <Image alt="Renegade Logo" height="32" src={glyphDark} />
      <Spacer />
      <HamburgerIcon
        height="24px"
        width="auto"
        onClick={() => setShowOverlay(true)}
      />
      <OverlayMenu showOverlay={showOverlay} setShowOverlay={setShowOverlay} />
    </Flex>
  )
}
