import { requireAuthenticatedUser } from "./auth.ts";
import type { Membership, Profile } from "./supabaseRest.ts";
import { selectActiveMemberships, upsertProfileForUser } from "./supabaseRest.ts";
import { fail } from "./http.ts";

export type CommerceContext = {
  membership: Membership;
  profile: Profile;
  businessId: string;
};

export type CommerceContextResult =
  | {
      ok: true;
      context: CommerceContext;
    }
  | {
      ok: false;
      response: Response;
    };

export async function requireCommerceContext(
  request: Request,
): Promise<CommerceContextResult> {
  const auth = await requireAuthenticatedUser(request);

  if (!auth.ok) {
    return auth;
  }

  const profile = await upsertProfileForUser(auth.user);

  if (!profile.ok) {
    return profile;
  }

  const memberships = await selectActiveMemberships(profile.data.id);

  if (!memberships.ok) {
    return memberships;
  }

  const membership = memberships.data[0] ?? null;

  if (!membership) {
    return {
      ok: false,
      response: fail(
        "BUSINESS_REQUIRED",
        "Finish business setup before syncing commerce records.",
        409,
      ),
    };
  }

  return {
    ok: true,
    context: {
      businessId: membership.business_id,
      membership,
      profile: profile.data,
    },
  };
}

export function getRouteParts(request: Request, functionName: string): string[] {
  const parts = new URL(request.url).pathname.split("/").filter(Boolean);
  const functionIndex = parts.lastIndexOf(functionName);

  if (functionIndex === -1) {
    return [];
  }

  return parts.slice(functionIndex + 1).map(decodeURIComponent);
}
