import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom/client";
import React from "react";

import {
  Flex,
  ChakraProvider,
  ColorModeScript,
  type ThemeConfig,
  extendTheme,
} from "@chakra-ui/react";

import TradingInterface from "./components/TradingInterface";
import Header from "./components/Header";
import Footer from "./components/Footer";

import "./animations.css";
import "./index.css";
import "./fonts.css";

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
      color: "white",
      bg: "black",
    },
  },
};
const colors = {
  border: "#808080",
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
};
const theme = extendTheme({ config, styles, colors });

function Testnet() {
  return (
    <Flex flexDirection="column" width="100vw" minHeight="100vh" bg="black">
      <Header />
      <TradingInterface />
      <Footer />
    </Flex>
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
