import React from "react";
import ReactDOM from "react-dom/client";

import MidpointPriceStreams from "./RelayerStreams/MidpointPriceStreams";

import "./fonts.css";
import "./animations.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import {
  ChakraProvider,
  ColorModeScript,
  type ThemeConfig,
  extendTheme,
} from "@chakra-ui/react";

const config: ThemeConfig = {
    initialColorMode: "system",
    useSystemColorMode: true,
  },
  styles = {
    global: {
      body: {
        fontFamily: "Favorit",
        fontWeight: "400",
        color: "white",
        bg: "#231F20",
      },
    },
  },
  theme = extendTheme({ config, styles });

function Testnet() {
  return (
    <MidpointPriceStreams
      displayedPairsTickers={[
        ["WETH", "USDC"],
        ["WBTC", "USDC"],
        // ["MPL", "USDC"],
        // ["UNI", "USDC"],
        // ["DYDX", "USDC"],
        // ["COMP", "USDC"],
        // ["SUSHI", "USDC"],
      ]}
    />
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
