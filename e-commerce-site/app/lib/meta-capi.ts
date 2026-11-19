import crypto from "node:crypto";

type CapiUserData = {
  em?: string[];
  ph?: string[];
  client_ip_address?: string;
  client_user_agent?: string;
  fbp?: string;
  fbc?: string;
  external_id?: string[];
};

type CapiCustomData = Record<string, unknown>;

type SendCapiEventInput = {
  eventName: string;
  eventId?: string;
  eventSourceUrl?: string;
  eventTime?: number;
  actionSource?: "website" | "app" | "email" | "phone_call" | "chat" | "physical_store" | "system_generated" | "other";
  userData?: CapiUserData;
  customData?: CapiCustomData;
  testEventCode?: string;
};

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function normalizeEmail(email?: string | null) {
  if (!email) return undefined;
  const normalized = email.trim().toLowerCase();
  return normalized ? sha256(normalized) : undefined;
}

function normalizePhone(phone?: string | null) {
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  return digits ? sha256(digits) : undefined;
}

function getPixelId() {
  return (
    process.env.META_PIXEL_ID ||
    process.env.FACEBOOK_PIXEL_ID ||
    process.env.NEXT_PUBLIC_META_PIXEL_ID ||
    "1029616366831887"
  );
}

function getAccessToken() {
  return (
    process.env.META_CONVERSIONS_API_TOKEN ||
    process.env.META_CAPI_ACCESS_TOKEN ||
    process.env.FACEBOOK_CONVERSIONS_API_TOKEN ||
    process.env.META_ACCESS_TOKEN
  );
}

function getApiVersion() {
  return process.env.META_GRAPH_API_VERSION || "v21.0";
}

function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return undefined;
  const parts = cookieHeader.split(";").map((part) => part.trim());
  for (const part of parts) {
    if (part.startsWith(`${name}=`)) {
      const value = part.slice(name.length + 1);
      return value || undefined;
    }
  }
  return undefined;
}

export function getRequestUserData(request: Request, eventSourceUrl?: string): CapiUserData {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || undefined;
  const ua = request.headers.get("user-agent") || undefined;
  const cookieHeader = request.headers.get("cookie");
  let fbc = getCookieValue(cookieHeader, "_fbc");

  if (!fbc && eventSourceUrl) {
    try {
      const fbclid = new URL(eventSourceUrl).searchParams.get("fbclid");
      if (fbclid) fbc = `fb.1.${Math.floor(Date.now() / 1000)}.${fbclid}`;
    } catch {
      fbc = undefined;
    }
  }

  return {
    client_ip_address: ip,
    client_user_agent: ua,
    fbp: getCookieValue(cookieHeader, "_fbp"),
    fbc,
  };
}

export function buildHashedUserData(input: {
  email?: string | null;
  phone?: string | null;
  externalId?: string | null;
}) {
  const em = normalizeEmail(input.email);
  const ph = normalizePhone(input.phone);
  const external = input.externalId?.trim() ? sha256(input.externalId.trim()) : undefined;

  return {
    ...(em ? { em: [em] } : {}),
    ...(ph ? { ph: [ph] } : {}),
    ...(external ? { external_id: [external] } : {}),
  } satisfies CapiUserData;
}

export async function sendMetaCapiEvent(input: SendCapiEventInput) {
  const pixelId = getPixelId();
  const accessToken = getAccessToken();
  const testEventCode = input.testEventCode || process.env.META_TEST_EVENT_CODE;

  if (!pixelId || !accessToken) {
    return { skipped: true as const, reason: "missing_config" as const };
  }

  const event = {
    event_name: input.eventName,
    event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
    action_source: input.actionSource ?? "website",
    ...(input.eventId ? { event_id: input.eventId } : {}),
    ...(input.eventSourceUrl ? { event_source_url: input.eventSourceUrl } : {}),
    ...(input.userData && Object.keys(input.userData).length > 0 ? { user_data: input.userData } : {}),
    ...(input.customData && Object.keys(input.customData).length > 0 ? { custom_data: input.customData } : {}),
  };

  const body = {
    data: [event],
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
  };

  const url = `https://graph.facebook.com/${getApiVersion()}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("Meta CAPI event failed:", input.eventName, result);
      return { ok: false as const, status: response.status, result };
    }

    return { ok: true as const, status: response.status, result };
  } catch (error) {
    console.error("Meta CAPI event error:", input.eventName, error);
    return { ok: false as const, error: (error as Error).message };
  }
}
