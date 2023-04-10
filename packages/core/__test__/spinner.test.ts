import { start, stop } from "../src/utils/spinner";

describe("spinner", () => {
  jest.useFakeTimers();
  const setIntervalSpy = jest.spyOn(global, "setInterval");
  const clearIntervalSpy = jest.spyOn(global, "clearInterval");

  it("start", () => {
    start("test");

    expect(setIntervalSpy).toBeCalled();
  });

  it("stop", () => {
    stop();

    expect(clearIntervalSpy).toBeCalled();
  });
});
