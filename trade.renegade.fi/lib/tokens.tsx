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

export const ADDR_TO_TICKER: { [key in string]: string } = {
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": "WBTC",
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": "WETH",
  "0xb8c77482e45f1f44de1745f52c74426c631bdd52": "BNB",
  "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0": "MATIC",
  "0x4e15361fd6b4bb609fa63c81a2be19d873717870": "FTM",
  "0x6810e776880c02933d47db1b9fc05908e5386b96": "GNO",
  "0xbe9895146f7af43049ca1c1ae358b0541ea49704": "CBETH",
  "0x5a98fcbea516cf06857215779fd812ca3bef1b32": "LDO",
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "USDC",
  "0xdac17f958d2ee523a2206206994597c13d831ec7": "USDT",
  "0x4fabb145d64652a948d72533023f6e7a623c7c53": "BUSD",
  "0xba11d00c5f74255f56a5e366f4f77f5a186d7f55": "BAND",
  "0x514910771af9ca656af840dff83e8264ecf986ca": "LINK",
  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984": "UNI",
  "0xd533a949740bb3306d119cc777fa900ba034cd52": "CRV",
  "0x92d6c1e31e14520e676a687f0a93788b716beff5": "DYDX",
  "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2": "SUSHI",
  "0x111111111117dc0aa78b770fa6a738034120c302": "1INCH",
  "0xba100000625a3754423978a60c9317c58a424e3d": "BAL",
  "0xb3999f658c0391d94a37f7ff328f3fec942bcadc": "HFT",
  "0xbc396689893d065f41bc2c6ecbee5e0085233447": "PERP",
  "0x4691937a7508860f876c9c0a2a617e7d9e945d4b": "WOO",
  "0xe41d2489571d322189246dafa5ebde1f4699f498": "ZRX",
  "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9": "AAVE",
  "0xc00e94cb662c3520282e6f5717214004a7f26888": "COMP",
  "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2": "MKR",
  "0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e": "YFI",
  "0x090185f2135308bad17527004364ebcc2d37e5f6": "SPELL",
  "0x4c19596f5aaff459fa38b0f7ed92f11ae6543784": "TRU",
  "0x33349b282065b0284d756f0577fb39c158f935e6": "MPL",
  "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f": "SNX",
  "0x221657776846890989a759ba2973e427dff5c9bb": "REP",
  "0x77777feddddffc19ff86db637967013e6c6a116c": "TORN",
  "0x408e41876cccdc0f92210600ef50372656052a38": "REN",
  "0xaf5191b0de278c7286d6c7cc6ab6bb8a73ba2cd6": "STG",
  "0x4a220e6096b25eadb88358cb44068a3248254675": "QNT",
  "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd": "LRC",
  "0x42bbfa2e77757c645eeaad1655e0911a7553efbc": "BOBA",
  "0x4d224452801aced8b2f0aebe155379bb5d594381": "APE",
  "0xbb0e17ef65f82ab018d8edd776e8dd940327b28b": "AXS",
  "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c": "ENJ",
  "0xba5bde662c17e2adff1075610382b9b691296350": "RARE",
  "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce": "SHIB",
  "0x7a58c0be72be218b41c608b7fe7c5bb630736c71": "PEOPLE",
  "0xd26114cd6ee289accf82350c8d8487fedb8a0c07": "OMG",
  "0xc944e90c64b2c07662a292be6244bdf05cda44a7": "GRT",
  "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72": "ENS",
  "0x0f5d2fb29fb7d3cfee444a200298f468908cc942": "MANA",
  "0x15d4c048f83bd7e37d49ea4c83a07267ec4203da": "GALA",
  "0x31c8eacbffdd875c74b94b077895bd78cf1e64a3": "RAD",
  "0x18aaa7115705e8be94bffebde57af9bfc265b998": "AUDIO",
  "0x0d8775f648430679a709e98d2b0cb6250d2887ef": "BAT",
}

export const TICKER_TO_ADDR: { [key in string]: string } = {}
for (const addr in ADDR_TO_TICKER) {
  TICKER_TO_ADDR[ADDR_TO_TICKER[addr]] = addr
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
  // USDT: ["Tether", 1],
  // BUSD: ["Binance USD", 1],
  // BAND: ["Band Protocol", 1],
  // SUSHI: ["SushiSwap", 1],
  // "1INCH": ["1inch ", -1],
  // BAL: ["Balancer", 1],
  // HFT: ["HashFlow", -1],
  // PERP: ["Perp Protocol", -1],
  // WOO: ["WOO Network", -1],
  // ZRX: ["0x", -1],
  // COMP: ["Compound", 2],
  // MKR: ["MakerDAO", 3],
  // YFI: ["Yearn Finance", 4],
  // SPELL: ["Spell Token", -4],
  // TRU: ["TrueFi", -2],
  // MPL: ["Maple", 1],
  // SNX: ["Synthetix", 1],
  // REP: ["Augur", 1],
  // TORN: ["Tornado Cash", 1],
  // REN: ["Republic", -2],
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
  // ENS: ["Ethereum Name Service", 2],
  // MANA: ["Decentraland", -1],
  // GALA: ["Gala", -2],
  // RAD: ["Radicle", 1],
  // AUDIO: ["Audius", -1],
  // BAT: ["Basic Attention Token", -1],
}

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

export const KATANA_TOKEN_REMAP: { [key in string]: string } = {
  "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7":
    TICKER_TO_ADDR["WETH"],
  "0x8e3feea13add88dce4439bc1d02a662ab4c4cb6dca4639dccba89b4e594680":
    TICKER_TO_ADDR["USDC"],
}
export const KATANA_TICKER_TO_ADDR: { [key in string]: string } = {
  ...TICKER_TO_ADDR,
}
for (const addr in KATANA_TOKEN_REMAP) {
  KATANA_TICKER_TO_ADDR[ADDR_TO_TICKER[KATANA_TOKEN_REMAP[addr]]] = addr
}
export const KATANA_ADDRESS_TO_TICKER: { [key in string]: string } = {
  ...ADDR_TO_TICKER,
}
for (const addr in KATANA_TOKEN_REMAP) {
  KATANA_ADDRESS_TO_TICKER[addr] = ADDR_TO_TICKER[KATANA_TOKEN_REMAP[addr]]
}

export const TICKER_TO_LOGO_URL_HANDLE = fetch(TOKENLIST_URL)
  .then((resp) => resp.json())
  .then((data) => {
    let TICKER_TO_LOGO_URL: { [key in string]: string } = {}
    // Process all logos from TrustWallet
    for (const token of data.tokens) {
      let ticker = ADDR_TO_TICKER[token.address.toLowerCase()]
      if (ticker !== undefined) {
        TICKER_TO_LOGO_URL[ticker] = token.logoURI
      }
    }
    // Put in some manual overrides, for unaesthetic or missing logos
    for (const ticker in LOGO_URL_OVERRIDES) {
      //   TICKER_TO_LOGO_URL[ticker] = LOGO_URL_OVERRIDES[ticker];
      TICKER_TO_LOGO_URL[ticker] = LOGO_URL_OVERRIDES[ticker].src
    }
    // Warn about missing logos
    for (const ticker in TICKER_TO_ADDR) {
      if (TICKER_TO_LOGO_URL[ticker] === undefined) {
        console.warn("Missing logo:", ticker)
      }
    }
    return TICKER_TO_LOGO_URL
  })
