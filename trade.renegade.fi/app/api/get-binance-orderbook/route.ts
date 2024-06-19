import { PriceLevel } from "@/lib/price-simulation"

/** The URL of the Amberdata REST API */
const AMBERDATA_BASE_URL = "https://api.amberdata.com"

/** The API endpoint for spot market orderbook snapshots */
const AMBERDATA_ORDERBOOK_SNAPSHOTS_ROUTE = "markets/spot/order-book-snapshots"

/** The Amberdata API key header */
const API_KEY_HEADER = "x-api-key"

/** The identifier for the Binance exchange in the Amberdata API */
const BINANCE_EXCHANGE_ID = "binance"

/**
 * The response from the Amberdata API.
 * This type only specifies the subset of the response data
 * we are interested in.
 */
type AmberdataOrderbookResponse = {
  payload: {
    data: {
      timestamp: number
      ask: AmberdataPriceLevel[]
      bid: AmberdataPriceLevel[]
    }[]
  }
}

/**
 * Amberdata's format for an orderbook price level
 */
type AmberdataPriceLevel = {
  price: number
  volume: number
}

/** The reponse data from this route */
type OrderbookResponseData = {
  timestamp: number
  bids: PriceLevel[]
  asks: PriceLevel[]
}

/**
 * The GET handler for this route, which fetches the current Binance orderbook
 * for the given pair, and returns it in the expected format.
 */
export async function GET(request: Request): Promise<Response> {
  try {
    const instrument = getInstrumentFromRequest(request)
    const timestamp = getTimestampFromRequest(request)

    const binanceOrderbook = await fetchBinanceOrderbook(instrument, timestamp)
    console.log(binanceOrderbook)

    // TODO: Apply updates to get as close to timestamp as possible

    const orderbookRes = convertOrderbook(binanceOrderbook)

    return new Response(JSON.stringify(orderbookRes))
  } catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
}

/**
 * Parses the base and quote tickers from the request's query parameters,
 * and remaps them to corresponding instrument that Amberdata expects
 */
function getInstrumentFromRequest(request: Request): string {
  const requestUrl = new URL(request.url)
  const base_ticker = requestUrl.searchParams.get("base_ticker")?.toLowerCase()
  const quote_ticker = requestUrl.searchParams
    .get("quote_ticker")
    ?.toLowerCase()

  if (!base_ticker || !quote_ticker) {
    throw new Error("Missing base_ticker or quote_ticker query parameter")
  }

  const base = remapTickerName(base_ticker)
  const quote = remapTickerName(quote_ticker)

  return `${base}_${quote}`
}

/**
 * Parses the base and quote tickers from the request's query parameters,
 * and remaps them to corresponding instrument that Amberdata expects
 */
function getTimestampFromRequest(request: Request): number {
  const requestUrl = new URL(request.url)
  const timestamp = requestUrl.searchParams.get("timestamp")

  if (!timestamp) {
    throw new Error("Missing timestamp query parameter")
  }

  return parseInt(timestamp)
}

/** Remaps the given ticker name to the corresponding instrument fragment in Amberdata */
function remapTickerName(ticker: string) {
  if (ticker === "wbtc") {
    return "btc"
  } else if (ticker === "weth") {
    return "eth"
  } else if (ticker === "usdc") {
    return "usdt"
  }
  return ticker
}

/**
 * Fetches the current Binance orderbook for the given pair symbol,
 * up to the maximum supported depth (5000 levels).
 */
async function fetchBinanceOrderbook(
  instrument: string,
  timestamp: number
): Promise<AmberdataOrderbookResponse> {
  let searchParams = [
    ["exchange", BINANCE_EXCHANGE_ID],
    ["timeFormat", "milliseconds"],

    // For the search range, we set [timestamp - 1min, timestamp + 1).
    // This is to ensure that we get the most recent snapshot inclusive of the timestamp
    // in the response
    ["startDate", (timestamp - 60000).toString()],
    ["endDate", (timestamp + 1).toString()],
  ] as [string, string][]

  const req = await amberdataRequest(
    `${AMBERDATA_ORDERBOOK_SNAPSHOTS_ROUTE}/${instrument}`,
    searchParams
  )

  const res = await fetch(req)
  return res.json()
}

/**
 * Constructs an Amberdata API GET request for the given route & search parameters,
 * setting the API key header appropriately
 */
async function amberdataRequest(
  route: string,
  searchParams: [string, string][]
): Promise<Request> {
  const amberdataUrl = new URL(`${AMBERDATA_BASE_URL}/${route}`)
  for (const [key, value] of searchParams) {
    amberdataUrl.searchParams.set(key, value)
  }
  let amberdataReq = new Request(amberdataUrl)
  amberdataReq.headers.set(
    API_KEY_HEADER,
    process.env.AMBERDATA_API_KEY as string
  )

  return amberdataReq
}

/** Converts the Binance orderbook data to the expected format */
function convertOrderbook(
  binanceOrderbook: AmberdataOrderbookResponse
): OrderbookResponseData {
  let data = binanceOrderbook.payload.data
  let lastIdx = data.length - 1
  const bids = data[lastIdx].bid.map(parsePriceLevel)
  const asks = data[lastIdx].ask.map(parsePriceLevel)
  const timestamp = data[lastIdx].timestamp
  return { bids, asks, timestamp }
}

/** Parses a price level from the Binance orderbook into our `PriceLevel` type */
function parsePriceLevel(amberdataPriceLevel: AmberdataPriceLevel): PriceLevel {
  return {
    price: amberdataPriceLevel.price,
    quantity: amberdataPriceLevel.volume,
  }
}
