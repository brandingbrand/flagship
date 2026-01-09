/**
 * @jest-environment-options {"requireTemplate": true, "reactNativeVersion": "0.73"}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import { fs, path } from '@brandingbrand/code-cli-kit';

import plugin from '../src';

describe('plugin-react-navigation', () => {
  it('android', async () => {
    await plugin.android?.(__flagship_code_build_config, {} as any);

    const mainActivity = await fs.readFile(path.android.mainActivity(__flagship_code_build_config), 'utf-8');

    expect(mainActivity).toContain(`package com.app

import android.os.Bundle
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory
import com.facebook.react.ReactActivity`);
    expect(mainActivity).toContain(`class MainActivity : ReactActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
      supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
      super.onCreate(savedInstanceState)
  }`);


    expect(await fs.readFile(path.android.androidManifest, 'utf-8')).toContain(
      'android:enableOnBackInvokedCallback="false"',
    );
  });
});
