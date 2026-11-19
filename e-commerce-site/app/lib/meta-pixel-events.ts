"use client";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, unknown>;

export function trackMetaEvent(
  eventName: string,
  params?: EventParams,
  eventId?: string,
  sendToServer = true,
  customerData?: {
    email?: string;
    phone?: string;
    externalId?: string;
  },
) {
  if (typeof window === "undefined") return;

  const resolvedEventId =
    eventId ||
    (typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${eventName}-${Date.now()}-${Math.random().toString(16).slice(2)}`);

  if (typeof window.fbq === "function") {
    if (params) {
      window.fbq("track", eventName, params, { eventID: resolvedEventId });
    } else {
      window.fbq("track", eventName, {}, { eventID: resolvedEventId });
    }
  }

  if (sendToServer) {
    void fetch("/api/meta/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        eventId: resolvedEventId,
        eventSourceUrl: window.location.href,
        customData: params,
        customerData,
      }),
      keepalive: true,
    }).catch(() => undefined);
  }
}
