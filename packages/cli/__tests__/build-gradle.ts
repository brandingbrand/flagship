/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import {type BuildConfig, fs, path} from '@brandingbrand/code-cli-kit';

import transformer from '../src/transformers/transformers-0.72/android/build-gradle';

describe('build.gradle transformers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should update buildToolsVersion, minSdkVersion, compileSdkVersion, targetSdkVersion, ndkVersion and kotlinVersion', async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;
    config.android.gradle = {
      projectGradle: {
        buildToolsVersion: '34.0.0',
        minSdkVersion: 25,
        compileSdkVersion: 35,
        targetSdkVersion: 38,
        ndkVersion: '24.1.0',
        kotlinVersion: '1.8.0',
      },
    };

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.android.buildGradle, 'utf-8');

    expect(content).toContain('buildToolsVersion = "34.0.0"');
    expect(content).toContain('minSdkVersion = 25');
    expect(content).toContain('compileSdkVersion = 35');
    expect(content).toContain('targetSdkVersion = 38');
    expect(content).toContain('ndkVersion = "24.1.0"');
    expect(content).toContain('kotlinVersion = "1.8.0"');
  });

  it('should add attributes to ext object', async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;
    config.android.gradle = {
      projectGradle: {
        ext: ['RNNKotlinVersion = "1.10.1"'],
      },
    };

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.android.buildGradle, 'utf-8');

    expect(content).toContain(`ext {
        RNNKotlinVersion = "1.10.1"`);
  });

  it('should add repository to repositories object', async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;
    config.android.gradle = {
      projectGradle: {
        repositories: ['brandingbrand()'],
      },
    };

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.android.buildGradle, 'utf-8');

    expect(content).toContain(`repositories {
        brandingbrand()`);
  });

  it('should add dependency to dependencies object', async () => {
    const config = {
      ...__flagship_code_build_config,
    } as BuildConfig;
    config.android.gradle = {
      projectGradle: {
        dependencies: ['classpath("com.brandingbrand.tools.build:gradle")'],
      },
    };

    await transformer.transform(config, {} as any);
    const content = await fs.readFile(path.android.buildGradle, 'utf-8');

    expect(content).toContain(`dependencies {
        classpath("com.brandingbrand.tools.build:gradle")`);
  });
});
