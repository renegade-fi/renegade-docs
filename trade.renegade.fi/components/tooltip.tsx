import { Tooltip as ChakraTooltip } from "@chakra-ui/react"

export function Tooltip({
  children,
  label,
  placement = "bottom",
  padding,
  paddingY,
  paddingX,
}: {
  children: React.ReactNode
  label?: string
  placement?: "top" | "bottom" | "left" | "right"
  padding?: number
  paddingY?: number
  paddingX?: number
}) {
  return (
    <ChakraTooltip
      padding={padding}
      color="white.100"
      fontFamily="Favorit"
      border="var(--secondary-border)"
      boxSizing="border-box"
      arrowShadowColor="#474554"
      backgroundColor="white.10"
      hasArrow
      label={label}
      paddingX={paddingX}
      paddingY={paddingY}
      placement={placement}
    >
      {children}
    </ChakraTooltip>
  )
}
