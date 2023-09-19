import { env } from "@/env.mjs"
// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: "https://01b17cb3692a6bec2b14fa74b466d9ad@o4505902826782720.ingest.sentry.io/4505903510061056",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  replaysSessionSampleRate:
    env.NEXT_PUBLIC_NODE_ENV === "development" ? 1 : 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    new Sentry.Replay({
      maskAllInputs: false,
      maskAllText: false,
    }),
  ],
})
