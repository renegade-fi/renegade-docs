import { PriceLevel } from "@/lib/price-simulation"

// -------------
// | CONSTANTS |
// -------------

/** The URL of the Amberdata REST API */
const AMBERDATA_BASE_URL = "https://api.amberdata.com"
/** The API endpoint for spot market orderbook snapshots */
const AMBERDATA_ORDERBOOK_SNAPSHOTS_ROUTE = "markets/spot/order-book-snapshots"
/** The API endpoint for spot market orderbook updates */
const AMBERDATA_ORDERBOOK_UPDATES_ROUTE = "markets/spot/order-book-events"

/** The Amberdata API key header */
const API_KEY_HEADER = "x-api-key"

/** The search parameter indicating the exchange to make a request for */
const EXCHANGE_PARAM = "exchange"
/** The identifier for the Binance exchange in the Amberdata API */
const BINANCE_EXCHANGE_ID = "binance"

/** The search parameter indicating the timestamp format for the Amberdata API to use */
const TIME_FORMAT_PARAM = "timeFormat"
/** The format for timestamps returned from the Amberdata API */
const TIME_FORMAT = "milliseconds"

/** The search parameter indicating the start date for the Amberdata API to use */
const START_DATE_PARAM = "startDate"
/** The search parameter indicating the end date for the Amberdata API to use */
const END_DATE_PARAM = "endDate"

// ---------
// | TYPES |
// ---------

/**
 * Amberdata's API response for an orderbook snapshot.
 * This type only specifies the subset of the response data
 * we are interested in.
 */
type AmberdataOrderbookSnapshotResponse = {
  payload: {
    data: AmberdataOrderbookSnapshot[]
  }
}

/** Amberdata's format for an orderbook snapshot */
type AmberdataOrderbookSnapshot = {
  timestamp: number
  ask: AmberdataPriceLevel[]
  bid: AmberdataPriceLevel[]
}

/**
 * Amberdata's API response for an orderbook update.
 * This type only specifies the subset of the response data
 * we are interested in.
 */
type AmberdataOrderbookUpdateResponse = {
  payload: {
    data: AmberdataOrderbookUpdate[]
  }
}

/** Amberdata's format for an orderbook update */
type AmberdataOrderbookUpdate = {
  exchangeTimestamp: number
  ask: AmberdataPriceLevel[]
  bid: AmberdataPriceLevel[]
}

/**
 * Amberdata's format for an orderbook price level
 */
type AmberdataPriceLevel = {
  price: number
  volume: number
}

/**
 * An intermediary representation of an orderbook, mapping prices to quantities.
 * This is useful for applying updates onto a snapshot efficiently.
 */
type OrderbookMap = {
  bids: {
    [price: number]: number
  }
  asks: {
    [price: number]: number
  }
}

/** The reponse data from this route */
export type OrderbookResponseData = {
  timestamp: number
  bids: PriceLevel[]
  asks: PriceLevel[]
}

// -----------
// | HANDLER |
// -----------

/**
 * The GET handler for this route, which fetches the current Binance orderbook
 * for the given pair, and returns it in the expected format.
 */
export async function GET(request: Request): Promise<Response> {
  try {
    const instrument = getInstrumentFromRequest(request)
    const timestamp = getTimestampFromRequest(request)

    const orderbookRes = await constructBinanceOrderbook(instrument, timestamp)

    return new Response(JSON.stringify(orderbookRes))
  } catch (e: any) {
    return new Response(e.message, { status: 500 })
  }
}

// -----------
// | HELPERS |
// -----------

/**
 * Parses the base and quote tickers from the request's query parameters,
 * and remaps them to corresponding instrument that Amberdata expects
 */
