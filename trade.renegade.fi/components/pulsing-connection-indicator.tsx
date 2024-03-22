import { Box, Flex, keyframes } from "@chakra-ui/react"
import React from "react"

function pulseAnimation(scale: number) {
  return keyframes`
    0% {
      opacity: 1;
      scale: 1;
    }
    15% {
      opacity: 1;
    }
    33%, 100% {
      opacity: 0;
      scale: ${scale};
    }
  `
}

interface PulsingConnectionProps {
  state: "live" | "dead" | "loading"
}
const PulsingConnectionUnmemoized = (props: PulsingConnectionProps) => {
  let backgroundColor: string
  if (props.state === "live") {
    backgroundColor = "green"
  } else if (props.state === "dead") {
    backgroundColor = "red"
  } else if (props.state === "loading") {
    backgroundColor = "white.20"
  } else {
    throw new Error("Invalid PulsingConnection state: " + props.state)
  }
  const randomDelay = Math.random() * 2
  return (
    <Flex
      position="relative"
      alignItems="center"
      justifyContent="center"
      width="8px"
      height="8px"
    >
      <Box
        position="absolute"
        width="8px"
        height="8px"
        border="1px solid"
        borderColor={backgroundColor}
        borderRadius="4px"
        animation={
          props.state === "live"
            ? `${pulseAnimation(2.25)} 2s ease-out infinite ${randomDelay}s`
            : ""
        }
        backgroundColor="black"
        suppressHydrationWarning
      />
      <Box
        position="absolute"
        width="8px"
        height="8px"
        borderRadius="4px"
        backgroundColor={backgroundColor}
      />
    </Flex>
  )
}
export const PulsingConnection = React.memo(PulsingConnectionUnmemoized)
