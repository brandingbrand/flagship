/**
 * @jest-environment-options {"requireTemplate": true, "fixtures": "privacy-info-xcprivacy_fixtures"}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import {type BuildConfig, fs, path} from '@brandingbrand/code-cli-kit';

import transformer from '../src/transformers/transformers-0.72/ios/privacy-info-xcprivacy';

describe('ios PrivacyInfo.xcprivacy transformers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should not update PrivacyInfo.xcprivacy file', async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    const origionalContent = await fs.readFile(
      path.ios.privacyManifest,
      'utf-8',
    );
    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.privacyManifest, 'utf-8');

    expect(content).toEqual(origionalContent);
  });

  it('should update PrivacyInfo.xcprivacy file', async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.ios.privacyManifestPath = './PrivacyInfo.xcprivacy';

    const privacyManifestContent = await fs.readFile(
      path.project.resolve('PrivacyInfo.xcprivacy'),
      'utf-8',
    );

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.ios.privacyManifest, 'utf-8');

    expect(content).toEqual(privacyManifestContent);
  });

  it('should throw error for wrong PrivacyInfo.xcprivacy path', async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;

    config.ios.privacyManifestPath = './blah/PrivacyInfo.xcprivacy';

    const privacyManifestAbsolutePath = path.project.resolve(
      config.ios.privacyManifestPath,
    );

    const throwError = async () => {
      await transformer.transform(config, {} as any);
    };

    await expect(throwError).rejects.toThrow(
      new Error(
        `[PrivacyInfoXCPrivacyTransformerError]: path to privacy manifest does not exist ${privacyManifestAbsolutePath}, please update privacyManifestPath to the correct path relative to the root of your React Native project.`,
      ),
    );
  });
});
