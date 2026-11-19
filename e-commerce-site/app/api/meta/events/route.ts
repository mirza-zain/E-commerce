import { getRequestUserData, sendMetaCapiEvent } from "@/app/lib/meta-capi";

const allowedEvents = new Set([
  "PageView",
  "ViewContent",
  "AddToCart",
  "InitiateCheckout",
  "Purchase",
]);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid event" }, { status: 400 });
  }

  const eventName = typeof body.eventName === "string" ? body.eventName : "";
  if (!allowedEvents.has(eventName)) {
    return Response.json({ error: "Unsupported event" }, { status: 400 });
  }

  const eventId =
    typeof body.eventId === "string" && body.eventId.trim()
      ? body.eventId.trim()
      : undefined;
  const eventSourceUrl =
    typeof body.eventSourceUrl === "string" && body.eventSourceUrl.trim()
      ? body.eventSourceUrl.trim()
      : request.headers.get("referer") || undefined;
  const customData =
    body.customData && typeof body.customData === "object" && !Array.isArray(body.customData)
      ? body.customData
      : undefined;

  const result = await sendMetaCapiEvent({
    eventName,
    eventId,
    eventSourceUrl,
    userData: getRequestUserData(request),
    customData,
  });

  return Response.json(result, {
    status: "ok" in result && result.ok ? 200 : 202,
  });
}
