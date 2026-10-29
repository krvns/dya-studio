/**
 * Navigation utility
 * Abstracted so it can be easily mocked in tests.
 * Enforces http/https protocol validation to prevent javascript: or data: injection.
 */
export function isSafeNavigationUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export const navigationBackend = {
  assign(url: string): void {
    window.location.assign(url);
  },
};

export function navigateTo(url: string): void {
  if (!isSafeNavigationUrl(url)) {
    console.error("Blocked navigation to unsafe URL:", url);
    return;
  }
  navigationBackend.assign(url);
}
