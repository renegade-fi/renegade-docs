import React from "react";

import KeyStore from "../connections/KeyStore";

const KeyStoreContext = React.createContext(new KeyStore({}));
export default KeyStoreContext;
