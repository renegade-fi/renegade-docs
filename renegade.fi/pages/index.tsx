import { useEffect, useMemo, useState } from "react"
import Head from "next/head"
import LandingPageDesktop from "@/views/desktop"
import LandingPageMobile from "@/views/mobile"
import mixpanel from "mixpanel-browser"
import type { Organization, WebPage, WebSite, WithContext } from "schema-dts"

if (!process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
  throw new Error("Missing NEXT_PUBLIC_MIXPANEL_TOKEN")
}

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
  debug: true,
  track_pageview: true,
})
mixpanel.track("Initialization")

const ORGANIZATION_SCHEMA: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Renegade",
  url: "https://renegade.fi",
  sameAs: [
    "https://twitter.com/renegade_fi",
    "https://github.com/renegade-fi",
    "https://discord.gg/5Qj5q2Z8",
    "https://www.linkedin.com/company/renegade-fi",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "chris@renegade.fi",
  },
  logo: {
    "@type": "ImageObject",
    inLanguage: "en-US",
    "@id": "Reneagade Logo",
    url: "https://renegade-assets.s3.us-east-2.amazonaws.com/glyph-light.svg",
    contentUrl:
      "https://renegade-assets.s3.us-east-2.amazonaws.com/opengraph-main.png",
    width: "100%",
    height: "100%",
    caption:
      "On-chain dark pool. MPC-based cryptocurrency DEX for anonymous crosses at midpoint prices.",
  },
}

const WEBSITE_SCHEMA: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: "https://renegade.fi",
  name: "Renegade",
  description:
    "Trade any ERC-20 with zero price impact. Renegade is a MPC-based dark pool, delivering zero slippage cryptocurrency trades via anonymous crosses at midpoint prices.",
  publisher: {
    "@type": "Organization",
    name: "Renegade",
    logo: {
      "@type": "ImageObject",
      inLanguage: "en-US",
      "@id": "Reneagade Logo",
      url: "https://renegade-assets.s3.us-east-2.amazonaws.com/glyph-light.svg",
      contentUrl:
        "https://renegade-assets.s3.us-east-2.amazonaws.com/opengraph-main.png",
      width: "100%",
      height: "100%",
      caption:
        "On-chain dark pool. MPC-based cryptocurrency DEX for anonymous crosses at midpoint prices.",
    },
  },
}

const WEBPAGE_SCHEMA: WithContext<WebPage> = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  url: "https://renegade.fi",
  name: "Renegade | On-Chain Dark Pool",
  description:
    "Trade any ERC-20 with zero price impact. Renegade is a MPC-based dark pool, delivering zero slippage cryptocurrency trades via anonymous crosses at midpoint prices.",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://renegade.fi",
      },
    ],
  },
  mainEntity: {
    "@type": "Organization",
    name: "Renegade",
    logo: {
      "@type": "ImageObject",
      inLanguage: "en-US",
      "@id": "Reneagade Logo",
      url: "https://renegade-assets.s3.us-east-2.amazonaws.com/glyph-light.svg",
      contentUrl:
        "https://renegade-assets.s3.us-east-2.amazonaws.com/opengraph-main.png",
      width: "100%",
      height: "100%",
      caption:
        "On-chain dark pool. MPC-based cryptocurrency DEX for anonymous crosses at midpoint prices.",
    },
  },
}

export default function Home() {
  const [width, setWidth] = useState<number | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const Content = useMemo(() => {
    if (width && width <= 768) {
      return LandingPageMobile
    }
    return LandingPageDesktop
  }, [width])

  return (
    <>
      <Head>
        <title>Renegade | On-Chain Dark Pool</title>
        <meta
          name="description"
          content="Trade any ERC-20 with zero price impact. Renegade is a MPC-based dark pool, delivering zero slippage cryptocurrency trades via anonymous crosses at midpoint prices."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:description"
          content="On-chain dark pool. MPC-based cryptocurrency DEX for anonymous crosses at midpoint prices."
        />
        <meta
          property="og:image"
          content="https://renegade-assets.s3.us-east-2.amazonaws.com/opengraph-main.png"
        />
        <meta property="og:site_name" content="Renegade | On-Chain Dark Pool" />
        <meta property="og:title" content="Renegade | On-Chain Dark Pool" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://renegade.fi" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@renegade_fi" />
        <meta
          name="twitter:description"
          content="On-chain dark pool. MPC-based cryptocurrency DEX for anonymous crosses at midpoint prices."
        />
        <meta
          property="twitter:image"
          content="https://renegade-assets.s3.us-east-2.amazonaws.com/opengraph-main.png"
        />
        <meta name="twitter:site" content="@renegade_fi" />
        <meta name="twitter:title" content="Renegade" />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="../icons/apple/glyph57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="../icons/apple/glyph60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="../icons/apple/glyph72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="../icons/apple/glyph76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="../icons/apple/glyph114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="../icons/apple/glyph120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="../icons/apple/glyph144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="../icons/apple/glyph152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="../icons/apple/glyph180.png"
        />
        <link rel="canonical" href="https://renegade.fi" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_SCHEMA),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(WEBSITE_SCHEMA),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(WEBPAGE_SCHEMA),
          }}
        />
      </Head>
      <main>
        <Content />
      </main>
    </>
  )
}
