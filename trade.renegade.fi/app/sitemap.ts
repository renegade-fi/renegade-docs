import { MetadataRoute } from "next"

import { DISPLAYED_TICKERS } from "@/lib/tokens"

export default function sitemap(): MetadataRoute.Sitemap {
  return DISPLAYED_TICKERS.map(([base, quote]) => ({
    url: `${process.env.VERCEL_URL}/${base}/${quote}`,
    lastModified: new Date(),
    changeFrequency: "daily",
  }))
}
