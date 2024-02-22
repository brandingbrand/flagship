/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import plugin from "../src";

describe("plugin", () => {
  it("ios", async () => {
    await plugin.ios?.({} as any, {} as any);

    expect(true).toBeTruthy();
  });

  it("android", async () => {
    await plugin.android?.({} as any, {} as any);

    expect(true).toBeTruthy();
  });
});
