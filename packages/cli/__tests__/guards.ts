import { defineAction, defineTransformer } from "../src/lib/guards";

describe("defineAction function", () => {
  it("should return a Promise that resolves when the action completes successfully", async () => {
    const mockAction = async () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 100);
      });
    };

    const resultPromise = defineAction(mockAction, "Test Action");

    await expect(resultPromise()).resolves.toBeUndefined();
  });
});

describe("defineTransformer function", () => {
  it("should return the provided transformer object", () => {
    const mockTransformer = {
      file: "mockFile",
      transforms: [],
      transform: async () => {},
    };

    const result = defineTransformer(mockTransformer);

    expect(result).toEqual(mockTransformer);
  });
});
