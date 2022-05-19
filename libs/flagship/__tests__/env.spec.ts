import * as nodePath from 'path';

import * as env from '../src/lib/env';
import * as fs from '../src/lib/fs';

const mockProjectDir = nodePath.join(__dirname, 'mock_project');
const tempRootDir = nodePath.join(__dirname, '__env_test');

global.process.cwd = () => nodePath.resolve(tempRootDir);

describe('env', () => {
  beforeEach(() => {
    fs.removeSync(tempRootDir);
    fs.copySync(mockProjectDir, tempRootDir);
  });

  afterEach(() => {
    fs.removeSync(tempRootDir);
  });

  it(`env configuration`, () => {
    process.env.FLAGSHIP_ENV_TEST = '123';
    const config = env.configuration('prop', {
      name: 'ccc/abc-efg_eds',
      version: '1.2.3',
    });

    expect(config).toMatchObject({
      name: 'MOCKAPP',
      test: 'abc',
      obj: {
        envTest: '123',
      },
      version: '1.2.3',
    });
  });

  it(`env configuration without env`, () => {
    const config = env.configuration('', {
      name: 'ccc/abc-efg_eds',
      version: '1.2.3',
    });

    expect(config).toMatchObject({
      name: 'AbcEfgEds',
      version: '1.2.3',
    });
  });

  it(`get env path`, () => {
    expect(env.path('prod')).toMatch(nodePath.join(tempRootDir, 'env/env.prod.js'));
  });

  it(`write env`, () => {
    env.write({ abc: 'efg' });
    const envBody = fs.readFileSync(nodePath.join(tempRootDir, 'env/env.js')).toString();

    expect(envBody).toMatch(`module.exports = {
  "abc": "efg"
}`);
  });
});
