// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require("prism-react-renderer")
const lightCodeTheme = themes.github
const darkCodeTheme = themes.dracula

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Renegade",
  url: "https://docs.renegade.fi",
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
      "classic",
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
  },
}

module.exports = config
