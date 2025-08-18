export function encodeGameParams(params) {
  const json = JSON.stringify(params);
  return btoa(encodeURIComponent(json));
}

export function decodeGameParams(encoded) {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
}