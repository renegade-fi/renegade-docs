import { Renegade } from "@renegade-fi/renegade-js"

import RelayerStatusBanner from "./relayer-status-banner"

export const revalidate = 1

const renegade = new Renegade({
  relayerHostname: "cluster-node0.renegade-devnet.renegade.fi",
  relayerHttpPort: 3000,
  relayerWsPort: 4000,
  useInsecureTransport: false,
  verbose: false,
})

async function RelayerStatusData() {
  const ping = await renegade
    ?.ping()
    .then(() => "live")
    .catch(() => "dead")
  return <RelayerStatusBanner connectionState={ping} />
}

export default RelayerStatusData
