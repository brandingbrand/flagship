import { withAction, actions } from "../src/lib/action";

const mockPerformanceNow = jest.fn();
(global as any).performance = { now: mockPerformanceNow };

jest.mock("./errors", () => ({
  isWarning: jest.fn(),
}));

describe("withAction function", () => {
  beforeEach(() => {
    actions.length = 0;
  });

  it("should log a successful execution", async () => {
    const mockFn = jest.fn().mockResolvedValueOnce(undefined);
    (mockPerformanceNow as jest.Mock)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(100);
    await withAction(mockFn, "Test Function")();
    expect(actions).toEqual([
      expect.objectContaining({
        name: "Test Function",
        success: true,
        error: false,
        warning: false,
        time: `${(100 / 1000).toFixed(5)} s`,
      }),
    ]);
  });

  it("should log a failed execution with error", async () => {
    const mockFn = jest.fn().mockRejectedValueOnce(new Error("Test Error"));
    (mockPerformanceNow as jest.Mock)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(100);
    (require("./errors").isWarning as jest.Mock).mockReturnValueOnce(false);

    await withAction(mockFn, "Test Function")();
    expect(actions).toEqual([
      expect.objectContaining({
        name: "Test Function",
        success: false,
        error: true,
        warning: false,
        time: `${(100 / 1000).toFixed(5)} s`,
      }),
    ]);
  });

  it("should log a failed execution with warning", async () => {
    class TestWarning extends Error {
      constructor(message: string) {
        super(message);

        this.name = "TestWarning";
        this.message = `[${this.name}]: ${message}`;
      }
    }
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new TestWarning("Test Warning"));
    (mockPerformanceNow as jest.Mock)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(100);
    (require("./errors").isWarning as jest.Mock).mockReturnValueOnce(true);

    await withAction(mockFn, "Test Function")();
    expect(actions).toEqual([
      expect.objectContaining({
        name: "Test Function",
        success: false,
        error: false,
        warning: true,
        time: `${(100 / 1000).toFixed(5)} s`,
      }),
    ]);
  });
});
