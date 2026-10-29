/**
 * Analytics and telemetry are completely disabled.
 * All event tracking functions are inert no-ops with zero network activity.
 */
import type { ConnectionMethod } from "../components/DeviceConnection";
import type { AbyssFailReason } from "./abyss/abyssErrors";

/** Coarse, non-identifying bucket for a failed connection attempt. */
export type ConnectFailReason =
  | "cancelled"
  | "unsupported"
  | "timeout"
  | "error";

/** SPA page view - no-op (telemetry disabled). */
export function trackPageView(pageTitle: string, pagePath: string): void {
  void pageTitle;
  void pagePath;
}

/** Keyboard connected - no-op (telemetry disabled). */
export function trackKeyboardConnected(
  method: ConnectionMethod,
  name: string,
): void {
  void method;
  void name;
}

/** Connect failed - no-op (telemetry disabled). */
export function trackConnectFailed(
  method: ConnectionMethod,
  reason: ConnectFailReason,
): void {
  void method;
  void reason;
}

/** Keyboard Abyss operations - no-op (telemetry disabled). */
export type AbyssOperation = "login" | "export" | "import";

export function trackAbyssOperation(
  operation: AbyssOperation,
  params?: { mode?: "new" | "update"; sections?: string },
): void {
  void operation;
  void params;
}

export function trackAbyssFailed(
  operation: AbyssOperation,
  reason: AbyssFailReason,
): void {
  void operation;
  void reason;
}

/**
 * Map an arbitrary connection error to a coarse bucket.
 */
export function classifyConnectError(error: unknown): ConnectFailReason {
  const name =
    typeof error === "object" && error !== null && "name" in error
      ? String((error as { name?: unknown }).name)
      : "";
  const message = (
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : ""
  ).toLowerCase();

  if (
    name === "NotFoundError" ||
    name === "AbortError" ||
    message.includes("cancel") ||
    message.includes("no device selected") ||
    message.includes("user gesture")
  ) {
    return "cancelled";
  }
  if (name === "NotSupportedError" || message.includes("not supported")) {
    return "unsupported";
  }
  if (
    name === "TimeoutError" ||
    message.includes("timeout") ||
    message.includes("timed out")
  ) {
    return "timeout";
  }
  return "error";
}
