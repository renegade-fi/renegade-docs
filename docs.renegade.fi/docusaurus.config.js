// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require("prism-react-renderer")
const lightCodeTheme = themes.github
const darkCodeTheme = themes.dracula

// SEO constants (moved from seo.ts)
const BASE_URL = "https://renegade.fi";
const DESCRIPTION = "Trade any ERC-20 with zero price impact. Renegade is a MPC-based dark pool, delivering zero slippage cryptocurrency trades via anonymous crosses at midpoint prices.";
const DOCS_OPENGRAPH = "https://renegade-assets.s3.us-east-2.amazonaws.com/opengraph-docs.png";
const DOCS_TITLE = "Renegade | Docs";
const DOCS_BASE_URL = "https://docs.renegade.fi";
const SHORT_DESCRIPTION = "On-chain dark pool. MPC-based cryptocurrency DEX for anonymous crosses at midpoint prices.";
const SHORT_NAME = "Renegade";
const TWITTER_HANDLE = "@renegade_fi";
const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  url: BASE_URL,
  logo: "https://renegade-assets.s3.us-east-2.amazonaws.com/glyph-light.svg",
  name: `${SHORT_NAME} | On-Chain Dark Pool`,
  sameAs: ["https://twitter.com/renegade_fi"],
};

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: SHORT_NAME,
  url: DOCS_BASE_URL,
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  plugins: [require.resolve("./plugins.js")],

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          sidebarCollapsible: true,
        },
        theme: {
          customCss: [
            require.resolve("./src/css/custom.css"),
            require.resolve("./src/css/fonts.css"),
          ],
        },
        blog: false,
      },
    ],
  ],

  themeConfig: {
    algolia: {
      appId: "EWPU8CEAG4",
      apiKey: "25436a5337fea3c88c932367891e7ec3",
      indexName: "renegade",
      contextualSearch: true,
      externalUrlRegex: "renegade.fi",
    },
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      logo: {
        alt: "Renegade Logo",
        src: "img/glyph_light.svg",
        srcDark: "img/glyph_dark.svg",
      },
      items: [
        {
          label: "Twitter",
          href: "https://twitter.com/renegade_fi",
          position: "right",
        },
        {
          label: "Discord",
          href: "https://discord.gg/renegade-fi",
          position: "right",
        },
        {
          label: "Substack",
          href: "https://renegadefi.substack.com",
          position: "right",
        },
        {
          label: "Whitepaper",
          href: "https://whitepaper.renegade.fi",
          position: "right",
        },
        {
          label: "Code",
          href: "https://github.com/renegade-fi",
          position: "right",
        },
        {
          type: "search",
          position: "right",
          className: "search",
        },
      ],
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
    metadata: [
      { name: "description", content: SHORT_DESCRIPTION },
      { name: "og:title", content: DOCS_TITLE },
      { name: "og:image", content: DOCS_OPENGRAPH },
      { name: "og:description", content: DESCRIPTION },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: DOCS_BASE_URL },
      { name: "twitter:creator", content: TWITTER_HANDLE },
      { name: "twitter:description", content: SHORT_DESCRIPTION },
      { name: "twitter:image", content: DOCS_OPENGRAPH },
    ],
    headTags: [
      {
        tagName: "script",
        attributes: {
          type: "application/ld+json",
        },
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Renegade Finance",
          alternateName: "Renegade",
          url: "https://renegade.fi/",
        }),
      },
      {
        tagName: "script",
        attributes: {
          type: "application/ld+json",
        },
        innerHTML: JSON.stringify(ORGANIZATION_JSONLD),
      },
    ],
  },
}

module.exports = config
