import { fail } from "./http.ts";
import type { JwtPayload } from "./jwt.ts";
import { verifyJwtWithJwks } from "./jwt.ts";

export type AuthenticatedUser = {
  clerkUserId: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
};

export type AuthResult =
  | {
      ok: true;
      user: AuthenticatedUser;
    }
  | {
      ok: false;
      response: Response;
    };

export async function requireAuthenticatedUser(request: Request): Promise<AuthResult> {
  const token = bearerToken(request.headers.get("authorization"));

  if (!token) {
    return {
      ok: false,
      response: fail("AUTH_MISSING_TOKEN", "Sign in again to continue.", 401),
    };
  }

  const result = await verifyJwtWithJwks(token, Deno.env.get("CLERK_JWKS_URL"));

  if (!result.ok) {
    return {
      ok: false,
      response: fail(result.code, result.message, 401),
    };
  }

  return {
    ok: true,
    user: userFromClaims(result.payload),
  };
}

function bearerToken(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const match = value.match(/^Bearer\s+(.+)$/i);

  return match?.[1]?.trim() || null;
}

function userFromClaims(payload: JwtPayload): AuthenticatedUser {
  return {
    clerkUserId: payload.sub,
    email: payload.email,
    displayName: displayNameFromClaims(payload),
    avatarUrl: payload.image_url ?? payload.picture,
  };
}

function displayNameFromClaims(payload: JwtPayload): string | undefined {
  if (payload.name) {
    return payload.name;
  }

  const name = [payload.given_name, payload.family_name].filter(Boolean).join(" ");

  return name || undefined;
}
