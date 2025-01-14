/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import {fs, path} from '@brandingbrand/code-cli-kit';
import plugin from '../src';

describe('plugin', () => {
  it('ios', async () => {
    await plugin.ios?.({} as any, {} as any);

    const infoPlist = await fs.readFile(path.ios.infoPlist, 'utf-8');

    expect(infoPlist).toContain(`<key>FlagshipEnv</key>
    <string>prod</string>
    <key>FlagshipDevMenu</key>
    <true/>`);
  });

  it('android', async () => {
    await plugin.android?.({} as any, {} as any);

    const strings = await fs.readFile(path.android.strings, 'utf-8');

    expect(strings).toContain('<string name="flagship_env">prod</string>');
    expect(strings).toContain('<string name="flagship_dev_menu">true</string>');
  });
});
