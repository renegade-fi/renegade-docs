import {
  Box,
  Button,
  Text,
  HStack,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import React from "react";

interface DropdownProps {
  defaultOption: string;
  allOptions: string[];
}
function Dropdown(props: DropdownProps) {
  return (
    <Menu>
      <MenuButton>
        <HStack marginRight="-10px">
          <Text variant="trading-body-button" marginRight="-10px">
            {props.defaultOption}
          </Text>
          <ChevronDownIcon color="white.100" boxSize="40px" />
        </HStack>
      </MenuButton>
      <MenuList>
        {props.allOptions.map((option) => {
          return <MenuItem key={option}>{option}</MenuItem>;
        })}
      </MenuList>
    </Menu>
  );
}

interface TradingBodyProps {
  activeBaseTicker: string;
  activeQuoteTicker: string;
}
export default function TradingBody(props: TradingBodyProps) {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="25px"
      flexGrow="1"
    >
      <HStack
        fontFamily="Aime"
        fontSize="1.8em"
        fontWeight="100"
        spacing="10px"
        color="white.80"
      >
        <Text>I'd like to</Text>
        <Dropdown defaultOption="BUY" allOptions={["BUY", "SELL"]} />
        <Input
          fontFamily="Favorit"
          fontSize="0.8em"
          placeholder="0.00"
          width="15%"
          borderRadius="100px"
          type="number"
        />
        <Dropdown
          defaultOption={props.activeBaseTicker}
          allOptions={["WBTC", "WETH", "UNI", "CRV", "COMP", "APE"]}
        />
        <Text>for</Text>
        <Dropdown
          defaultOption={props.activeQuoteTicker}
          allOptions={["USDC", "USDT", "BUSD"]}
        />
        <Text>at the real-time midpoint.</Text>
      </HStack>
      <Button
        padding="20px"
        backgroundColor="transparent"
        fontSize="1.3em"
        fontWeight="200"
        color="white.80"
        border="var(--border)"
        borderRadius="100px"
        borderColor="border"
      >
        <HStack>
          <Text>Place Order</Text>
          <ArrowForwardIcon />
        </HStack>
      </Button>
    </Flex>
  );
}
