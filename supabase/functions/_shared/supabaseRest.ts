import { fail, isRecord } from "./http.ts";
import type { AuthenticatedUser } from "./auth.ts";

export type Profile = {
  id: string;
  clerk_user_id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

export type Membership = {
  id: string;
  business_id: string;
  role: "owner" | "manager" | "staff";
  status: string;
  permissions: Record<string, unknown>;
};

export type Business = {
  id: string;
  name: string;
  setup_status: string;
  business_type: string | null;
};

export type SupabaseResult<TData> =
  | {
      ok: true;
      data: TData;
    }
  | {
      ok: false;
      response: Response;
    };

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH";
  body?: Record<string, unknown>;
  prefer?: string;
};

export async function upsertProfileForUser(
  user: AuthenticatedUser,
): Promise<SupabaseResult<Profile>> {
  const existing = await selectProfileByClerkId(user.clerkUserId);

  if (!existing.ok || existing.data) {
    return existing;
  }

  return insertProfile(user);
}

export async function selectActiveMemberships(
  profileId: string,
): Promise<SupabaseResult<Membership[]>> {
  const query =
    `/rest/v1/business_members?profile_id=eq.${encodeURIComponent(profileId)}` +
    "&status=eq.active&select=id,business_id,role,status,permissions&order=created_at.asc";

  return supabaseRequest(query, {
    method: "GET",
  }, parseMemberships);
}

export async function selectBusiness(
  businessId: string,
): Promise<SupabaseResult<Business | null>> {
  return supabaseRequest(
    `/rest/v1/businesses?id=eq.${encodeURIComponent(businessId)}` +
      "&select=id,name,setup_status,business_type&limit=1",
    { method: "GET" },
    (value) => parseFirst(value, parseBusiness),
  );
}

export async function createBusinessForOwner(
  profileId: string,
  name: string,
  businessType: string | null,
): Promise<SupabaseResult<Business>> {
  return supabaseRequest(
    "/rest/v1/businesses?select=id,name,setup_status,business_type",
    {
      method: "POST",
      prefer: "return=representation",
      body: {
        owner_profile_id: profileId,
        name,
        business_type: businessType,
        setup_status: "incomplete",
      },
    },
    (value) => parseFirstRequired(value, parseBusiness),
  );
}

export async function createOwnerMembership(
  businessId: string,
  profileId: string,
): Promise<SupabaseResult<Membership>> {
  return supabaseRequest(
    "/rest/v1/business_members?select=id,business_id,role,status,permissions",
    {
      method: "POST",
      prefer: "return=representation",
      body: {
        business_id: businessId,
        profile_id: profileId,
        role: "owner",
        status: "active",
        permissions: {},
      },
    },
    (value) => parseFirstRequired(value, parseMembership),
  );
}

async function selectProfileByClerkId(
  clerkUserId: string,
): Promise<SupabaseResult<Profile | null>> {
  return supabaseRequest(
    `/rest/v1/profiles?clerk_user_id=eq.${encodeURIComponent(clerkUserId)}` +
      "&select=id,clerk_user_id,email,display_name,avatar_url&limit=1",
    { method: "GET" },
    (value) => parseFirst(value, parseProfile),
  );
}

async function insertProfile(user: AuthenticatedUser): Promise<SupabaseResult<Profile>> {
  return supabaseRequest(
    "/rest/v1/profiles?select=id,clerk_user_id,email,display_name,avatar_url",
    {
      method: "POST",
      prefer: "return=representation",
      body: {
        clerk_user_id: user.clerkUserId,
        email: user.email ?? null,
        display_name: user.displayName ?? null,
        avatar_url: user.avatarUrl ?? null,
      },
    },
    (value) => parseFirstRequired(value, parseProfile),
  );
}

async function supabaseRequest<TData>(
  path: string,
  options: RequestOptions,
  parseData: (value: unknown) => TData,
): Promise<SupabaseResult<TData>> {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !serviceRoleKey) {
    return {
      ok: false,
      response: fail(
        "BACKEND_CONFIG_MISSING",
        "Backend data access is not configured.",
        500,
      ),
    };
  }

  const response = await fetch(`${url}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.prefer ? { Prefer: options.prefer } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const body = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    return {
      ok: false,
      response: fail(
        "BACKEND_DATA_ERROR",
        "Neo could not load backend data.",
        502,
      ),
    };
  }

  try {
    return {
      ok: true,
      data: parseData(body),
    };
  } catch {
    return {
      ok: false,
      response: fail(
        "BACKEND_RESPONSE_INVALID",
        "Neo received an unexpected backend response.",
        502,
      ),
    };
  }
}

function parseFirst<TData>(
  value: unknown,
  parseData: (item: unknown) => TData,
): TData | null {
  if (!Array.isArray(value)) {
    throw new Error("Expected array response.");
  }

  return value.length > 0 ? parseData(value[0]) : null;
}

function parseFirstRequired<TData>(
  value: unknown,
  parseData: (item: unknown) => TData,
): TData {
  const first = parseFirst(value, parseData);

  if (!first) {
    throw new Error("Expected one response row.");
  }

  return first;
}

function parseProfile(value: unknown): Profile {
  if (!isRecord(value) || typeof value.id !== "string" || typeof value.clerk_user_id !== "string") {
    throw new Error("Invalid profile.");
  }

  return {
    id: value.id,
    clerk_user_id: value.clerk_user_id,
    email: nullableString(value.email),
    display_name: nullableString(value.display_name),
    avatar_url: nullableString(value.avatar_url),
  };
}

function parseMemberships(value: unknown): Membership[] {
  if (!Array.isArray(value)) {
    throw new Error("Expected memberships array.");
  }

  return value.map(parseMembership);
}

function parseMembership(value: unknown): Membership {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.business_id !== "string" ||
    !isRole(value.role) ||
    typeof value.status !== "string"
  ) {
    throw new Error("Invalid membership.");
  }

  return {
    id: value.id,
    business_id: value.business_id,
    role: value.role,
    status: value.status,
    permissions: isRecord(value.permissions) ? value.permissions : {},
  };
}

function parseBusiness(value: unknown): Business {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.setup_status !== "string"
  ) {
    throw new Error("Invalid business.");
  }

  return {
    id: value.id,
    name: value.name,
    setup_status: value.setup_status,
    business_type: nullableString(value.business_type),
  };
}

function nullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function isRole(value: unknown): value is Membership["role"] {
  return value === "owner" || value === "manager" || value === "staff";
}
