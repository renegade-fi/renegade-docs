/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/docs/:path*",
        destination: "https://docs.renegade.fi/:path*",
        permanent: true,
      },
      {
        source: "/whitepaper",
        destination: "https://www.renegade.fi/whitepaper.pdf",
        permanent: true,
      },
      {
        source: "/github",
        destination: "https://github.com/renegade-fi/",
        permanent: true,
      },
      {
        source: "/waitlist",
        destination: "https://renegadefi.typeform.com/access",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
