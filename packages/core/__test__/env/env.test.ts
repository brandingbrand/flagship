/**
 * @jest-environment-options {"fixture": "__env_fixtures", "additionalDirectory": "./fixtures"}
 */

import { env } from "../../src/utils";

describe("env", () => {
  it("get with fixtures", async () => {
    const value = env.get;

    expect(value).toEqual({
      ios: {
        name: "code",
        bundleId: "com.code",
        displayName: "Flagship Code™",
      },
      android: {
        name: "code",
        displayName: "Flagship Code™",
        packageName: "com.code",
      },
      app: {},
    });
  });

  it("set", async () => {
    const mock = {
      ios: {
        name: "unittest",
      },
      android: {
        name: "unittest",
      },
    };

    env.set = mock;

    expect(env.get).toEqual(mock);
  });
});
