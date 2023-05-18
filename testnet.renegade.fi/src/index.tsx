import { menuAnatomy } from "@chakra-ui/anatomy";
import {
  ChakraProvider,
  ColorModeScript,
  Flex,
  type ThemeConfig,
  createMultiStyleConfigHelpers,
  extendTheme,
  keyframes,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  AccountId,
  Keychain,
  Renegade,
  TaskId,
} from "@renegade-fi/renegade-js";
import { mainnet } from "@wagmi/chains";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { WagmiConfig, createClient } from "wagmi";

import DesktopFooter from "./components/Desktop/Footer";
import DesktopGlobalModal, {
  GlobalModalState,
} from "./components/Desktop/GlobalModal";
import DesktopHeader from "./components/Desktop/Header";
import DesktopTradingInterface from "./components/Desktop/TradingInterface";
import MobileBody from "./components/Mobile/Body";
import MobileHeader from "./components/Mobile/Header";
import RenegadeContext from "./contexts/RenegadeContext";
import "./css/animations.css";
import "./css/fonts.css";
import "./css/index.css";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

// Chakra theme
const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};

const gradientShiftAimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
     background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

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
      "rotate-left": {
        lineHeight: "1",
        transform: "rotate(180deg)",
        writingMode: "vertical-rl",
        textOrientation: "sideways",
      },
      "rotate-right": {
        lineHeight: "1",
        writingMode: "vertical-rl",
        textOrientation: "sideways",
      },
    },
  },
  Button: {
    variants: {
      "wallet-connect": {
        fontWeight: "400",
        fontSize: "1.1em",
        color: "white",
        background:
          "linear-gradient(135deg, #000000 0%,#3d3d3d 14%,#3d3d3d 14%,#111111 21%,#3d3d3d 39%,#010101 50%,#3d3d3d 61%,#161616 67%,#3d3d3d 80%,#212121 85%,#1b1b1b 100%)",
        backgroundSize: "400% 400%",
        animation: `${gradientShiftAimation} 45s ease infinite`,
        border: "var(--border)",
        borderColor: "white.20",
        _hover: {
          animationPlayState: "paused",
          borderColor: "white.60",
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
    // @ts-ignore
    chains,
  }),
);

// The global Renegade object
const renegade = new Renegade({
  relayerHostname: "127.0.0.1",
  relayerHttpPort: 3000,
  relayerWsPort: 4000,
  useInsecureTransport: true,
  verbose: false,
});

function Testnet() {
  // Task state for long-running relayer tasks
  const [taskId, setTaskId] = React.useState<TaskId>();
  const [taskState, setTaskState] = React.useState<string>();
  const toast = useToast();
  const setTask = async (newTaskId: TaskId) => {
    if (newTaskId === "DONE") {
      return;
    }
    setTaskId(newTaskId);
    setTaskState("Proving");
    toast({
      title: "New Task State",
      description: "Proving",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
    const callback = (message: string) => {
      const taskState = JSON.parse(message).state;
      setTaskState(taskState.state);
      toast({
        title: "New Task State",
        description: taskState.state,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    };
    await renegade.registerTaskCallback(callback, newTaskId);
  };

  // Renegade connection state
  const [accountId, setAccountId] = React.useState<AccountId>();
  const setAccount = async (
    oldAccountId: AccountId | undefined,
    keychain: Keychain | undefined,
  ) => {
    if (oldAccountId) {
      await renegade.unregisterAccount(oldAccountId);
    }
    if (!keychain) {
      setAccountId(undefined);
      return;
    }
    const accountId = renegade.registerAccount(keychain);
    const [taskId, taskJob] = await renegade.task.initializeAccount(accountId);
    setTask(taskId);
    await taskJob;
    setAccountId(accountId);
  };

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [globalModalState, setGlobalModalState] =
    React.useState<GlobalModalState>(null);

  // Selected order info state, saved in local storage
  const [activeDirection, setActiveDirection] = React.useState<"buy" | "sell">(
    // We randomly set initial buy/sell bit in order to discourage order
    // asymmetry for users who are trying the product for the first time
    localStorage.getItem("renegade-direction") || Math.random() < 0.5
      ? "buy"
      : "sell",
  );
  const [activeBaseTicker, setActiveBaseTicker] = React.useState(
    localStorage.getItem("renegade-base-ticker") || "WBTC",
  );
  const [activeQuoteTicker, setActiveQuoteTicker] = React.useState(
    localStorage.getItem("renegade-quote-ticker") || "USDC",
  );
  const [activeBaseTokenAmount, setActiveBaseTokenAmount] = React.useState(0);
  const setOrderInfo = (
    direction?: "buy" | "sell",
    baseTicker?: string,
    quoteTicker?: string,
    baseTokenAmount?: number,
  ) => {
    if (direction) {
      localStorage.setItem("renegade-direction", direction);
      setActiveDirection(direction);
    }
    if (baseTicker) {
      localStorage.setItem("renegade-base-ticker", baseTicker);
      setActiveBaseTicker(baseTicker);
    }
    if (quoteTicker) {
      localStorage.setItem("renegade-quote-ticker", quoteTicker);
      setActiveQuoteTicker(quoteTicker);
    }
    if (baseTokenAmount !== undefined) {
      setActiveBaseTokenAmount(baseTokenAmount || 0);
    }
  };

  const testnetDesktop = (
    <>
      <DesktopHeader
        onOpenGlobalModal={onOpen}
        setGlobalModalState={setGlobalModalState}
      />
      <DesktopTradingInterface
        onOpenGlobalModal={onOpen}
        isOpenGlobalModal={isOpen}
        setGlobalModalState={setGlobalModalState}
        activeDirection={activeDirection}
        activeBaseTicker={activeBaseTicker}
        activeQuoteTicker={activeQuoteTicker}
        activeBaseTokenAmount={activeBaseTokenAmount}
        setOrderInfo={setOrderInfo}
      />
      <DesktopFooter />
      <DesktopGlobalModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        globalModalState={globalModalState}
        setGlobalModalState={setGlobalModalState}
        activeDirection={activeDirection}
        activeBaseTicker={activeBaseTicker}
        activeQuoteTicker={activeQuoteTicker}
        activeBaseTokenAmount={activeBaseTokenAmount}
        setOrderInfo={setOrderInfo}
      />
    </>
  );
  const testnetMobile = (
    <>
      <MobileHeader />
      <MobileBody />
    </>
  );
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
        <RenegadeContext.Provider
          value={{
            renegade,
            accountId,
            taskId,
            taskState,
            setAccount,
            setTask,
          }}
        >
          <Flex
            flexDirection="column"
            width="100vw"
            minHeight="100vh"
            overflowX="hidden"
          >
            {useBreakpointValue({ base: testnetMobile, md: testnetDesktop })}
          </Flex>
        </RenegadeContext.Provider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}
ReactDOM.createRoot(root).render(
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
