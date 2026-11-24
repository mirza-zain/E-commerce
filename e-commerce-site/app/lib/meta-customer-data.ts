// Shared customer-data normalization for Meta Pixel (browser, plain text)
// and Conversions API (server, SHA-256 hashed in meta-capi.ts).

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1029616366831887";

export type MetaCustomerData = {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  country?: string | null;
  externalId?: string | null;
};

export type MetaBrowserUserData = {
  em?: string;
  ph?: string;
  fn?: string;
  ln?: string;
  ct?: string;
  country?: string;
  external_id?: string;
};

const COUNTRY_CODES: Record<string, string> = {
  pakistan: "pk",
  "united arab emirates": "ae",
  "saudi arabia": "sa",
  "united states": "us",
  usa: "us",
  "united kingdom": "gb",
  uk: "gb",
  canada: "ca",
  australia: "au",
  india: "in",
};

// Longest first so a number is not matched by a shorter prefix (e.g. 1 before 971).
const DIALING_CODES = ["971", "966", "965", "964", "963", "962", "961", "92", "91", "61", "60", "65", "44", "1"];

export function normalizeMetaEmail(value?: string | null) {
  const normalized = value?.trim().toLowerCase();
  return normalized || undefined;
}

export function normalizeMetaPhone(value?: string | null) {
  if (!value) return undefined;

  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.replace(/^0+/, "");

  for (const code of DIALING_CODES) {
    if (digits.startsWith(code) && digits.length > code.length) {
      const nationalNumber = digits.slice(code.length).replace(/^0+/, "");
      if (nationalNumber) return `${code}${nationalNumber}`;
    }
  }

  return digits || undefined;
}

export function normalizeMetaName(value?: string | null) {
  const normalized = value?.trim().toLowerCase().replace(/[^a-z\s'-]/g, "").trim();
  return normalized || undefined;
}

export function normalizeMetaCity(value?: string | null) {
  const normalized = value?.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  return normalized || undefined;
}

export function normalizeMetaCountry(value?: string | null) {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (/^[a-z]{2}$/.test(normalized)) return normalized;
  return COUNTRY_CODES[normalized];
}

export function normalizeMetaExternalId(value?: string | null) {
  const normalized = value?.trim();
  return normalized || undefined;
}

// Plain text on purpose: the Meta Pixel hashes these values itself.
export function buildMetaBrowserUserData(
  customer?: MetaCustomerData | null,
): MetaBrowserUserData | undefined {
  if (!customer) return undefined;

  const em = normalizeMetaEmail(customer.email);
  const ph = normalizeMetaPhone(customer.phone);
  const fn = normalizeMetaName(customer.firstName);
  const ln = normalizeMetaName(customer.lastName);
  const ct = normalizeMetaCity(customer.city);
  const country = normalizeMetaCountry(customer.country);
  const externalId = normalizeMetaExternalId(customer.externalId);

  const userData: MetaBrowserUserData = {
    ...(em ? { em } : {}),
    ...(ph ? { ph } : {}),
    ...(fn ? { fn } : {}),
    ...(ln ? { ln } : {}),
    ...(ct ? { ct } : {}),
    ...(country ? { country } : {}),
    ...(externalId ? { external_id: externalId } : {}),
  };

  return Object.keys(userData).length > 0 ? userData : undefined;
}
