import { WebSocketLink } from "@apollo/client/link/ws";
import { SubscriptionClient } from "subscriptions-transport-ws";

export default function wsLink(uri: string) {
  const client = new SubscriptionClient(uri, {
    reconnect: true
  });
  return new WebSocketLink(client);
}
