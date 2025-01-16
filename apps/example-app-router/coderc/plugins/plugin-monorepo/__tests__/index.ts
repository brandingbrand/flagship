/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import {fs, path} from '@brandingbrand/code-cli-kit';
import plugin from '../src';

describe('plugin', () => {
  it('ios', async () => {
    await plugin.ios?.({} as any, {} as any);

    const pbxProj = await fs.readFile(path.ios.projectPbxProj, 'utf-8');

    expect(pbxProj).toContain(
      '${REACT_NATIVE_PATH}/scripts/xcode/with-environment.sh',
    );
  });

  it('android', async () => {
    await plugin.android?.({} as any, {} as any);

    const appBuildGradle = await fs.readFile(
      path.android.appBuildGradle,
      'utf-8',
    );
    const settingsGradle = await fs.readFile(
      path.project.resolve('android', 'settings.gradle'),
      'utf-8',
    );

    expect(appBuildGradle).toContain('../../../node_modules');
    expect(settingsGradle).toContain('../../../node_modules');
  });
});
