import { tokenMappings } from "@renegade-fi/renegade-js"
import { StaticImageData } from "next/image"

import inchLogo from "@/icons/tokens/1inch.png"
import audioLogo from "@/icons/tokens/audio.png"
import axsLogo from "@/icons/tokens/axs.png"
import balLogo from "@/icons/tokens/bal.png"
import bandLogo from "@/icons/tokens/band.png"
import bnbLogo from "@/icons/tokens/bnb.png"
import bobaLogo from "@/icons/tokens/boba.png"
import cbethLogo from "@/icons/tokens/cbeth.png"
import crvLogo from "@/icons/tokens/crv.png"
import dydxLogo from "@/icons/tokens/dydx.png"
import ensLogo from "@/icons/tokens/ens.png"
import ftmLogo from "@/icons/tokens/ftm.png"
import galaLogo from "@/icons/tokens/gala.png"
import gnoLogo from "@/icons/tokens/gno.png"
import hftLogo from "@/icons/tokens/hft.png"
import ldoLogo from "@/icons/tokens/ldo.png"
import linkLogo from "@/icons/tokens/link.png"
import lrcLogo from "@/icons/tokens/lrc.png"
import maticLogo from "@/icons/tokens/matic.png"
import mplLogo from "@/icons/tokens/mpl.png"
import omgLogo from "@/icons/tokens/omg.png"
import peopleLogo from "@/icons/tokens/people.png"
import qntLogo from "@/icons/tokens/qnt.png"
import radLogo from "@/icons/tokens/rad.png"
import rareLogo from "@/icons/tokens/rare.png"
import renLogo from "@/icons/tokens/ren.png"
import shibLogo from "@/icons/tokens/shib.png"
import snxLogo from "@/icons/tokens/snx.png"
import stgLogo from "@/icons/tokens/stg.png"
import sushiLogo from "@/icons/tokens/sushi.png"
import tornLogo from "@/icons/tokens/torn.png"
import truLogo from "@/icons/tokens/tru.png"
import usdtLogo from "@/icons/tokens/usdt.png"
import wbtcLogo from "@/icons/tokens/wbtc.png"
import wethLogo from "@/icons/tokens/weth.png"

const TOKENLIST_URL =
  "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/tokenlist.json"

const LOGO_URL_OVERRIDES: { [key in string]: StaticImageData } = {
  WBTC: wbtcLogo,
  WETH: wethLogo,
  BNB: bnbLogo,
  MATIC: maticLogo,
  FTM: ftmLogo,
  GNO: gnoLogo,
  CBETH: cbethLogo,
  LDO: ldoLogo,
  USDT: usdtLogo,
  BAND: bandLogo,
  LINK: linkLogo,
  CRV: crvLogo,
  DYDX: dydxLogo,
  SUSHI: sushiLogo,
  "1INCH": inchLogo,
  BAL: balLogo,
  HFT: hftLogo,
  TRU: truLogo,
  MPL: mplLogo,
  SNX: snxLogo,
  TORN: tornLogo,
  REN: renLogo,
  STG: stgLogo,
  QNT: qntLogo,
  LRC: lrcLogo,
  BOBA: bobaLogo,
  AXS: axsLogo,
  RARE: rareLogo,
  SHIB: shibLogo,
  PEOPLE: peopleLogo,
  OMG: omgLogo,
  ENS: ensLogo,
  GALA: galaLogo,
  AUDIO: audioLogo,
  RAD: radLogo,
}

const TICKER_TO_NAME_AND_DEFAULT_DECIMALS: { [key: string]: [string, number] } =
  {}

tokenMappings.tokens.forEach((token) => {
  // Assuming you want to use the 'decimals' value from the tokens as the default decimal
  // If you have a different rule for default decimals, apply it here
  TICKER_TO_NAME_AND_DEFAULT_DECIMALS[token.ticker] = [token.name, 2]
})

export const DISPLAYED_TICKERS: [string, string][] = Object.keys(
  TICKER_TO_NAME_AND_DEFAULT_DECIMALS
).map((ticker: string) => [ticker, "USDC"])

export const TICKER_TO_NAME: { [key in string]: string } = {}
export const TICKER_TO_DEFAULT_DECIMALS: { [key in string]: number } = {}
for (const ticker in TICKER_TO_NAME_AND_DEFAULT_DECIMALS) {
  TICKER_TO_NAME[ticker] = TICKER_TO_NAME_AND_DEFAULT_DECIMALS[ticker][0]
  TICKER_TO_DEFAULT_DECIMALS[ticker] =
    TICKER_TO_NAME_AND_DEFAULT_DECIMALS[ticker][1]
}

export const TICKER_TO_LOGO_URL_HANDLE = fetch(TOKENLIST_URL)
  .then((resp) => resp.json())
  .then((data) => {
    let TICKER_TO_LOGO_URL: { [key in string]: string } = {}
    // Process all logos from TrustWallet
    for (const token of data.tokens) {
      TICKER_TO_LOGO_URL[token.symbol] = token.logoURI
    }
    // Put in some manual overrides, for unaesthetic or missing logos
    for (const ticker in LOGO_URL_OVERRIDES) {
      TICKER_TO_LOGO_URL[ticker] = LOGO_URL_OVERRIDES[ticker].src
    }
    // Warn about missing logos
    for (const ticker in TICKER_TO_NAME_AND_DEFAULT_DECIMALS) {
      if (TICKER_TO_LOGO_URL[ticker] === undefined) {
        console.warn("Missing logo:", ticker)
      }
    }
    return TICKER_TO_LOGO_URL
  })
