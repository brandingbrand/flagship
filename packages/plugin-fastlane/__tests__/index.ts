/**
 * @jest-environment-options {"requireTemplate": true, "fixtures": "fixtures"}
 */

import {fs, type BuildConfig, path} from '@brandingbrand/code-cli-kit';

import plugin, {type CodePluginFastlane} from '../src';

describe('plugin-fastlane', () => {
  const config: BuildConfig & CodePluginFastlane = {
    ios: {
      bundleId: 'com.brandingbrand',
      displayName: 'Branding Brand',
      signing: {
        appleCert: './coderc/signing/AppleWWDRCA.cer',
        distCert: './coderc/signing/enterprise.cer',
        distP12: './coderc/signing/enterprise.p12',
        distCertType: 'iPhone Distribution',
        exportTeamId: '762H5V79XV',
        profilesDir: './coderc/signing',
        provisioningProfileName: 'In House Provisioning Profile',
        exportMethod: 'enterprise',
      },
    },
    android: {
      packageName: 'com.brandingbrand',
      displayName: 'Branding Brand',
      signing: {
        storeFile: './coderc/signing/release.keystore',
        keyAlias: 'androiddebugkey',
      },
    },
    codePluginFastlane: {
      plugin: {
        ios: {
          appCenter: {
            organization: 'Branding-Brand',
            appName: 'Example-iOS-Internal',
            destinationType: 'group',
            destinations: ['IAT'],
          },
        },
        android: {
          appCenter: {
            organization: 'Branding-Brand',
            appName: 'Example-Android-Store',
            destinationType: 'group',
            destinations: ['IAT'],
          },
        },
      },
    },
  };

  const configWithFirebase = {
    ...config,
    codePluginFastlane: {
      plugin: {
        ios: {
          firebase: {
            appId: '1234',
            groups: ['IAT'],
          },
        },
        android: {
          firebase: {
            appId: '4321',
            groups: ['IAT'],
          },
        },
      },
    },
  };

  const options = {
    release: false,
  };

  it('ios', async () => {
    await plugin.ios?.(config, options as any);

    expect(
      await fs.doesPathExist(
        path.project.resolve('ios', 'fastlane', 'Fastfile'),
      ),
    ).toBeTruthy();
    expect(
      await fs.doesPathExist(
        path.project.resolve('ios', 'fastlane', 'Pluginfile'),
      ),
    ).toBeTruthy();

    const fastfileContent = await fs.readFile(
      path.project.resolve('ios', 'fastlane', 'Fastfile'),
      'utf-8',
    );
    const gemfileContent = await fs.readFile(
      path.project.resolve('ios', 'Gemfile'),
      'utf-8',
    );

    expect(fastfileContent).toContain(
      `@profiles = ['${path.project.resolve('coderc', 'signing', 'enterprise.mobileprovision')}']`,
    );
    expect(fastfileContent).toContain(
      `certificate_path: '${path.project.resolve('coderc', 'signing', 'enterprise.cer')}'`,
    );
    expect(fastfileContent).toContain(
      `certificate_path: '${path.project.resolve('coderc', 'signing', 'enterprise.p12')}'`,
    );
    expect(fastfileContent).toContain(
      `certificate_path: '${path.project.resolve('coderc', 'signing', 'AppleWWDRCA.cer')}'`,
    );
    expect(fastfileContent).not.toContain('<%=');
    expect(fastfileContent).not.toContain('%>');
    expect(gemfileContent).toContain(`gem 'fastlane'

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)`);

    expect(fastfileContent).toContain('appcenter_upload');
    expect(fastfileContent).not.toContain('firebase_app_distribution');
  });

  it('ios with firebase config', async () => {
    await plugin.ios?.(configWithFirebase, options as any);

    expect(
      await fs.doesPathExist(
        path.project.resolve('ios', 'fastlane', 'Fastfile'),
      ),
    ).toBeTruthy();
    expect(
      await fs.doesPathExist(
        path.project.resolve('ios', 'fastlane', 'Pluginfile'),
      ),
    ).toBeTruthy();

    const fastfileContent = await fs.readFile(
      path.project.resolve('ios', 'fastlane', 'Fastfile'),
      'utf-8',
    );
    expect(fastfileContent).toContain('firebase_app_distribution');
    expect(fastfileContent).not.toContain('appcenter_upload');
  });

  it('android', async () => {
    await plugin.android?.(config, options as any);

    const fastfileContent = await fs.readFile(
      path.project.resolve('android', 'fastlane', 'Fastfile'),
      'utf-8',
    );
    const gemfileContent = await fs.readFile(
      path.project.resolve('android', 'Gemfile'),
      'utf-8',
    );

    expect(fastfileContent).not.toContain('<%=');
    expect(fastfileContent).not.toContain('%>');

    expect(fastfileContent).toContain('appcenter_upload');
    expect(fastfileContent).not.toContain('firebase_app_distribution');

    expect(gemfileContent).toContain(`gem 'fastlane'

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)`);

    expect(fastfileContent).toContain('appcenter_upload');
    expect(fastfileContent).not.toContain('firebase_app_distribution');
  });

  it('android bundle without increment build', async () => {
    await plugin.android?.(
      {
        ...config,
        android: {
          ...config.android,
          versioning: {version: '1.0.0', build: 5},
        },
      },
      options as any,
    );

    const fastfileContent = await fs.readFile(
      path.project.resolve('android', 'fastlane', 'Fastfile'),
      'utf-8',
    );
    const gemfileContent = await fs.readFile(
      path.project.resolve('android', 'Gemfile'),
      'utf-8',
    );

    expect(fastfileContent).not.toContain(`lane :appcenter_bundle do
  increment_build`);
    expect(fastfileContent).not.toContain('<%=');
    expect(fastfileContent).not.toContain('%>');
    expect(gemfileContent).toContain(`gem 'fastlane'

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)`);
  });

  it('android with firebase config', async () => {
    await plugin.android?.(configWithFirebase, options as any);

    const fastfileContent = await fs.readFile(
      path.project.resolve('android', 'fastlane', 'Fastfile'),
      'utf-8',
    );

    expect(fastfileContent).toContain('firebase_app_distribution');
    expect(fastfileContent).not.toContain('appcenter_upload');
  });
});
