import * as deeplink from '../src/lib/deeplinking';
import * as fs from '../src/lib/fs';

import * as nodePath from 'path';

const mockProjectDir = nodePath.join(__dirname, 'mock_project');
const tempRootDir = nodePath.join(__dirname, '__deeplink_test');

global.process.cwd = () => nodePath.resolve(tempRootDir);

function getManifest(): string {
  return fs
    .readFileSync(nodePath.join(tempRootDir, `android/app/src/main/AndroidManifest.xml`))
    .toString();
}

beforeEach(() => {
  fs.removeSync(tempRootDir);
  fs.copySync(mockProjectDir, tempRootDir);
});

afterEach(() => {
  fs.removeSync(tempRootDir);
});

test(`add deeplink hosts`, () => {
  deeplink.addDeeplinkHosts(['host1', 'host2']);

  const manifest = getManifest();

  expect(manifest).toMatch(`android:host="host1" />`);
  expect(manifest).toMatch(`android:host="host2" />`);
});
