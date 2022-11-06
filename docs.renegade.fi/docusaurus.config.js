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
          src: 'img/logo_light.svg',
          srcDark: 'img/logo_dark.svg'
        },
        items: [
          {
            type: 'doc',
            docId: 'getting-started/intro',
            position: 'left',
            label: 'Docs'
          },
          {
            href: 'https://twitter.com/renegade_fi',
            label: 'Twitter',
            position: 'right'
          },
          {
            href: 'https://github.com/renegade-fi',
            label: 'GitHub',
            position: 'right'
          }
        ]
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'Getting Started',
                to: '/'
              },
              {
                label: 'Basic Concepts',
                to: '/basic-concepts/dark-pool-explainer'
              },
              {
                label: 'Advanced Concepts',
                to: '/advanced-concepts/ioi'
              }
            ]
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/renegade_fi'
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/renegade-fi'
              },
              {
                label: 'Substack',
                href: 'https://renegadefi.substack.com'
              }
            ]
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'Whitepaper',
                href: 'https://whitepaper.renegade.fi'
              },
              {
                label: 'GitHub',
                href: 'https://github.com/renegade-fi'
              }
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Renegade.`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    })
}

module.exports = config
