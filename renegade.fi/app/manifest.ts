import { MetadataRoute } from "next"

import { DESCRIPTION, NAME, SHORT_NAME } from "../../seo"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: NAME,
    short_name: SHORT_NAME,
    description: DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  }
}
