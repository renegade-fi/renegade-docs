import { Box, Center, Flex, Link, keyframes } from "@chakra-ui/react";
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
  link?: string;
}
export function BannerSeparator(props: BannerSeparatorProps) {
  let flexGrow: number;
  if (props.size === "small") {
    flexGrow = 1;
  } else if (props.size === "medium") {
    flexGrow = 4;
  } else {
    throw new Error("Invalid BannerSeparator size: " + props.size);
  }

  const Wrapper = (wrapperProps: { children: React.ReactNode }) => {
    if (props.link) {
      return (
        <Link height="70%" flexGrow={flexGrow} href={props.link} isExternal>
          <Center height="100%">{wrapperProps.children}</Center>
        </Link>
      );
    } else {
      return (
        <Center height="70%" flexGrow={flexGrow}>
          {wrapperProps.children}
        </Center>
      );
    }
  };

  return (
    <Wrapper>
      <Box width="4px" height="4px" borderRadius="2px" background="white.80" />
    </Wrapper>
  );
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
          props.state === "live"
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
