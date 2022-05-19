import * as childProcess from 'child_process';
import * as nodePath from 'path';

import * as cocoapods from '../src/lib/cocoapods';
import * as fs from '../src/lib/fs';
import * as os from '../src/lib/os';

const mockProjectDir = nodePath.join(__dirname, 'mock_project');
const tempRootDir = nodePath.join(__dirname, '__cocoapods_test');

jest.mock('child_process');
global.process.cwd = () => nodePath.resolve(tempRootDir);

describe('cocoapods', () => {
  beforeEach(() => {
    (os as any).linux = false;
    fs.removeSync(tempRootDir);
    fs.copySync(mockProjectDir, tempRootDir);
  });

  afterEach(() => {
    fs.removeSync(tempRootDir);
  });

  it(`pod install`, () => {
    let stashedCmd = '';

    (childProcess.execSync as jest.Mock).mockImplementation((cmd: string) => (stashedCmd = cmd));
    cocoapods.install();

    expect(stashedCmd).toMatch(`cd "${nodePath.join(tempRootDir, 'ios')}" && pod install`);
  });

  it(`pod install failing`, () => {
    let stashedCode = null;

    // @ts-expect-error Allow function to return
    global.process.exit = (code?: number): never => {
      stashedCode = code;
    };
    (childProcess.execSync as jest.Mock).mockImplementation((cmd: string) => {
      throw new Error('');
    });

    cocoapods.install();

    expect(stashedCode).toBe(1);
  });

  it(`pod install on linux`, () => {
    let stashedCode: number | null | undefined = null;
    let stashedCmd: string | null = null;

    // @ts-expect-error Allow function to return
    global.process.exit = (code?: number): never => {
      stashedCode = code;
    };
    (childProcess.execSync as jest.Mock).mockImplementation((cmd: string) => (stashedCmd = cmd));

    (os as any).linux = true;
    cocoapods.install();

    expect(stashedCode).toBeNull();
    expect(stashedCmd).toBeNull();
  });

  it(`add pod to podfile`, () => {
    cocoapods.add(['PODTEST1', 'PODTEST2'], nodePath.join(tempRootDir, `ios/Podfile`));

    const Podfile = fs.readFileSync(nodePath.join(tempRootDir, `ios/Podfile`)).toString();

    expect(Podfile).toMatch('PODTEST1');
    expect(Podfile).toMatch('PODTEST2');
  });

  it('add pod sources to podfile', () => {
    cocoapods.sources(['POD_SOURCE_1', 'POD_SOURCE_2']);
    const Podfile = fs.readFileSync(nodePath.join(tempRootDir, `ios/Podfile`)).toString();

    expect(Podfile).toMatch('POD_SOURCE_1');
    expect(Podfile).toMatch('POD_SOURCE_2');
  });
});
