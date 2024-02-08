import updateCheck from "update-check";

import { config } from "@/lib";
import info from "../src/actions/info";

jest.spyOn(console, "log").mockImplementation(jest.fn());
jest.spyOn(console, "warn").mockImplementation(jest.fn());
jest.spyOn(console, "info").mockImplementation(jest.fn());
jest.spyOn(console, "error").mockImplementation(jest.fn());

jest.mock("update-check");
jest.mock("@brandingbrand/code-cli-kit", () => ({
  ...jest.requireActual("@brandingbrand/code-cli-kit"),
  isWindows: false,
}));

describe("info action", () => {
  it("should not throw error", async () => {
    config.options = {
      build: "internal",
      env: "staging",
      command: "prebuild",
      platform: "native",
      release: false,
      verbose: false,
    };

    await info();

    expect(console.error).not.toHaveBeenCalled();
    expect(updateCheck).toHaveBeenCalled();
  });
});
