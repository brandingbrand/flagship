/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import {type BuildConfig, fs, path} from '@brandingbrand/code-cli-kit';

import transformer from '../src/transformers/transformers-0.72/ios/env-switcher-m';

describe('EnvSwitcher.m transformers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should not update EnvSwitcher.m with initialEnvName to staging', async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    await transformer.transform(config, {env: 'staging'} as any);
    const content = await fs.readFile(path.ios.envSwitcher, 'utf-8');

    expect(content).toContain('*initialEnvName =  @"staging"');
  });
});
