import backgroundPattern from "@/icons/background_pattern.png"

import TradingBody from "@/components/TradingBody"
import AllTokensData from "@/components/banners/all-tokens-data"
import ExchangeData from "@/components/banners/exchange-data"
import RelayerStatusData from "@/components/banners/relayer-status-data"

export default function Home({
  params,
}: {
  params: { base: string; quote: string }
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: "1",
        backgroundImage: `url(${backgroundPattern.src})`,
        backgroundSize: "cover",
      }}
    >
      <ExchangeData baseToken={params.base} quoteToken={params.quote} />
      <RelayerStatusData />
      <TradingBody />
      <AllTokensData />
    </div>
  )
}
