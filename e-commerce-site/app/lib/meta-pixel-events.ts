"use client";

import {
  buildMetaBrowserUserData,
  META_PIXEL_ID,
  type MetaCustomerData,
} from "./meta-customer-data";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, unknown>;

// Manual advanced matching has to be set on the pixel instance, not just on the
// event. The first init call with user data makes the pixel hash and attach
// these fields to every subsequent event on the page.
let advancedMatchingInitialized = false;

export function createMetaEventId(eventName: string) {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${eventName}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function trackMetaEvent(
  eventName: string,
  params?: EventParams,
  eventId?: string,
  sendToServer = true,
  customerData?: MetaCustomerData,
) {
  if (typeof window === "undefined") return;

  const resolvedEventId = eventId || createMetaEventId(eventName);
  const userData = buildMetaBrowserUserData(customerData);

  if (typeof window.fbq === "function") {
    if (userData && !advancedMatchingInitialized) {
      window.fbq("init", META_PIXEL_ID, userData);
      advancedMatchingInitialized = true;
    }

    window.fbq("track", eventName, params ?? {}, {
      eventID: resolvedEventId,
      ...(userData ? { user_data: userData } : {}),
    });
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
