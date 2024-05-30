const TOKENLIST_URL =
  "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/tokenlist.json"

const LOGO_OVERRIDES = [
  "WBTC",
  "WETH",
  "BNB",
  "MATIC",
  "FTM",
  "GNO",
  "CBETH",
  "LDO",
  "USDT",
  "BAND",
  "LINK",
  "CRV",
  "DYDX",
  "SUSHI",
  "1INCH",
  "BAL",
  "HFT",
  "TRU",
  "MPL",
  "SNX",
  "TORN",
  "REN",
  "STG",
  "QNT",
  "LRC",
  "BOBA",
  "AXS",
  "RARE",
  "SHIB",
  "PEOPLE",
  "OMG",
  "ENS",
  "GALA",
  "AUDIO",
  "RAD",
]

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
    for (const ticker of LOGO_OVERRIDES) {
      TICKER_TO_LOGO_URL[ticker] = `/tokens/${ticker.toLowerCase()}.png`
    }
    // Warn about missing logos
    for (const ticker in TICKER_TO_NAME_AND_DEFAULT_DECIMALS) {
      if (TICKER_TO_LOGO_URL[ticker] === undefined) {
        console.warn("Missing logo:", ticker)
      }
    }
    return TICKER_TO_LOGO_URL
  })
