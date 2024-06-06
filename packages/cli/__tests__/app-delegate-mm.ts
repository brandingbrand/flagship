/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import {type BuildConfig, fs, path} from '@brandingbrand/code-cli-kit';

import transformer from '../src/transformers/ios/app-delegate-mm';

describe('AppDelegate.mm transformers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should not update AppDelegate.mm with RCTLinkingManager', async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.appDelegate, 'utf-8');

    expect(content).not.toContain('RCTLinkingManager');
  });

  it('should update AppDelegate.mm with RCTLinkingManager', async () => {
    const config = {
      ...__flagship_code_build_config,
      ios: {
        ...__flagship_code_build_config,
        plist: {
          urlScheme: {
            scheme: 'app',
          },
        },
      },
    } as BuildConfig;

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.appDelegate, 'utf-8');

    expect(content).toContain('#import <React/RCTLinkingManager.h>');
    expect(content).toContain(
      'if ([RCTLinkingManager application:application openURL:url options:options]) {',
    );
  });
});
