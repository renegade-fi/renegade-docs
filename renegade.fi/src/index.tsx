import {
  ChakraProvider,
  ColorModeScript,
  type ThemeConfig,
  extendTheme,
} from "@chakra-ui/react";
import mixpanel from "mixpanel-browser";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LandingPageDesktop from "./LandingPage/LandingPageDesktop";
import LandingPageMobile from "./LandingPage/LandingPageMobile";
import "./animations.css";
import "./fonts.css";

mixpanel.init("91787e297d629eae158b8fcf156c845f");
mixpanel.track("Initialization");

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};
const styles = {
  global: {
    body: {
      fontFamily: "Favorit Extended",
      fontWeight: "400",
      fontSize: "calc(0.2 * (2vw + 70px))" /* 1.4vw */,
      color: "white",
      bg: "black",
    },
  },
};
const theme = extendTheme({ config, styles });

function LandingPage() {
  const [width, setWidth] = React.useState<number>(window.innerWidth);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  React.useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);
  return width <= 768 ? <LandingPageMobile /> : <LandingPageDesktop />;
}

interface ExternalNavigateProps {
  to: string;
}
class ExternalNavigate extends React.Component<ExternalNavigateProps> {
  componentDidMount() {
    window.open(this.props.to, "_self");
  }

  render() {
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/whitepaper"
            element={<ExternalNavigate to="/whitepaper.pdf" />}
          />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
);
