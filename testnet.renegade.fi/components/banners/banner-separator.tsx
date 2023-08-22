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
          alignItems="center"
          justifyContent="center"
          flexGrow={props.flexGrow}
          height="100%"
          href={props.link}
          isExternal
        >
          <Center height="100%">{wrapperProps.children}</Center>
        </Flex>
      )
    } else {
      return (
        <Center flexGrow={props.flexGrow} height="100%">
          {wrapperProps.children}
        </Center>
      )
    }
  }

  return (
    <Wrapper>
      <Box width="4px" height="4px" background="white.80" borderRadius="2px" />
    </Wrapper>
  )
}
