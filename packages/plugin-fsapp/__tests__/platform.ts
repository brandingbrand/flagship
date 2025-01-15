/**
 * @jest-environment-options {"requireTemplate": true, "fixtures": "fixtures"}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import {fs, path} from '@brandingbrand/code-cli-kit';
import plugin, {
  getEnvironmentSwitcherPath,
  getNativeConstantsPath,
} from '../src';

jest.mock('bundle-require', () => ({
  bundleRequire: jest.fn().mockImplementation(async ({filepath}) => ({
    mod: {
      default: {
        domain: 'https://google.com',
      },
    },
  })),
}));

describe('platforms', () => {
  test('ios', async () => {
    await plugin.ios?.(
      {android: {packageName: 'com.app'}} as any,
      {env: 'prod', release: true} as any,
    );

    const projectEnvIndex = await fs.readFile(
      require.resolve('@brandingbrand/fsapp/src/project_env_index.js', {
        paths: [process.cwd()],
      }),
      'utf-8',
    );
    const pbxProj = await fs.readFile(path.ios.projectPbxProj, 'utf-8');

    expect(projectEnvIndex).toBe(`export const prod = {
  app: {
    default: {
      domain: \"https://google.com\"
    }
  }
};`);
    expect(pbxProj).toContain('NativeConstants.m');
    expect(pbxProj).toContain('EnvSwitcher.m');
    expect(
      await fs.doesPathExist(
        getEnvironmentSwitcherPath(
          {
            ios: {bundleId: 'com.app'},
            android: {packageName: 'com.app'},
          } as any,
          'ios',
        ),
      ),
    ).toBeTruthy();
    expect(
      await fs.doesPathExist(
        getEnvironmentSwitcherPath(
          {
            ios: {bundleId: 'com.app'},
            android: {packageName: 'com.app'},
          } as any,
          'ios',
        ),
      ),
    ).toBeTruthy();
  });

  test('android', async () => {
    await plugin.android?.(
      {android: {packageName: 'com.app'}} as any,
      {
        env: 'prod',
        release: true,
      } as any,
    );

    const projectEnvIndex = await fs.readFile(
      require.resolve('@brandingbrand/fsapp/src/project_env_index.js', {
        paths: [process.cwd()],
      }),
      'utf-8',
    );
    const mainApplication = await fs.readFile(
      path.android.mainApplication({android: {packageName: 'com.app'}} as any),
      'utf-8',
    );

    expect(projectEnvIndex).toBe(`export const prod = {
  app: {
    default: {
      domain: \"https://google.com\"
    }
  }
};`);
    expect(mainApplication).toContain('NativeConstantsPackage()');
    expect(mainApplication).toContain('EnvSwitcherPackage()');
    expect(
      await fs.doesPathExist(
        getEnvironmentSwitcherPath(
          {
            ios: {bundleId: 'com.app'},
            android: {packageName: 'com.app'},
          } as any,
          'android',
        ),
      ),
    ).toBeTruthy();
    expect(
      await fs.doesPathExist(
        getNativeConstantsPath(
          {
            ios: {bundleId: 'com.app'},
            android: {packageName: 'com.app'},
          } as any,
          'android',
        ),
      ),
    ).toBeTruthy();
  });
});
