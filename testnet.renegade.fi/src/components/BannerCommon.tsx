import { Box, Center, Flex, keyframes } from "@chakra-ui/react";
import React from "react";

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
  `;
}

interface BannerSeparatorProps {
  size: "small" | "medium";
}
export function BannerSeparator(props: BannerSeparatorProps) {
  if (props.size === "small") {
    return (
      <Center flexGrow="1">
        <Box
          width="4px"
          height="4px"
          borderRadius="2px"
          background="white.80"
        />
      </Center>
    );
  } else if (props.size === "medium") {
    return (
      <Center flexGrow="4">
        <Box
          width="4px"
          height="4px"
          borderRadius="2px"
          background="white.80"
        />
      </Center>
    );
  } else {
    throw new Error("Invalid BannerSeparator size: " + props.size);
  }
}

interface PulsingConnectionProps {
  state: "live" | "dead" | "loading";
}
export function PulsingConnection(props: PulsingConnectionProps) {
  let backgroundColor: string;
  if (props.state === "live") {
    backgroundColor = "green";
  } else if (props.state === "dead") {
    backgroundColor = "red";
  } else if (props.state === "loading") {
    backgroundColor = "white.20";
  } else {
    throw new Error("Invalid PulsingConnection state: " + props.state);
  }
  const randomDelay = Math.random() * 2;
  return (
    <Flex position="relative" alignItems="center">
      <Box
        position="absolute"
        width="8px"
        height="8px"
        borderRadius="4px"
        backgroundColor="black"
        border="1px solid"
        borderColor={backgroundColor}
        animation={
          props.state !== "dead"
            ? `${pulseAnimation(2.25)} 2s ease-out infinite ${randomDelay}s`
            : ""
        }
      />
      <Box
        position="absolute"
        width="8px"
        height="8px"
        borderRadius="4px"
        backgroundColor={backgroundColor}
      />
    </Flex>
  );
}
