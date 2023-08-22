import { HealthState } from "@/types"

export function getHealthState(priceReport: any): HealthState {
  if (!priceReport || priceReport === "Unsupported") {
    return "unsupported"
  }
  if (typeof priceReport === "object" && priceReport["Nominal"] !== undefined) {
    return "live"
  }
  if (priceReport === "NoDataReported") {
    return "no-data"
  }
  if (
    typeof priceReport === "object" &&
    priceReport["DataTooStale"] !== undefined
  ) {
    return "too-stale"
  }
  if (
    typeof priceReport === "object" &&
    priceReport["NotEnoughDataReported"] !== undefined
  ) {
    return "not-enough-data"
  }
  if (
    typeof priceReport === "object" &&
    priceReport["TooMuchDeviation"] !== undefined
  ) {
    return "too-much-deviation"
  }
  throw new Error("Invalid priceReport: " + priceReport)
}
