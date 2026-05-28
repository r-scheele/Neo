import { deferred, handleOptions } from "../_shared/http.ts";

Deno.serve((request) => {
  const optionsResponse = handleOptions(request);
  if (optionsResponse) {
    return optionsResponse;
  }

  return deferred("clerk-webhook");
});
