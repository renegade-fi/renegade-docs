import React from "react";

import KeyStore, { KeyStoreState } from "../connections/KeyStore";

type KeyStoreContextType = [
  KeyStoreState,
  React.Dispatch<React.SetStateAction<KeyStoreState>>,
];
const KeyStoreContext = React.createContext<KeyStoreContextType>([
  KeyStore.default(),
  () => null,
]);
export default KeyStoreContext;
