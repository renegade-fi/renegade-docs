import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";

import PlaceOrderModal from "./Modals/PlaceOrder";
import SignInModal from "./Modals/SignIn";

export type GlobalModalState =
  | null
  | "sign-in"
  | "deposit"
  | "withdraw"
  | "place-order";

interface GlobalModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  globalModalState: GlobalModalState;
  setGlobalModalState: (state: GlobalModalState) => void;
}
export default function GlobalModal(props: GlobalModalProps) {
  const headerString = {
    "sign-in": "Unlock your Wallet",
    deposit: "Transfer Funds",
    widthdraw: "Transfer Funds",
    "place-order": "Confirm your Order",
  }[props.globalModalState || ""];
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered size="sm">
      <ModalOverlay
        background="rgba(0, 0, 0, 0.25)"
        backdropFilter="blur(8px)"
      />
      <ModalContent borderRadius="10px" background="brown">
        <ModalHeader paddingBottom="0">{headerString}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {props.globalModalState === "sign-in" && (
            <SignInModal onClose={props.onClose} />
          )}
          {props.globalModalState === "place-order" && (
            <PlaceOrderModal onClose={props.onClose} />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
