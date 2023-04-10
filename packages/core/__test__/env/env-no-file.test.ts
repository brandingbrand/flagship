/**
 * @jest-environment-options {"fixture": "__env-no-file_fixtures"}
 */

import { env } from "../../src/utils";

describe("env", () => {
  it("get no file", async () => {
    const value = env.get;

    expect(value).toEqual({});
  });
});
