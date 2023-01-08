/* Defines the core RenegadeConnection class, which is responsible for managing
 * an external connection from the client to a Renegade relayer. The
 * RenegadeConnection connects via HTTP and WS to the relayer, subscribes and
 * unsubscribes from topics, etc.
 */

export interface PriceReport {
  type: string;
  topic: string;
  baseToken: { [addr: string]: string };
  quoteToken: { [addr: string]: string };
  exchange: string;
  midpointPrice: number;
  localTimestamp: number;
  reportedTimestamp: number;
}

export const DEFAULT_PRICE_REPORT = {
  type: "pricereportmedian",
  topic: "",
  baseToken: { addr: "" },
  quoteToken: { addr: "" },
  exchange: "",
  midpointPrice: 0,
  localTimestamp: 0,
  reportedTimestamp: 0,
};

interface RenegadeConnectionProps {
  relayerUrl: string;
  relayerHttpPort: number;
  relayerWsPort: number;
}
interface RenegadeConnectionState {
  relayerHttpUrl: string;
  relayerWsUrl: string;
  relayerConnection: any;
  relayerPromise: any;
  relayerTopicListeners: any;
}
export default class RenegadeConnection {
  props: RenegadeConnectionProps;
  state: RenegadeConnectionState;

  constructor(props: RenegadeConnectionProps) {
    this.props = props;

    // Create the WebSocket connection and a promise that resolves when opened
    const relayerHttpUrl = `http://${props.relayerUrl}:${props.relayerHttpPort}`;
    const relayerWsUrl = `ws://${props.relayerUrl}:${props.relayerWsPort}`;
    const relayerConnection = new WebSocket(relayerWsUrl);
    const relayerPromise = new Promise<void>((resolve) => {
      relayerConnection.addEventListener("open", () => {
        resolve();
      });
    });

    // Listen for inbound messages and pass them to the appropriate registered callbacks
    relayerConnection.addEventListener("message", (event) => {
      const parsedMessage = JSON.parse(event.data);
      // If the message is a subscriptions report, ignore it
      if (parsedMessage.subscriptions !== undefined) {
        return;
      }
      // If the topic message is not a price-report-*, ignore it
      if (!parsedMessage.topic.startsWith("price-report-")) {
        return;
      }
      const priceReport = {
        type: parsedMessage.event.type,
        topic: parsedMessage.topic,
        baseToken: parsedMessage.event.baseToken,
        quoteToken: parsedMessage.event.quoteToken,
        exchange: parsedMessage.event.exchange,
        midpointPrice: parsedMessage.event.midpointPrice,
        localTimestamp: parsedMessage.event.localTimestamp,
        reportedTimestamp: parsedMessage.event.reportedTimestamp,
      };
      for (const listener of this.state.relayerTopicListeners) {
        if (listener.topic === parsedMessage.topic) {
          listener.callback(priceReport);
        }
      }
    });

    this.state = {
      relayerHttpUrl,
      relayerWsUrl,
      relayerConnection,
      relayerPromise,
      relayerTopicListeners: [],
    };
  }

  async awaitConnection() {
    await this.state.relayerPromise;
  }

  subscribeToTopic(topic: string) {
    this.state.relayerConnection.send(
      JSON.stringify({
        type: "subscribe",
        topic,
      })
    );
  }

  unsubscribeFromTopic(topic: string) {
    this.state.relayerConnection.send(
      JSON.stringify({
        type: "unsubscribe",
        topic,
      })
    );
  }

  listenToTopic(topic: string, callback: (message: any) => void) {
    this.state.relayerTopicListeners.push({
      topic,
      callback,
    });
  }
}
