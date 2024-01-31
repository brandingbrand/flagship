import {
  isOSX,
  isLinux,
  isWindows,
  canRunIOS,
  canRunAndroid,
} from "../src/lib/platform";

describe("Operating System Utilities", () => {
  describe("isOSX", () => {
    it("should be a boolean", () => {
      expect(typeof isOSX).toBe("boolean");
    });
  });

  describe("isLinux", () => {
    it("should be a boolean", () => {
      expect(typeof isLinux).toBe("boolean");
    });
  });

  describe("isWindows", () => {
    it("should be a boolean", () => {
      expect(typeof isWindows).toBe("boolean");
    });
  });

  describe("canRunIOS", () => {
    it('should return true for macOS and platform "ios"', () => {
      const options = { platform: "ios" };
      expect(canRunIOS(options)).toBe(true);
    });

    it('should return true for macOS and platform "native"', () => {
      const options = { platform: "native" };
      expect(canRunIOS(options)).toBe(true);
    });

    it("should return false for non-macOS environments", () => {
      const options = { platform: "android" };
      expect(canRunIOS(options)).toBe(false);
    });
  });

  describe("canRunAndroid", () => {
    it('should return true for macOS, Linux, or Windows and platform "android"', () => {
      const options = { platform: "android" };
      expect(canRunAndroid(options)).toBe(true);
    });

    it('should return true for macOS, Linux, or Windows and platform "native"', () => {
      const options = { platform: "native" };
      expect(canRunAndroid(options)).toBe(true);
    });

    it("should return false for non-macOS, non-Linux, and non-Windows environments", () => {
      const options = { platform: "ios" };
      expect(canRunAndroid(options)).toBe(false);
    });
  });
});
