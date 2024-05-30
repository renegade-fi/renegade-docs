import { useEffect } from "react"

const LazyDatadog = () => {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "development") {
      return
    }
    let datadogRum: any
    let datadogLogs

    async function loadLogging() {
      const datadogRumModule = await import("@datadog/browser-rum")
      const datadogLogsModule = await import("@datadog/browser-logs")

      datadogRum = datadogRumModule.datadogRum
      datadogLogs = datadogLogsModule.datadogLogs

      datadogRum.init({
        applicationId: process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID,
        clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
        site: "us5.datadoghq.com",
        service: "staging-interface",
        env: "staging",
        version: "1.0.0",
        sessionSampleRate: 100,
        sessionReplaySampleRate: 100,
        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: "allow",
        startSessionReplayRecordingManually: true,
      })

      datadogLogs.init({
        clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
        site: "us5.datadoghq.com",
        service: "staging-interface",
        env: "testnet",
        forwardErrorsToLogs: true,
        forwardConsoleLogs: "all",
        sessionSampleRate: 100,
      })

      datadogRum.startSessionReplayRecording()
    }

    loadLogging()

    return () => {
      if (datadogRum) {
        datadogRum.stopSessionReplayRecording()
      }
    }
  }, [])

  return null
}

export default LazyDatadog
