import { Box, Center } from "@chakra-ui/react"

interface BannerSeparatorProps {
  flexGrow?: number
}
export function BannerSeparator(props: BannerSeparatorProps) {
  return (
    <Center flexGrow={props.flexGrow || 4} height="100%">
      <Box
        width="4px"
        height="4px"
        background="text.secondary"
        borderRadius="2px"
      />
    </Center>
  )
}
