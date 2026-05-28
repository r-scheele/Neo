import { requireAuthenticatedUser } from "../_shared/auth.ts";
import { fail, handleOptions, methodNotAllowed, ok } from "../_shared/http.ts";
import {
  selectActiveMemberships,
  selectBusiness,
  upsertProfileForUser,
} from "../_shared/supabaseRest.ts";

Deno.serve(async (request) => {
  const optionsResponse = handleOptions(request);
  if (optionsResponse) {
    return optionsResponse;
  }

  if (request.method !== "GET") {
    return methodNotAllowed(["GET", "OPTIONS"]);
  }

  const auth = await requireAuthenticatedUser(request);
  if (!auth.ok) {
    return auth.response;
  }

  const profileResult = await upsertProfileForUser(auth.user);
  if (!profileResult.ok) {
    return profileResult.response;
  }

  const membershipsResult = await selectActiveMemberships(profileResult.data.id);
  if (!membershipsResult.ok) {
    return membershipsResult.response;
  }

  const membership = membershipsResult.data[0] ?? null;
  const businessResult = membership
    ? await selectBusiness(membership.business_id)
    : { ok: true as const, data: null };

  if (!businessResult.ok) {
    return businessResult.response;
  }

  if (membership && !businessResult.data) {
    return fail(
      "BACKEND_DATA_CONFLICT",
      "Neo could not load the selected business.",
      409,
    );
  }

  return ok({
    profile: {
      id: profileResult.data.id,
      email: profileResult.data.email,
      displayName: profileResult.data.display_name,
      avatarUrl: profileResult.data.avatar_url,
    },
    membership: membership
      ? {
          id: membership.id,
          businessId: membership.business_id,
          role: membership.role,
          status: membership.status,
          permissions: membership.permissions,
        }
      : null,
    business: businessResult.data
      ? {
          id: businessResult.data.id,
          name: businessResult.data.name,
          setupStatus: businessResult.data.setup_status,
          businessType: businessResult.data.business_type,
        }
      : null,
  });
});
