import { isRecord } from "./http.ts";

export type JwtHeader = {
  alg: string;
  kid: string;
};

export type JwtPayload = {
  sub: string;
  exp?: number;
  nbf?: number;
  iss?: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  image_url?: string;
  picture?: string;
};

export type JwtVerificationResult =
  | {
      ok: true;
      payload: JwtPayload;
    }
  | {
      ok: false;
      code: string;
      message: string;
    };

type ClerkJsonWebKey = JsonWebKey & {
  kid: string;
};

type JsonWebKeySet = {
  keys: ClerkJsonWebKey[];
};

let cachedJwks: JsonWebKeySet | null = null;

export async function verifyJwtWithJwks(
  token: string,
  jwksUrl: string | undefined,
): Promise<JwtVerificationResult> {
  if (!jwksUrl) {
    return {
      ok: false,
      code: "AUTH_CONFIG_MISSING",
      message: "Authentication is not configured.",
    };
  }

  const parts = token.split(".");

  if (parts.length !== 3) {
    return invalidToken();
  }

  const header = parseJwtHeader(parts[0]);
  const payload = parseJwtPayload(parts[1]);

  if (!header || !payload) {
    return invalidToken();
  }

  if (header.alg !== "RS256") {
    return invalidToken();
  }

  const jwks = await getJwks(jwksUrl);
  const jwk = jwks.keys.find((key) => key.kid === header.kid);

  if (!jwk) {
    return invalidToken();
  }

  const verified = await verifySignature(parts, jwk);

  if (!verified) {
    return invalidToken();
  }

  const now = Math.floor(Date.now() / 1000);

  if (typeof payload.exp === "number" && payload.exp <= now) {
    return {
      ok: false,
      code: "AUTH_TOKEN_EXPIRED",
      message: "Sign in again to continue.",
    };
  }

  if (typeof payload.nbf === "number" && payload.nbf > now) {
    return invalidToken();
  }

  return {
    ok: true,
    payload,
  };
}

function parseJwtHeader(value: string): JwtHeader | null {
  const decoded = parseJwtPart(value);

  if (
    isRecord(decoded) &&
    decoded.alg === "RS256" &&
    typeof decoded.kid === "string"
  ) {
    return {
      alg: decoded.alg,
      kid: decoded.kid,
    };
  }

  return null;
}

function parseJwtPayload(value: string): JwtPayload | null {
  const decoded = parseJwtPart(value);

  if (!isRecord(decoded) || typeof decoded.sub !== "string") {
    return null;
  }

  return {
    sub: decoded.sub,
    exp: optionalNumber(decoded.exp),
    nbf: optionalNumber(decoded.nbf),
    iss: optionalString(decoded.iss),
    email: optionalString(decoded.email),
    name: optionalString(decoded.name),
    given_name: optionalString(decoded.given_name),
    family_name: optionalString(decoded.family_name),
    image_url: optionalString(decoded.image_url),
    picture: optionalString(decoded.picture),
  };
}

function parseJwtPart(value: string): unknown {
  try {
    return JSON.parse(new TextDecoder().decode(base64UrlToBytes(value))) as unknown;
  } catch {
    return null;
  }
}

async function getJwks(jwksUrl: string): Promise<JsonWebKeySet> {
  if (cachedJwks) {
    return cachedJwks;
  }

  const response = await fetch(jwksUrl);
  const body = (await response.json()) as unknown;

  if (!isRecord(body) || !Array.isArray(body.keys)) {
    return { keys: [] };
  }

  cachedJwks = {
    keys: body.keys.filter(isJsonWebKey),
  };

  return cachedJwks;
}

async function verifySignature(parts: string[], jwk: ClerkJsonWebKey): Promise<boolean> {
  try {
    const key = await crypto.subtle.importKey(
      "jwk",
      jwk,
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256",
      },
      false,
      ["verify"],
    );
    const data = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    const signature = base64UrlToBytes(parts[2]);

    return crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      key,
      toArrayBuffer(signature),
      toArrayBuffer(data),
    );
  } catch {
    return false;
  }
}

function base64UrlToBytes(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function isJsonWebKey(value: unknown): value is ClerkJsonWebKey {
  return isRecord(value) && typeof value.kid === "string";
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);

  return buffer;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function optionalNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

function invalidToken(): JwtVerificationResult {
  return {
    ok: false,
    code: "AUTH_INVALID_TOKEN",
    message: "Sign in again to continue.",
  };
}
