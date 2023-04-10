describe("os", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("not linux", async () => {
    Object.defineProperty(process, "platform", {
      value: "darwin",
      writable: false,
      enumerable: true,
      configurable: true,
    });

    const { linux } = await import("../src/utils/os");

    expect(linux).toBeFalsy();
  });

  it("linux", async () => {
    Object.defineProperty(process, "platform", {
      value: "linux",
      writable: false,
      enumerable: true,
      configurable: true,
    });

    const { linux } = await import("../src/utils/os");

    expect(linux).toBeTruthy();
  });

  it("not win", async () => {
    Object.defineProperty(process, "platform", {
      value: "darwin",
      writable: false,
      enumerable: true,
      configurable: true,
    });

    const { win } = await import("../src/utils/os");

    expect(win).toBeFalsy();
  });

  it("win", async () => {
    Object.defineProperty(process, "platform", {
      value: "win32",
      writable: false,
      enumerable: true,
      configurable: true,
    });

    const { win } = await import("../src/utils/os");

    expect(win).toBeTruthy();
  });
});
