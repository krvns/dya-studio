import {
  navigateTo,
  isSafeNavigationUrl,
  navigationBackend,
} from "../navigate";

describe("navigate utility", () => {
  let assignSpy: jest.SpyInstance;

  beforeEach(() => {
    assignSpy = jest
      .spyOn(navigationBackend, "assign")
      .mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("isSafeNavigationUrl", () => {
    it("allows https and http protocols", () => {
      expect(isSafeNavigationUrl("https://example.com")).toBe(true);
      expect(isSafeNavigationUrl("http://localhost:3000/app")).toBe(true);
    });

    it("rejects dangerous or malformed protocols", () => {
      expect(isSafeNavigationUrl("javascript:alert(1)")).toBe(false);
      expect(isSafeNavigationUrl("data:text/html,<b>evil</b>")).toBe(false);
      expect(isSafeNavigationUrl("file:///etc/passwd")).toBe(false);
      expect(isSafeNavigationUrl("not-a-url")).toBe(false);
      expect(isSafeNavigationUrl("")).toBe(false);
    });
  });

  describe("navigateTo", () => {
    it("navigates when URL is safe", () => {
      navigateTo("https://example.com/page");
      expect(assignSpy).toHaveBeenCalledWith("https://example.com/page");
    });

    it("blocks navigation and logs error when URL is unsafe", () => {
      navigateTo("javascript:alert(1)");
      expect(assignSpy).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        "Blocked navigation to unsafe URL:",
        "javascript:alert(1)",
      );
    });
  });
});
