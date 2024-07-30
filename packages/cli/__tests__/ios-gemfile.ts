/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import {type BuildConfig, fs, path} from '@brandingbrand/code-cli-kit';

import transformer from '../src/transformers/transformers-0.72/ios/gemfile';

jest.mock('../../cli-kit/src/lib/platform', () => ({
  getReactNativeVersion: () => '0.72',
}));

describe('ios gemfile transformers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should not update gemfile with dependencies', async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    const originalContent = await fs.readFile(path.ios.gemfile, 'utf-8');

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.gemfile, 'utf-8');

    expect(content).toEqual(originalContent);
  });

  it('should update gemfile with dependencies', async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.ios.gemfile = ["gem 'rails', '3.0.7'", "gem 'sqlite3'"];

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.gemfile, 'utf-8');

    expect(content).toContain("gem 'rails', '3.0.7'");
    expect(content).toContain("gem 'sqlite3'");
  });
});
