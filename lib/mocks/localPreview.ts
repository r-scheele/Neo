export type LocalPreviewParamValue = string | string[] | undefined;

export function isLocalPreviewEnabled() {
  return __DEV__;
}

export function getLocalPreviewParamValue(value: LocalPreviewParamValue) {
  if (!isLocalPreviewEnabled()) {
    return undefined;
  }

  return Array.isArray(value) ? value[0] : value;
}

export function getLocalPreviewQueryString(
  params: Record<string, string | undefined>,
) {
  if (!isLocalPreviewEnabled()) {
    return "";
  }

  const query = Object.entries(params)
    .filter((entry): entry is [string, string] => typeof entry[1] === "string")
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");

  return query ? `?${query}` : "";
}