function getInstrumentFromRequest(request: Request): string {
  const requestUrl = new URL(request.url)
  const baseTicker = requestUrl.searchParams.get("base_ticker")?.toLowerCase()
  const quoteTicker = requestUrl.searchParams.get("quote_ticker")?.toLowerCase()

  if (!baseTicker || !quoteTicker) {
    throw new Error("Missing base_ticker or quote_ticker query parameter")
  }

  const base = remapTickerName(baseTicker)
  const quote = remapTickerName(quoteTicker)

  return `${base}_${quote}`
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

/** Parses the timestamp from the request's query parameters */
function getTimestampFromRequest(request: Request): number {
  const requestUrl = new URL(request.url)
  const timestamp = requestUrl.searchParams.get("timestamp")

  if (!timestamp) {
    throw new Error("Missing timestamp query parameter")
  }

  return parseInt(timestamp)
}

/**
 * Construct the Binance orderbook for the given instrument, at the given timestamp.
 * This is done by fetching the most recent orderbook snapshot relative to the
 * timestamp, then fetching all of the updates between the snapshot and the timestamp,
 * and applying them on top of the snapshot.
 */
async function constructBinanceOrderbook(
  instrument: string,
  timestamp: number
): Promise<OrderbookResponseData> {
  const snapshot = await fetchBinanceOrderbookSnapshot(instrument, timestamp)
  const updates = await fetchBinanceOrderbookUpdates(
    instrument,
    snapshot.timestamp,
    timestamp
  )

  // Construct an initial orderbook map from the snapshot
  let orderbookMap: OrderbookMap = {
    bids: {},
    asks: {},
  }
  snapshot.bid.forEach((level) => {
    orderbookMap.bids[level.price] = level.volume
  })
  snapshot.ask.forEach((level) => {
    orderbookMap.asks[level.price] = level.volume
  })

  // Apply the updates to the map
  // (they are given in ascending order by time, i.e. most recent is last)
  updates.forEach((update) => {
    update.bid.forEach((level) => {
      orderbookMap.bids[level.price] = level.volume
    })
    update.ask.forEach((level) => {
      orderbookMap.asks[level.price] = level.volume
    })
  })

  // Use the timestamp of the most recent update
  const lastUpdateIdx = updates.length - 1
  const finalTimestamp = updates[lastUpdateIdx].exchangeTimestamp

  return convertOrderbookMap(orderbookMap, finalTimestamp)
}

/**
 * Fetches a snapshot of the Binance orderbook for the given pair symbol,
 * around the given timestamp (in milliseconds), up to the maximum supported depth (5000 levels).
 */
async function fetchBinanceOrderbookSnapshot(
  instrument: string,
  timestamp: number
): Promise<AmberdataOrderbookSnapshot> {
  // For the search range, we set [timestamp - 1min, timestamp + 1ms).
  // This is to ensure that we get the most recent snapshot inclusive of the timestamp
  const startDate = timestamp - 60000
  const endDate = timestamp + 1

  const req = await amberdataRequest(
    `${AMBERDATA_ORDERBOOK_SNAPSHOTS_ROUTE}/${instrument}`,
    startDate,
    endDate
  )

  const res = await fetch(req, { cache: "no-store" })
  const orderbookRes: AmberdataOrderbookSnapshotResponse = await res.json()

  // The Amberdata response contains snapshots in ascending order of timestamp,
  // i.e. most recent is last
  const lastIdx = orderbookRes.payload.data.length - 1
  return orderbookRes.payload.data[lastIdx]
}

/**
 * Fetches all of the Binance orderbook updates for the given instrument,
 * from the timestamp of the most recent snapshot, to the desired timestamp
 */
async function fetchBinanceOrderbookUpdates(
  instrument: string,
  snapshotTimestamp: number,
  desiredTimestamp: number
): Promise<Array<AmberdataOrderbookUpdate>> {
  const req = await amberdataRequest(
    `${AMBERDATA_ORDERBOOK_UPDATES_ROUTE}/${instrument}`,
    snapshotTimestamp,
    desiredTimestamp
  )

  const res = await fetch(req, { cache: "no-store" })
  const updatesRes: AmberdataOrderbookUpdateResponse = await res.json()
  return updatesRes.payload.data
}

/**
 * Constructs an Amberdata API GET request for the given route,
 * setting the search parameters & API key header appropriately.
 *
 * @param startDate - The starting timestamp for the search range, in milliseconds (inclusive)
 * @param endDate - The ending timestamp for the search range, in milliseconds (exclusive)
 */
async function amberdataRequest(
  route: string,
  startDate: number,
  endDate: number
): Promise<Request> {
  const amberdataUrl = new URL(`${AMBERDATA_BASE_URL}/${route}`)
  amberdataUrl.searchParams.set(EXCHANGE_PARAM, BINANCE_EXCHANGE_ID)
  amberdataUrl.searchParams.set(TIME_FORMAT_PARAM, TIME_FORMAT)
  amberdataUrl.searchParams.set(START_DATE_PARAM, startDate.toString())
  amberdataUrl.searchParams.set(END_DATE_PARAM, endDate.toString())

  let amberdataReq = new Request(amberdataUrl)
  amberdataReq.headers.set(
    API_KEY_HEADER,
    process.env.AMBERDATA_API_KEY as string
  )

  return amberdataReq
}

/** Converts an orderbook map to a valid orderbook response */
function convertOrderbookMap(
  orderbookMap: OrderbookMap,
  timestamp: number
): OrderbookResponseData {
  // Filter out the empty levels & sort in expected order
  const bids = Object.entries(orderbookMap.bids)
    .filter(([_price, volume]) => volume > 0)
    .map(([price, quantity]) => ({ price: parseFloat(price), quantity }))
    .sort((a, b) => b.price - a.price)

  const asks = Object.entries(orderbookMap.asks)
    .filter(([_price, volume]) => volume > 0)
    .map(([price, quantity]) => ({ price: parseFloat(price), quantity }))
    .sort((a, b) => a.price - b.price)

  return { bids, asks, timestamp }
}
