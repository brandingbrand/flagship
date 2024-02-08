/**
 * @jest-environment-options {"requireTemplate": true}
 */
import updateCheck from "update-check";

import { config } from "@/lib";
import info from "../src/actions/info";

jest.spyOn(console, "log").mockImplementation(jest.fn());
jest.spyOn(console, "warn").mockImplementation(jest.fn());
jest.spyOn(console, "info").mockImplementation(jest.fn());
jest.spyOn(console, "error").mockImplementation(jest.fn());

jest.mock("update-check");
jest.mock("@brandingbrand/code-cli-kit", () => ({
  ...jest.requireActual("@brandingbrand/code-cli-kit"), // Use the actual 'os' module implementation
  isWindows: true,
}));

describe("info action", () => {
  it("should throw error", async () => {
    config.options = {
      build: "internal",
      env: "staging",
      command: "prebuild",
      platform: "native",
      release: false,
      verbose: false,
    };

    await info();

    expect(console.error).toHaveBeenCalled();
    expect(updateCheck).not.toHaveBeenCalled();
  });
});
