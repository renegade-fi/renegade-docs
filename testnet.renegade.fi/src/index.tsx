import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import TradingInterface from "./components/TradingInterface";

import "./fonts.css";
import "./animations.css";

import {
  Box,
  ChakraProvider,
  ColorModeScript,
  type ThemeConfig,
  extendTheme,
} from "@chakra-ui/react";

// Chakra theme
const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};
const styles = {
  global: {
    body: {
      fontFamily: "Favorit",
      fontWeight: "400",
      color: "white",
      bg: "#231F20",
    },
  },
};
const theme = extendTheme({ config, styles });

function Testnet() {
  return (
    <Box minHeight="100vh" width="100vw" bg="#363031" borderRadius="10px">
      <TradingInterface />
    </Box>
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
  </ChakraProvider>
);
