import React from "react"
import { Box, Center, Flex, Link } from "@chakra-ui/react"

interface BannerSeparatorProps {
  flexGrow?: number
  link?: string
}
export function BannerSeparator(props: BannerSeparatorProps) {
  const Wrapper = (wrapperProps: { children: React.ReactNode }) => {
    if (props.link) {
      return (
        <Flex
          as={Link}
          href={props.link}
          isExternal
          alignItems="center"
          justifyContent="center"
          height="100%"
          flexGrow={props.flexGrow}
        >
          <Center height="100%">{wrapperProps.children}</Center>
        </Flex>
      )
    } else {
      return (
        <Center height="100%" flexGrow={props.flexGrow}>
          {wrapperProps.children}
        </Center>
      )
    }
  }

  return (
    <Wrapper>
      <Box width="4px" height="4px" borderRadius="2px" background="white.80" />
    </Wrapper>
  )
}
