"use client";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, unknown>;

export function trackMetaEvent(eventName: string, params?: EventParams, eventId?: string) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (eventId) {
    window.fbq("track", eventName, params ?? {}, { eventID: eventId });
    return;
  }
  if (params) {
    window.fbq("track", eventName, params);
  } else {
    window.fbq("track", eventName);
  }
}
