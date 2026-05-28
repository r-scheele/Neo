type ErrorDetails = Record<string, unknown>;

export type JsonRecordResult =
  | {
      ok: true;
      data: Record<string, unknown>;
    }
  | {
      ok: false;
      response: Response;
    };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
};

export function handleOptions(request: Request): Response | null {
  if (request.method !== "OPTIONS") {
    return null;
  }

  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export function ok(data: Record<string, unknown>, status = 200): Response {
  return json({ data, error: null }, status);
}

export function fail(
  code: string,
  message: string,
  status = 400,
  details: ErrorDetails = {},
): Response {
  return json(
    {
      data: null,
      error: {
        code,
        message,
        details,
      },
    },
    status,
  );
}

export const failure = fail;

export function deferred(functionName: string): Response {
  return fail(
    "ENDPOINT_DEFERRED",
    "This backend endpoint is scaffolded but not implemented yet.",
    501,
    {
      functionName,
      nextStep: "Implement this endpoint from the matching Phase B backend prompt.",
    },
  );
}

export function methodNotAllowed(allowedMethods: string[]): Response {
  return fail(
    "METHOD_NOT_ALLOWED",
    "This request method is not supported for this endpoint.",
    405,
    { allowedMethods },
  );
}

export async function readJsonRecord(request: Request): Promise<JsonRecordResult> {
  let body: unknown;

  try {
    body = (await request.json()) as unknown;
  } catch {
    return {
      ok: false,
      response: fail(
        "VALIDATION_INVALID_JSON",
        "Send a valid JSON request body.",
        400,
      ),
    };
  }

  if (!isRecord(body)) {
    return {
      ok: false,
      response: fail(
        "VALIDATION_INVALID_BODY",
        "Send a valid JSON object.",
        400,
      ),
    };
  }

  return {
    ok: true,
    data: body,
  };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
