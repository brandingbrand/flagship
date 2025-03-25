/**
 * @jest-environment-options {"requireTemplate": true, "reactNativeVersion": "0.73"}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import {type BuildConfig, fs, path} from '@brandingbrand/code-cli-kit';

import transformer from '../../src/transformers/transformers-0.73/android/main-application-kt';

describe('MainApplication.java transformers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should not update MainApplication.java with initialEnvName to staging', async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.android.packageName = 'com.app';

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(
      path.android.mainApplication(config),
      'utf-8',
    );

    expect(content).toContain('add(NativeConstantsPackage())');
    expect(content).toContain('add(EnvSwitcherPackage())');
  });
});
