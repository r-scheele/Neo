import { useMemo } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { createApiClient } from "./client";

export function useApiClient() {
  const { getToken } = useAuth();

  return useMemo(
    () =>
      createApiClient({
        getAuthToken: () => getToken(),
      }),
    [getToken],
  );
}
