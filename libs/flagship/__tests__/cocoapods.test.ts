import * as cocoapods from '../src/lib/cocoapods';
import * as os from '../src/lib/os';

import * as childProcess from 'child_process';
import * as fs from 'fs-extra';
import * as nodePath from 'path';

const mockProjectDir = nodePath.join(__dirname, 'mock_project');
const tempRootDir = nodePath.join(__dirname, '__cocoapods_test');

jest.mock('child_process');
global.process.cwd = () => nodePath.resolve(tempRootDir);

beforeEach(() => {
  (os as any).linux = false;
  fs.removeSync(tempRootDir);
  fs.copySync(mockProjectDir, tempRootDir);
});

afterEach(() => {
  fs.removeSync(tempRootDir);
});

test(`pod install`, () => {
  let stashedCmd = '';

  (childProcess.execSync as jest.Mock).mockImplementation((cmd: string) => stashedCmd = cmd);
  cocoapods.install();

  expect(stashedCmd).toMatch(`cd "${nodePath.join(tempRootDir, 'ios')}" && pod install`);
});

test(`pod install failing`, () => {
  let stashedCode = null;

  // @ts-ignore Allow function to return
  global.process.exit = (code?: number): never => { stashedCode = code; };
  (childProcess.execSync as jest.Mock).mockImplementation((cmd: string) => { throw new Error(''); });

  cocoapods.install();

  expect(stashedCode).toEqual(1);
});

test(`pod install on linux`, () => {
  let stashedCode: number | undefined | null = null;
  let stashedCmd: string | null = null;

  // @ts-ignore Allow function to return
  global.process.exit = (code?: number): never => { stashedCode = code; };
  (childProcess.execSync as jest.Mock).mockImplementation((cmd: string) => stashedCmd = cmd);

  (os as any).linux = true;
  cocoapods.install();

  expect(stashedCode).toEqual(null);
  expect(stashedCmd).toEqual(null);
});

test(`add pod to podfile`, () => {
  cocoapods.add([
    'PODTEST1',
    'PODTEST2'
  ], nodePath.join(tempRootDir, `ios/Podfile`));

  const Podfile = fs
    .readFileSync(nodePath.join(tempRootDir, `ios/Podfile`))
    .toString();

  expect(Podfile).toMatch('PODTEST1');
  expect(Podfile).toMatch('PODTEST2');
});

test('add pod sources to podfile', () => {
  cocoapods.sources(['POD_SOURCE_1', 'POD_SOURCE_2']);
  const Podfile = fs
    .readFileSync(nodePath.join(tempRootDir, `ios/Podfile`))
    .toString();
  expect(Podfile).toMatch('POD_SOURCE_1');
  expect(Podfile).toMatch('POD_SOURCE_2');
});

// Force to be treated as a module
export {};
