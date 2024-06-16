import { PriceLevel } from "@/lib/price-simulation"

export const dynamic = "force-dynamic"
export const runtime = "edge"

/**
 * We want this to run as close as possible to the user,
 * so we include all the regions supported by the Binance API.
 */
export const preferredRegion = [
  "arn1",
  "bom1",
  "cdg1",
  "cpt1",
  "dub1",
  "fra1",
  "gru1",
  "hkg1",
  "hnd1",
  "icn1",
  "kix1",
  "lhr1",
  "sin1",
  "syd1",
]

/** The URL of the Binance API endpoint that returns the current orderbook for a given symbol & depth */
const BINANCE_DEPTH_URL = "https://api.binance.com/api/v3/depth"

/** The response from the Binance API */
type BinanceOrderbookResponse = {
  lastUpdateId: number
  bids: [string, string][]
  asks: [string, string][]
}

/** The reponse data from this route */
type OrderbookResponseData = {
  bids: PriceLevel[]
  asks: PriceLevel[]
}

/**
 * The GET handler for this route, which fetches the current Binance orderbook
 * for the given pair, and returns it in the expected format.
 */
export async function GET(request: Request): Promise<Response> {
  try {
    const symbol = getPairSymbolFromRequest(request)
    console.log(`symbol: ${symbol}`)
    const binanceOrderbook = await fetchBinanceOrderbook(symbol)
    console.log(`binanceOrderbook: ${binanceOrderbook}`)
    const orderbookRes = convertOrderbook(binanceOrderbook)
    console.log(`orderbookRes: ${orderbookRes}`)

    return new Response(JSON.stringify(orderbookRes), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
}

/**
 * Parses the base and quote tickers from the request's query parameters,
 * and remaps them to corresponding pair symbols that Binance expects.
 */
function getPairSymbolFromRequest(request: Request): string {
  const requestUrl = new URL(request.url)
  const base_ticker = requestUrl.searchParams.get("base_ticker")?.toUpperCase()
  const quote_ticker = requestUrl.searchParams
    .get("quote_ticker")
    ?.toUpperCase()

  if (!base_ticker || !quote_ticker) {
    throw new Error("Missing base_ticker or quote_ticker query parameter")
  }

  const base = remapTickerName(base_ticker)
  const quote = remapTickerName(quote_ticker)

  return `${base}${quote}`
}

/** Remaps the given ticker name to the corresponding asset in Binance */
function remapTickerName(ticker: string) {
  if (ticker === "WBTC") {
    return "BTC"
  } else if (ticker === "WETH") {
    return "ETH"
  } else if (ticker === "USDC") {
    return "USDT"
  }
  return ticker
}

/**
 * Fetches the current Binance orderbook for the given pair symbol,
 * up to the maximum supported depth (5000 levels).
 */
async function fetchBinanceOrderbook(
  symbol: string
): Promise<BinanceOrderbookResponse> {
  const binance_url = new URL(BINANCE_DEPTH_URL)
  binance_url.searchParams.set("symbol", symbol)
  binance_url.searchParams.set("limit", "5000")

  console.log(`binance_url: ${binance_url}`)

  const res = await fetch(binance_url)
  const text = await res.clone().text()
  console.log(`res: ${text}`)
  return res.json()
}

/** Converts the Binance orderbook data to the expected format */
function convertOrderbook(
  binanceOrderbook: BinanceOrderbookResponse
): OrderbookResponseData {
  const bids = binanceOrderbook.bids.map(parsePriceLevel)
  const asks = binanceOrderbook.asks.map(parsePriceLevel)
  return { bids, asks }
}

/** Parses a price level from the Binance orderbook into our `PriceLevel` type */
function parsePriceLevel(rawPriceLevel: [string, string]): PriceLevel {
  return {
    price: parseFloat(rawPriceLevel[0]),
    quantity: parseFloat(rawPriceLevel[1]),
  }
}
