import { HamburgerIcon } from "@chakra-ui/icons";
import { Flex, Image, Spacer } from "@chakra-ui/react";
import React from "react";

import glyphDark from "../../icons/glyph_dark.svg";

export default class Header extends React.Component {
  render() {
    return (
      <Flex
        alignItems="center"
        width="100%"
        height="calc(2 * var(--banner-height))"
        padding="0 5% 0 5%"
        borderBottom="var(--border)"
        borderColor="border"
      >
        <Image height="50%" src={glyphDark} />
        <Spacer />
        <HamburgerIcon height="50%" width="auto" />
      </Flex>
    );
  }
}
