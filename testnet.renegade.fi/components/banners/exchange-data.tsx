import { ExchangeData, HealthStates } from "@/types"
import { Renegade, Token } from "@renegade-fi/renegade-js"

import ExchangeConnectionsBanner from "@/components/banners/exchange-connections"

const renegade = new Renegade({
  relayerHostname: "cluster-node0.renegade-devnet.renegade.fi",
  relayerHttpPort: 3000,
  relayerWsPort: 4000,
  useInsecureTransport: false,
  verbose: false,
})

async function ExchangeTape() {
  const healthStates: HealthStates = await renegade?.queryExchangeHealthStates(
    new Token({ ticker: "WETH" }),
    new Token({ ticker: "USDC" })
  )
  const healthStatesExchanges = healthStates["all_exchanges"]
  const fallbackPriceReport: ExchangeData = {
    median: healthStates["median"]["DataTooStale"][0],
    binance:
      healthStatesExchanges["Binance"] &&
      healthStatesExchanges["Binance"]["Nominal"],
    coinbase:
      healthStatesExchanges["Coinbase"] &&
      healthStatesExchanges["Coinbase"]["Nominal"],
    kraken:
      healthStatesExchanges["Kraken"] &&
      healthStatesExchanges["Kraken"]["Nominal"],
    okx:
      healthStatesExchanges["Okx"] && healthStatesExchanges["Okx"]["Nominal"],
    uniswapv3:
      healthStatesExchanges["UniswapV3"] &&
      healthStatesExchanges["UniswapV3"]["Nominal"],
  }
  return (
    <ExchangeConnectionsBanner
      activeBaseTicker="WETH"
      activeQuoteTicker="USDC"
      priceReport={fallbackPriceReport}
    />
  )
}

export default ExchangeTape
