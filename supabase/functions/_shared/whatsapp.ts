import { fail, isRecord } from "./http.ts";

export type WhatsAppConfig = {
  accessToken: string;
  appSecret: string;
  businessAccountId: string;
  graphApiVersion: string;
  phoneNumberId: string;
  verifyToken: string;
};

export type WhatsAppConfigResult =
  | {
      ok: true;
      config: WhatsAppConfig;
    }
  | {
      ok: false;
      missing: string[];
      response: Response;
    };

const defaultGraphApiVersion = "v21.0";
const redactedValue = "[redacted]";
const sensitiveWebhookKeys = new Set([
  "body",
  "caption",
  "display_phone_number",
  "from",
  "name",
  "phone_number",
  "wa_id",
]);

export function getWhatsAppConfig(): WhatsAppConfigResult {
  const values = {
    accessToken: Deno.env.get("META_WHATSAPP_ACCESS_TOKEN"),
    appSecret: Deno.env.get("META_APP_SECRET"),
    businessAccountId: Deno.env.get("META_WHATSAPP_BUSINESS_ACCOUNT_ID"),
    phoneNumberId: Deno.env.get("META_WHATSAPP_PHONE_NUMBER_ID"),
    verifyToken: Deno.env.get("META_WHATSAPP_WEBHOOK_VERIFY_TOKEN"),
  };
  const missing = Object.entries(values)
    .filter(([, value]) => !value?.trim())
    .map(([key]) => envNameForConfigKey(key));

  if (missing.length > 0) {
    return {
      ok: false,
      missing,
      response: fail(
        "WHATSAPP_CONFIG_MISSING",
        "WhatsApp is not configured yet.",
        503,
        { missing },
      ),
    };
  }

  return {
    ok: true,
    config: {
      accessToken: requiredConfigValue(values.accessToken),
      appSecret: requiredConfigValue(values.appSecret),
      businessAccountId: requiredConfigValue(values.businessAccountId),
      graphApiVersion:
        Deno.env.get("META_GRAPH_API_VERSION")?.trim() || defaultGraphApiVersion,
      phoneNumberId: requiredConfigValue(values.phoneNumberId),
      verifyToken: requiredConfigValue(values.verifyToken),
    },
  };
}

export function verifyWebhookChallenge(
  requestUrl: string,
  verifyToken: string,
): string | null {
  const url = new URL(requestUrl);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === verifyToken && challenge) {
    return challenge;
  }

  return null;
}

export async function verifyMetaSignature({
  appSecret,
  rawBody,
  signatureHeader,
}: {
  appSecret: string;
  rawBody: string;
  signatureHeader: string | null;
}): Promise<boolean> {
  const receivedHex = signatureHeader?.startsWith("sha256=")
    ? signatureHeader.slice("sha256=".length)
    : "";

  if (!receivedHex || !/^[a-f0-9]+$/i.test(receivedHex)) {
    return false;
  }

  const expectedHex = await hmacSha256Hex(appSecret, rawBody);

  return timingSafeEqualHex(expectedHex, receivedHex);
}

export function graphApiUrl(
  config: WhatsAppConfig,
  path: string,
): string {
  return `https://graph.facebook.com/${config.graphApiVersion}/${path.replace(/^\/+/, "")}`;
}

export function redactWebhookPayload(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redactWebhookPayload);
  }

  if (!isRecord(value)) {
    return value;
  }

  const redacted: Record<string, unknown> = {};

  for (const [key, entryValue] of Object.entries(value)) {
    redacted[key] = sensitiveWebhookKeys.has(key)
      ? redactedValue
      : redactWebhookPayload(entryValue);
  }

  return redacted;
}

export function safeMessagePreview(value: unknown, maxLength = 160): string {
  if (typeof value !== "string") {
    return "";
  }

  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const preview = normalized.slice(0, Math.max(0, maxLength - 3)).trim();
  const lastSpaceIndex = preview.lastIndexOf(" ");
  const wordSafePreview =
    lastSpaceIndex > 0 ? preview.slice(0, lastSpaceIndex) : preview;

  return `${wordSafePreview}...`;
}

export function normalizeWhatsAppPhone(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const digits = value.replace(/\D/g, "");

  return digits ? `+${digits}` : null;
}

export function phoneForGraphApi(phoneE164: string): string {
  return phoneE164.replace(/\D/g, "");
}

function envNameForConfigKey(key: string): string {
  if (key === "accessToken") {
    return "META_WHATSAPP_ACCESS_TOKEN";
  }

  if (key === "appSecret") {
    return "META_APP_SECRET";
  }

  if (key === "businessAccountId") {
    return "META_WHATSAPP_BUSINESS_ACCOUNT_ID";
  }

  if (key === "phoneNumberId") {
    return "META_WHATSAPP_PHONE_NUMBER_ID";
  }

  return "META_WHATSAPP_WEBHOOK_VERIFY_TOKEN";
}

function requiredConfigValue(value: string | undefined): string {
  if (!value?.trim()) {
    throw new Error("Missing WhatsApp config value.");
  }

  return value.trim();
}

async function hmacSha256Hex(secret: string, body: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(body),
  );

  return [...new Uint8Array(signature)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualHex(expectedHex: string, receivedHex: string): boolean {
  if (expectedHex.length !== receivedHex.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < expectedHex.length; index += 1) {
    difference |= expectedHex.charCodeAt(index) ^ receivedHex.charCodeAt(index);
  }

  return difference === 0;
}
