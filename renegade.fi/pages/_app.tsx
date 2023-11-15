import type { AppProps } from "next/app"
import {
  ChakraProvider,
  ColorModeScript,
  ThemeConfig,
  extendTheme,
} from "@chakra-ui/react"

import "../styles/animations.css"
import "../styles/fonts.css"

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
}
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
}
const theme = extendTheme({ config, styles })
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
