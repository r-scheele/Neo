import { requireAuthenticatedUser } from "../_shared/auth.ts";
import {
  fail,
  handleOptions,
  methodNotAllowed,
  ok,
  readJsonRecord,
} from "../_shared/http.ts";
import {
  createBusinessForOwner,
  createOwnerMembership,
  selectActiveMemberships,
  selectBusiness,
  upsertProfileForUser,
} from "../_shared/supabaseRest.ts";

Deno.serve(async (request) => {
  const optionsResponse = handleOptions(request);
  if (optionsResponse) {
    return optionsResponse;
  }

  if (request.method !== "POST") {
    return methodNotAllowed(["POST", "OPTIONS"]);
  }

  const auth = await requireAuthenticatedUser(request);
  if (!auth.ok) {
    return auth.response;
  }

  const body = await readJsonRecord(request);
  if (!body.ok) {
    return body.response;
  }

  const name = requiredText(body.data.name);
  const businessType = optionalText(body.data.businessType);

  if (!name || name.length > 100) {
    return fail(
      "VALIDATION_INVALID_BUSINESS_NAME",
      "Enter a business name between 1 and 100 characters.",
      400,
    );
  }

  const profileResult = await upsertProfileForUser(auth.user);
  if (!profileResult.ok) {
    return profileResult.response;
  }

  const existingMemberships = await selectActiveMemberships(profileResult.data.id);
  if (!existingMemberships.ok) {
    return existingMemberships.response;
  }

  const existingMembership = existingMemberships.data[0] ?? null;
  if (existingMembership) {
    const existingBusiness = await selectBusiness(existingMembership.business_id);
    if (!existingBusiness.ok) {
      return existingBusiness.response;
    }

    return ok({
      created: false,
      profile: {
        id: profileResult.data.id,
        email: profileResult.data.email,
        displayName: profileResult.data.display_name,
        avatarUrl: profileResult.data.avatar_url,
      },
      membership: {
        id: existingMembership.id,
        businessId: existingMembership.business_id,
        role: existingMembership.role,
        status: existingMembership.status,
        permissions: existingMembership.permissions,
      },
      business: existingBusiness.data
        ? {
            id: existingBusiness.data.id,
            name: existingBusiness.data.name,
            setupStatus: existingBusiness.data.setup_status,
            businessType: existingBusiness.data.business_type,
          }
        : null,
    });
  }

  const businessResult = await createBusinessForOwner(
    profileResult.data.id,
    name,
    businessType,
  );

  if (!businessResult.ok) {
    return businessResult.response;
  }

  const membershipResult = await createOwnerMembership(
    businessResult.data.id,
    profileResult.data.id,
  );

  if (!membershipResult.ok) {
    return membershipResult.response;
  }

  return ok(
    {
      created: true,
      profile: {
        id: profileResult.data.id,
        email: profileResult.data.email,
        displayName: profileResult.data.display_name,
        avatarUrl: profileResult.data.avatar_url,
      },
      membership: {
        id: membershipResult.data.id,
        businessId: membershipResult.data.business_id,
        role: membershipResult.data.role,
        status: membershipResult.data.status,
        permissions: membershipResult.data.permissions,
      },
      business: {
        id: businessResult.data.id,
        name: businessResult.data.name,
        setupStatus: businessResult.data.setup_status,
        businessType: businessResult.data.business_type,
      },
    },
    201,
  );
});

function requiredText(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed ? trimmed : null;
}

function optionalText(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  return trimmed ? trimmed : null;
}
