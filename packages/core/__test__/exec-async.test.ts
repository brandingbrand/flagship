import process from "child_process";

import { async } from "../src/utils/exec-async";

describe("exec-async", () => {
  jest.mock("child_process");
  const spy = jest.spyOn(process, "exec");

  it("async", async () => {
    const cmd = "echo test";
    await async(cmd);

    expect(spy).toHaveBeenCalledWith(cmd, expect.anything());
  });
});
