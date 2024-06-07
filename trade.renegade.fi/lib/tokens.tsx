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
import { tokenMapping } from "@renegade-fi/react/constants"
import { StaticImageData } from "next/image"

export const HIDDEN_TICKERS = ["USDT", "REN"]
export const STABLECOINS = ["USDC", "USDT"]
export const DISPLAY_TOKENS = (
  options: {
    hideStables?: boolean
    hideHidden?: boolean
    hideTickers?: Array<string>
  } = {}
) => {
  const { hideStables, hideHidden = true, hideTickers = [] } = options
  let tokens = tokenMapping.tokens
  if (hideStables) {
    tokens = tokens.filter((token) => !STABLECOINS.includes(token.ticker))
  }
  if (hideHidden) {
    tokens = tokens.filter((token) => !HIDDEN_TICKERS.includes(token.ticker))
  }
  if (hideTickers.length > 0) {
    tokens = tokens.filter((token) => !hideTickers.includes(token.ticker))
  }
  return tokens
}

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

export const TICKER_TO_NAME_AND_DEFAULT_DECIMALS: {
  [key: string]: [string, number]
} = {
  USDC: ["USD Coin", 1],
  WETH: ["Ethereum", 4],
  WBTC: ["Bitcoin", 5],
  BNB: ["Binance Coin", 3],
  MATIC: ["Polygon", -1],
  LDO: ["Lido DAO", 1],
  CBETH: ["Coinbase Staked ETH", 4],
  LINK: ["Chainlink", 1],
  UNI: ["Uniswap", 1],
  CRV: ["Curve", -1],
  DYDX: ["dYdX Exchange", 1],
  AAVE: ["AAVE", 2],
  // FTM: ["Fantom", -1],
  // GNO: ["Gnosis", 2],
  USDT: ["Tether", 1],
  // BUSD: ["Binance USD", 1],
  // BAND: ["Band Protocol", 1],
  SUSHI: ["SushiSwap", 1],
  "1INCH": ["1inch ", -1],
  // BAL: ["Balancer", 1],
  // HFT: ["HashFlow", -1],
  // PERP: ["Perp Protocol", -1],
  // WOO: ["WOO Network", -1],
  // ZRX: ["0x", -1],
  COMP: ["Compound", 2],
  MKR: ["MakerDAO", 3],
  // YFI: ["Yearn Finance", 4],
  // SPELL: ["Spell Token", -4],
  // TRU: ["TrueFi", -2],
  // MPL: ["Maple", 1],
  // SNX: ["Synthetix", 1],
  // REP: ["Augur", 1],
  // TORN: ["Tornado Cash", 1],
  REN: ["Republic", -2],
  // STG: ["Stargate", -1],
  // QNT: ["Quant", 3],
  // LRC: ["Loopring", -1],
  // BOBA: ["BOBA Network", -1],
  // APE: ["ApeCoin", 1],
  // AXS: ["Axie Infinity", 1],
  // ENJ: ["Enjin", -1],
  // RARE: ["SuperRare", -1],
  // SHIB: ["Shiba Inu", -6],
  // PEOPLE: ["ConstitutionDAO", -2],
  // OMG: ["OMG Network", 1],
  // GRT: ["The Graph", -2],
  ENS: ["Ethereum Name Service", 2],
  MANA: ["Decentraland", -1],
  // GALA: ["Gala", -2],
  // RAD: ["Radicle", 1],
  // AUDIO: ["Audius", -1],
  // BAT: ["Basic Attention Token", -1],
}

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
