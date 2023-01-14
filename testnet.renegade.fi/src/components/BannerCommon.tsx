import { Box } from "@chakra-ui/react";
import React from "react";

interface BannerSeparatorProps {
  size: "small" | "medium";
}
export function BannerSeparator(props: BannerSeparatorProps) {
  if (props.size === "small") {
    return (
      <Box width="4px" height="4px" borderRadius="2px" background="white.80" />
    );
  } else if (props.size === "medium") {
    return (
      <Box width="4px" height="4px" borderRadius="2px" background="white.80" />
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
  return (
    <Box
      width="8px"
      height="8px"
      borderRadius="4px"
      background={backgroundColor}
    />
  );
}
