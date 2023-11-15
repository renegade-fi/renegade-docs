import { useEffect, useState } from "react"
import Head from "next/head"
import LandingPageDesktop from "@/views/desktop"
import LandingPageMobile from "@/views/mobile"

import {
  BASE_URL,
  DESCRIPTION,
  SHORT_DESCRIPTION,
  TITLE,
  TWITTER_HANDLE,
} from "../../seo"

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    url: BASE_URL,
    logo: `https://${process.env.VERCEL_URL}/glyph_dark.svg`,
  }
  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="robots" content="index, follow" />
        <meta property="og:description" content={SHORT_DESCRIPTION} />
        <meta
          property="og:image"
          content={`https://${process.env.VERCEL_URL}/opengraph-image.png`}
        />
        <meta property="og:title" content="Renegade" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={BASE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content={TWITTER_HANDLE} />
        <meta name="twitter:description" content={SHORT_DESCRIPTION} />
        <meta
          property="twitter:image"
          content={`https://${process.env.VERCEL_URL}/opengraph-image.png`}
        />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <main>
        <LandingPage />
      </main>
    </>
  )
}

function LandingPage() {
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

  return width && width <= 768 ? <LandingPageMobile /> : <LandingPageDesktop />
}
