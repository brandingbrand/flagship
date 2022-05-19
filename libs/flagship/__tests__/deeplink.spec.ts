import * as nodePath from 'path';

import * as deeplink from '../src/lib/deeplinking';
import * as fs from '../src/lib/fs';

const mockProjectDir = nodePath.join(__dirname, 'mock_project');
const tempRootDir = nodePath.join(__dirname, '__deeplink_test');

global.process.cwd = () => nodePath.resolve(tempRootDir);

const getManifest = (): string =>
  fs
    .readFileSync(nodePath.join(tempRootDir, `android/app/src/main/AndroidManifest.xml`))
    .toString();

describe('deeplink', () => {
  beforeEach(() => {
    fs.removeSync(tempRootDir);
    fs.copySync(mockProjectDir, tempRootDir);
  });

  afterEach(() => {
    fs.removeSync(tempRootDir);
  });

  it(`add deeplink hosts`, () => {
    deeplink.addDeeplinkHosts(['host1', 'host2']);

    const manifest = getManifest();

    expect(manifest).toMatch(`android:host="host1" />`);
    expect(manifest).toMatch(`android:host="host2" />`);
  });
});
