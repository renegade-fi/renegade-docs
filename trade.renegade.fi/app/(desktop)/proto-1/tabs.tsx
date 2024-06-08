"use client"

import { FancyUnderline } from "@/app/(desktop)/main-nav"
import { HStack, Text } from "@chakra-ui/react"

export const TabsBar = () => {
  return (
    <HStack
      height="var(--banner-height)"
      color="white.80"
      fontSize="1.1em"
      fontWeight="300"
      textDecoration="none"
      borderTop="var(--border)"
      borderBottom="var(--border)"
      onClick={(event) => event.stopPropagation()}
      paddingX="6"
      spacing="20px"
    >
      <FancyUnderline>
        <Text color="white.100" fontWeight="400">
          Open Orders
        </Text>
      </FancyUnderline>
      <FancyUnderline>
        <Text color="text.primary">Balances</Text>
      </FancyUnderline>
      <FancyUnderline>
        <Text color="text.primary">Balances History</Text>
      </FancyUnderline>
      <FancyUnderline>
        <Text color="text.primary">Fees</Text>
      </FancyUnderline>
    </HStack>
  )
}
