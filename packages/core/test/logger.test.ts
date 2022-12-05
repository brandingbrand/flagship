/* eslint-disable @typescript-eslint/no-empty-function */

import * as logger from "../src/utils/logger";

describe("logger", () => {
  beforeAll(() => {
    Object.defineProperty(process.env, "NODE_ENV", {
      value: "prod",
      writable: false,
      enumerable: true,
      configurable: true,
    });
  });

  it("log", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => {});
    logger.logInfo("test");

    expect(spy).toHaveBeenCalledWith(
      `\n${logger.colors.BgBlue} INFO ${logger.colors.Reset}`,
      "test"
    );
  });

  it("warn", () => {
    const spy = jest.spyOn(console, "warn").mockImplementation(() => {});
    logger.logWarn("test");

    expect(spy).toHaveBeenCalledWith(
      `\n${logger.colors.BgYellow}${logger.colors.FgBlack} WARN ${logger.colors.Reset}`,
      "test"
    );
  });

  it("error", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    logger.logError("test");

    expect(spy).toHaveBeenCalledWith(
      `\n${logger.colors.BgRed} ERROR ${logger.colors.Reset}`,
      "test"
    );
  });
});
