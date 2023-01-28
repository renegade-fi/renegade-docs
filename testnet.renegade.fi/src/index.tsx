import { menuAnatomy } from "@chakra-ui/anatomy";
import {
  ChakraProvider,
  ColorModeScript,
  Flex,
  type ThemeConfig,
  createMultiStyleConfigHelpers,
  extendTheme,
  useDisclosure,
} from "@chakra-ui/react";
import { mainnet } from "@wagmi/chains";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { WagmiConfig, createClient } from "wagmi";

import "./animations.css";
import Footer from "./components/Footer";
import GlobalModal from "./components/GlobalModal";
import Header from "./components/Header";
import TradingInterface from "./components/TradingInterface";
import KeyStore from "./connections/KeyStore";
import KeyStoreContext from "./contexts/KeyStoreContext";
import "./fonts.css";
import "./index.css";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

// Chakra theme
const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

const styles = {
  global: {
    body: {
      fontFamily: "Favorit Extended",
      fontWeight: "400",
      fontSize: "0.9em",
      color: "white",
      bg: "black",
    },
  },
};

const colors = {
  border: "#808080",
  green: "#43e043",
  red: "#e04943",
  brown: "#231f20",
  "brown.light": "#372f2f",
  "white.100": "#ffffff",
  "white.90": "#e6e6e6",
  "white.80": "#cccccc",
  "white.70": "#b3b3b3",
  "white.60": "#999999",
  "white.50": "#808080",
  "white.40": "#666666",
  "white.30": "#4d4d4d",
  "white.20": "#333333",
  "white.10": "#1a1a1a",
  "white.5": "#0d0d0d",
};

const menuStyle = definePartsStyle({
  list: {
    minWidth: "auto",
    padding: "0",
    background: "transparent",
  },
  item: {
    minWidth: "auto",
    padding: "0",
    background: "transparent",
    fontSize: "1.3em",
    color: "white.100",
    _hover: {
      background: "rgba(255, 255, 255, 0.05)",
    },
    _focus: {
      background: "rgba(255, 255, 255, 0.05)",
    },
  },
});

const components = {
  Text: {
    variants: {
      "status-green": {
        fontSize: "0.85em",
        fontWeight: "700",
        color: "green",
        textShadow: "0 0 5px green",
      },
      "status-red": {
        fontSize: "0.85em",
        fontWeight: "700",
        color: "red",
        textShadow: "0 0 5px red",
      },
      "status-gray": {
        fontSize: "0.85em",
        fontWeight: "700",
        color: "white.30",
      },
      "trading-body-button": {
        fontFamily: "Aime",
        fontSize: "1.3em",
        fontWeight: "700",
        color: "white.100",
      },
      "trading-body-button-blurred": {
        fontFamily: "Aime",
        fontSize: "1.3em",
        fontWeight: "700",
        color: "white.50",
      },
    },
  },
  Button: {
    variants: {
      "wallet-connect": {
        fontWeight: "400",
        fontSize: "1.1em",
        color: "white",
        _hover: {
          background: "brown",
        },
      },
    },
  },
  Menu: defineMultiStyleConfig({ baseStyle: menuStyle }),
};
const theme = extendTheme({ config, styles, colors, components });

// Create a ConnectKit client
const infuraId = process.env.ETHEREUM_MAINNET_INFURA_ID;
const chains = [mainnet];
const client = createClient(
  getDefaultClient({
    appName: "Renegade",
    infuraId,
    chains,
  }),
);

function Testnet() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [keyStoreState, setKeyStoreState] = React.useState(KeyStore.default());
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider
        customTheme={{
          "--ck-overlay-background": "rgba(0, 0, 0, 0.25)",
          "--ck-overlay-backdrop-filter": "blur(8px)",
          "--ck-font-family": "Favorit",
          "--ck-border-radius": "10px",
          "--ck-body-background": "#231f20",
          "--ck-body-background-secondary": "#372f2f",
          "--ck-focus-color": "#ffffff",
        }}
      >
        <KeyStoreContext.Provider value={[keyStoreState, setKeyStoreState]}>
          <Flex flexDirection="column" width="100vw" minHeight="100vh">
            <Header onOpenGlobalModal={onOpen} />
            <TradingInterface />
            <Footer />
            <GlobalModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
          </Flex>
        </KeyStoreContext.Provider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Testnet />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>,
);
