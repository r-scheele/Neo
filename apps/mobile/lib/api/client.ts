import { resolveApiConfig } from "./config";
import { apiFailure, parseApiEnvelope, parseJsonText } from "./response";
import type {
  ApiDataParser,
  ApiFailure,
  ApiMethod,
  ApiResult,
  ApiTokenProvider,
} from "./types";

type Fetcher = (input: string, init?: RequestInit) => Promise<Response>;

type ApiClientOptions = {
  baseUrl?: string;
  fetcher?: Fetcher;
  getAuthToken?: ApiTokenProvider;
};

type ApiRequestOptions<TData> = {
  path: string;
  method?: ApiMethod;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  auth?: boolean;
  parseData: ApiDataParser<TData>;
};

export function createApiClient(options: ApiClientOptions = {}) {
  const configResult = resolveApiConfig(options.baseUrl);
  const fetcher = options.fetcher ?? fetch;

  async function request<TData>({
    path,
    method = "GET",
    body,
    headers,
    auth = true,
    parseData,
  }: ApiRequestOptions<TData>): Promise<ApiResult<TData>> {
    if (!configResult.ok) {
      return configResult;
    }

    const urlResult = buildRequestUrl(configResult.data.baseUrl, path);

    if (!urlResult.ok) {
      return urlResult;
    }

    const authHeaders = await getAuthHeaders(auth, options.getAuthToken);

    if (!authHeaders.ok) {
      return authHeaders;
    }

    try {
      const response = await fetcher(urlResult.data, {
        method,
        headers: {
          Accept: "application/json",
          ...(body ? { "Content-Type": "application/json" } : {}),
          ...authHeaders.data,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const rawBody = await response.text();
      const jsonResult = parseJsonText(rawBody);

      if (!jsonResult.ok) {
        return {
          ...jsonResult,
          status: response.status,
        };
      }

      return parseApiEnvelope(jsonResult.data, parseData, response.status);
    } catch {
      return apiFailure(
        "network_error",
        "network_error",
        "Neo could not reach the backend. Check your connection and try again.",
        0,
      );
    }
  }

  return {
    request,
  };
}

function buildRequestUrl(baseUrl: string, path: string): ApiResult<string> {
  const trimmedPath = path.trim().replace(/^\/+/, "");

  if (!trimmedPath || trimmedPath.includes("..")) {
    return apiFailure(
      "configuration_error",
      "invalid_api_path",
      "Neo backend is not configured correctly.",
      0,
    );
  }

  return {
    ok: true,
    data: `${baseUrl}/${trimmedPath}`,
    error: null,
    status: 0,
  };
}

async function getAuthHeaders(
  auth: boolean,
  getAuthToken: ApiTokenProvider | undefined,
): Promise<ApiResult<Record<string, string>>> {
  if (!auth) {
    return {
      ok: true,
      data: {},
      error: null,
      status: 0,
    };
  }

  if (!getAuthToken) {
    return authFailure("missing_auth_token_provider");
  }

  const token = await getAuthToken();

  if (!token) {
    return authFailure("missing_auth_token");
  }

  return {
    ok: true,
    data: {
      Authorization: `Bearer ${token}`,
    },
    error: null,
    status: 0,
  };
}

function authFailure(code: string): ApiFailure {
  return apiFailure(
    "auth_error",
    code,
    "Sign in again to continue.",
    401,
  );
}
