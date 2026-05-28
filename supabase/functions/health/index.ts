import { handleOptions, methodNotAllowed, ok } from "../_shared/http.ts";

Deno.serve((request) => {
  const optionsResponse = handleOptions(request);
  if (optionsResponse) {
    return optionsResponse;
  }

  if (request.method !== "GET") {
    return methodNotAllowed(["GET", "OPTIONS"]);
  }

  return ok({
    status: "ok",
    service: "neo-backend",
    provider: "supabase-edge-functions",
    projectRef: "xtalfjnmxnwtogxgtlxn",
    implementation: "foundation",
  });
});
