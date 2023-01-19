/* Defines the core RenegadeConnection class, which is responsible for managing
 * an external connection from the client to a Renegade relayer. The
 * RenegadeConnection connects via HTTP and WS to the relayer, subscribes and
 * unsubscribes from topics, etc.
 */
import uuid from "react-uuid";

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
  useTls: boolean;
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
    const relayerHttpUrl = `${props.useTls ? "https" : "http"}://${
      props.relayerUrl
    }:${props.relayerHttpPort}`;
    const relayerWsUrl = `${props.useTls ? "wss" : "ws"}://${
      props.relayerUrl
    }:${props.relayerWsPort}`;
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
      // If the topic message is not a *-price-report-*, ignore it
      if (parsedMessage.topic.split("-price-report-").length == 1) {
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
      for (const listenerId in this.state.relayerTopicListeners) {
        const listener = this.state.relayerTopicListeners[listenerId];
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
      relayerTopicListeners: {},
    };
    this.checkExchangeHealthStates = this.checkExchangeHealthStates.bind(this);
    this.ping = this.ping.bind(this);
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

  listenToTopic(topic: string, callback: (message: any) => void): string {
    const listenerId = uuid();
    this.state.relayerTopicListeners[listenerId] = {
      topic,
      callback,
    };
    return listenerId;
  }

  unlistenToTopic(listenerId: string) {
    delete this.state.relayerTopicListeners[listenerId];
  }

  async ping(): Promise<boolean> {
    try {
      const response = await fetch(`${this.state.relayerHttpUrl}/ping`);
      return response.ok;
    } catch (e) {
      return false;
    }
  }

  async checkExchangeHealthStates(
    baseAddr: string,
    quoteAddr: string
  ): Promise<any> {
    const response = await fetch(
      `${this.state.relayerHttpUrl}/exchangeHealthStates`,
      {
        method: "POST",
        body: `{"base_token": {"addr": "${baseAddr}"}, "quote_token": {"addr": "${quoteAddr}"}}`,
      }
    );
    return response.json();
  }
}
