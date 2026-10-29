import {
  trackPageView,
  trackKeyboardConnected,
  trackConnectFailed,
  trackAbyssOperation,
  trackAbyssFailed,
  classifyConnectError,
} from "../analytics";

describe("analytics (telemetry disabled)", () => {
  it("no-ops on all tracking functions without calling window.gtag", () => {
    const gtagMock = jest.fn();
    (window as unknown as { gtag?: jest.Mock }).gtag = gtagMock;

    expect(() => {
      trackPageView("Title", "/path");
      trackKeyboardConnected("serial", "MyKeyboard");
      trackConnectFailed("serial", "timeout");
      trackAbyssOperation("login");
      trackAbyssFailed("export", "network");
    }).not.toThrow();

    expect(gtagMock).not.toHaveBeenCalled();
    delete (window as unknown as { gtag?: unknown }).gtag;
  });

  describe("classifyConnectError", () => {
    it("classifies user cancellation", () => {
      expect(classifyConnectError(new Error("User cancelled selection"))).toBe(
        "cancelled",
      );
      expect(classifyConnectError({ name: "NotFoundError" })).toBe("cancelled");
    });

    it("classifies unsupported environments", () => {
      expect(classifyConnectError({ name: "NotSupportedError" })).toBe(
        "unsupported",
      );
    });

    it("classifies timeouts", () => {
      expect(classifyConnectError(new Error("Connection timed out"))).toBe(
        "timeout",
      );
    });

    it("defaults to error", () => {
      expect(classifyConnectError(new Error("Unknown failure"))).toBe("error");
    });
  });
});
