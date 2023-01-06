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
        ["WBTC", "USDC"],
        ["WETH", "USDC"],
        ["BNB", "USDC"],
        ["MATIC", "USDC"],
        ["FTM", "USDC"],
        ["GNO", "USDC"],
        ["CBETH", "USDC"],
        ["LDO", "USDC"],
        ["USDC", "USDC"],
        ["USDT", "USDC"],
        ["BUSD", "USDC"],
        ["BAND", "USDC"],
        ["LINK", "USDC"],
        ["UNI", "USDC"],
        ["CRV", "USDC"],
        ["DYDX", "USDC"],
        ["SUSHI", "USDC"],
        ["1INCH", "USDC"],
        ["BAL", "USDC"],
        ["HFT", "USDC"],
        ["PERP", "USDC"],
        ["WOO", "USDC"],
        ["ZRX", "USDC"],
        ["AAVE", "USDC"],
        ["COMP", "USDC"],
        ["MKR", "USDC"],
        ["YFI", "USDC"],
        ["SPELL", "USDC"],
        ["TRU", "USDC"],
        ["MPL", "USDC"],
        ["SNX", "USDC"],
        ["REP", "USDC"],
        ["TORN", "USDC"],
        ["REN", "USDC"],
        ["STG", "USDC"],
        ["QNT", "USDC"],
        ["LRC", "USDC"],
        ["BOBA", "USDC"],
        ["APE", "USDC"],
        ["AXS", "USDC"],
        ["ENJ", "USDC"],
        ["RARE", "USDC"],
        ["SHIB", "USDC"],
        ["PEOPLE", "USDC"],
        ["OMG", "USDC"],
        ["GRT", "USDC"],
        ["ENS", "USDC"],
        ["MANA", "USDC"],
        ["GALA", "USDC"],
        ["RAD", "USDC"],
        ["AUDIO", "USDC"],
        ["BAT", "USDC"],
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
