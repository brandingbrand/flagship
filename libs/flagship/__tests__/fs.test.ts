import * as path from '../src/lib/path';
import * as fs from '../src/lib/fs';

import * as fsExtra from 'fs-extra';
import * as nodePath from 'path';

const mockProjectDir = nodePath.join(__dirname, 'mock_project');
const tempRootDir = nodePath.join(__dirname, '__fs_test');

global.process.cwd = () => nodePath.resolve(tempRootDir);

beforeEach(() => {
  fsExtra.removeSync(tempRootDir);
  fsExtra.copySync(mockProjectDir, tempRootDir);
});

afterEach(() => {
  fsExtra.removeSync(tempRootDir);
});

test(`clone`, () => {
  fs.clone('README.md');

  const sourceBody = fsExtra.readFileSync(path.flagship.resolve('README.md')).toString();
  const destinationBody = fsExtra.readFileSync(nodePath.join(tempRootDir, `README.md`)).toString();

  expect(sourceBody).toMatch(destinationBody);
});

test(`update`, () => {
  fs.update(
    nodePath.join(tempRootDir, `ios/Podfile`),
    `target 'MOCKAPP' do`,
    `target 'TESTAPP' do`
  );

  const body = fs.readFileSync(nodePath.join(tempRootDir, `ios/Podfile`)).toString();

  expect(body).toMatch(`target 'TESTAPP' do`);
});

test(`keyword does exist`, () => {
  expect(
    fs.doesKeywordExist(nodePath.join(tempRootDir, 'ios/Podfile'), 'Add new pods below this line')
  ).toBeTruthy();
});

test(`keyword doesn't exist`, () => {
  expect(
    fs.doesKeywordExist(
      nodePath.join(tempRootDir, 'ios/Podfile'),
      'this string has no business in our podfile'
    )
  ).toBeFalsy();
});

// Force to be treated as a module
export {};
