export function encodeGameParams(params) {
  const safeParams = {
    ...params,
    maxAttempts: params.maxAttempts === Infinity ? '∞' : params.maxAttempts,
  };
  const json = JSON.stringify(safeParams);
  return btoa(encodeURIComponent(json));
}

export function decodeGameParams(encoded) {
  try {
    const json = decodeURIComponent(atob(encoded));
    const parsed = JSON.parse(json);
    return {
      ...parsed,
      maxAttempts: parsed.maxAttempts === '∞' ? Infinity : parsed.maxAttempts,
    };
  } catch (err) {
    return null;
  }
}