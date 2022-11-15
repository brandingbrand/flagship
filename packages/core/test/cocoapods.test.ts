/* eslint-disable @typescript-eslint/ban-ts-comment */
import fs from "fs-extra";
import nodePath from "path";
import childProcess from "child_process";

import { cocoapods, os } from "../src";

const mockProjectDir = nodePath.join(__dirname, "fixtures", "mock_project");
const tempRootDir = nodePath.join(__dirname, "__cocoapods_test");

jest.mock("child_process");
global.process.cwd = () => nodePath.resolve(tempRootDir);

describe("cocoapods", () => {
  beforeAll(() => {
    // @ts-ignore
    os.linux = false;
    fs.removeSync(tempRootDir);
    fs.copySync(mockProjectDir, tempRootDir);
  });

  afterAll(() => {
    fs.removeSync(tempRootDir);
  });

  it("pod install", () => {
    let stashedCmd = "";

    (childProcess.execSync as jest.Mock).mockImplementation(
      (cmd: string) => (stashedCmd = cmd)
    );
    cocoapods.install();

    expect(stashedCmd).toMatch(
      `cd "${nodePath.join(tempRootDir, "ios")}" && pod install`
    );
  });

  it("pod install failing", () => {
    let stashedCode = null;

    // @ts-ignore Allow function to return
    global.process.exit = (code?: number): never => {
      stashedCode = code;
    };
    (childProcess.execSync as jest.Mock).mockImplementation(() => {
      throw new Error("");
    });

    cocoapods.install();

    expect(stashedCode).toEqual(1);
  });

  it("pod install on linux", () => {
    let stashedCode: number | undefined | null = null;
    let stashedCmd: string | null = null;

    // @ts-ignore Allow function to return
    global.process.exit = (code?: number): never => {
      stashedCode = code;
    };
    (childProcess.execSync as jest.Mock).mockImplementation(
      (cmd: string) => (stashedCmd = cmd)
    );

    // @ts-ignore
    os.linux = true;
    cocoapods.install();

    expect(stashedCode).toEqual(null);
    expect(stashedCmd).toEqual(null);
  });
});
