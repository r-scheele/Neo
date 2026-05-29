import { apiEndpoints } from "./endpoints";
import { isRecord } from "./response";
import type { ApiResult } from "./types";
import type { createApiClient } from "./client";

export type HealthResponse = {
  status: string;
  service?: string;
  provider?: string;
  projectRef?: string;
  implementation?: string;
};

type ApiClient = ReturnType<typeof createApiClient>;

export function checkHealth(client: ApiClient): Promise<ApiResult<HealthResponse>> {
  return client.request({
    path: apiEndpoints.health,
    auth: false,
    parseData: parseHealthResponse,
  });
}

function parseHealthResponse(data: unknown): HealthResponse {
  if (!isRecord(data) || typeof data.status !== "string") {
    throw new Error("Expected health response.");
  }

  return {
    status: data.status,
    service: optionalString(data.service),
    provider: optionalString(data.provider),
    projectRef: optionalString(data.projectRef),
    implementation: optionalString(data.implementation),
  };
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}
