import { renegade } from "./exchange-data"
import RelayerStatusBanner from "./relayer-banner"

async function RelayerStatusData({
  baseToken,
  quoteToken,
}: {
  baseToken: string
  quoteToken: string
}) {
  const ping = await renegade
    ?.ping()
    .then(() => "live")
    .catch(() => "dead")
  return (
    <RelayerStatusBanner
      connectionState={ping}
      activeBaseTicker={baseToken}
      activeQuoteTicker={quoteToken}
    />
  )
}

export default RelayerStatusData
