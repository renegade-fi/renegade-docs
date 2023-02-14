import { Flex, Text } from "@chakra-ui/react";
import React from "react";

// interface PlaceOrderModalProps {
//   onClose: () => void;
// }
export default function PlaceOrderModal() {
  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <Text fontSize="0.9em" color="white.60">
        Place Order
      </Text>
    </Flex>
  );
}
