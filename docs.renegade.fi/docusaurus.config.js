// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Renegade',
  url: 'https://docs.renegade.fi',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          sidebarCollapsible: true
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: 'Renegade Logo',
          src: 'img/logo_glyph_light.svg',
          srcDark: 'img/logo_glyph_dark.svg'
        },
        items: [
          {
            href: 'https://twitter.com/renegade_fi',
            label: 'Twitter',
            position: 'right'
          },
          {
            href: 'https://discord.gg/renegade-fi',
            label: 'Discord',
            position: 'right'
          },
          {
            href: 'https://renegadefi.substack.com',
            label: 'Substack',
            position: 'right'
          },
          {
            label: 'Whitepaper',
            href: 'https://whitepaper.renegade.fi',
            position: 'right'
          },
          {
            label: 'GitHub',
            href: 'https://github.com/renegade-fi',
            position: 'right'
          }
        ]
      },
      footer: {
        style: 'light',
        logo: {
          alt: 'Renegade Logo',
          src: 'img/logo_light.svg',
          srcDark: 'img/logo_dark.svg',
          width: '300px'
        }
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    })
}

module.exports = config

// links: [
//   {
//     title: 'Documentation',
//     items: [
//       {
//         label: 'Getting Started',
//         to: '/'
//       },
//       {
//         label: 'Core Concepts',
//         to: '/core-concepts/dark-pool-explainer'
//       },
//       {
//         label: 'Advanced Concepts',
//         to: '/advanced-concepts/ioi'
//       }
//     ]
//   },
//   {
//     title: 'Community',
//     items: [
//       {
//         label: 'Twitter',
//         href: 'https://twitter.com/renegade_fi'
//       },
//       {
//         label: 'Discord',
//         href: 'https://discord.gg/renegade-fi'
//       },
//       {
//         label: 'Substack',
//         href: 'https://renegadefi.substack.com'
//       }
//     ]
//   },
//   {
//     title: 'Resources',
//     items: [
//       {
//         label: 'Whitepaper',
//         href: 'https://whitepaper.renegade.fi'
//       },
//       {
//         label: 'GitHub',
//         href: 'https://github.com/renegade-fi'
//       }
//     ]
//   }
// ]
