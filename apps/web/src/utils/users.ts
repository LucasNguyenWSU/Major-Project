export function normalizeUsername(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function normalizeDisplayName(value: unknown, fallback: string) {
  const displayName = typeof value === "string" ? value.trim() : "";
  return displayName || fallback;
}

export function isValidUsername(username: string) {
  return /^[a-z0-9_-]{3,24}$/.test(username);
}

export function isValidDisplayName(displayName: string) {
  return displayName.length >= 2 && displayName.length <= 40;
}

export function isValidPassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= 6;
}
