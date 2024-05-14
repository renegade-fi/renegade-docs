import { Tooltip as ChakraTooltip } from "@chakra-ui/react"

export function Tooltip({
  children,
  label,
  placement = "bottom",
}: {
  children: React.ReactNode
  label?: string
  placement?: "top" | "bottom" | "left" | "right"
}) {
  return (
    <ChakraTooltip
      color="white.100"
      fontFamily="Favorit"
      backgroundColor="white.10"
      //   backgroundColor="white"
      hasArrow
      label={label}
      placement={placement}
    >
      {children}
    </ChakraTooltip>
  )
}
