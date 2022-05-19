import * as nodePath from 'path';

import * as android from '../src/lib/android';
import * as fs from '../src/lib/fs';

const mockProjectDir = nodePath.join(__dirname, 'mock_project');
const tempRootDir = nodePath.join(__dirname, '__android_test');
const appName = 'MOCKAPP';

global.process.cwd = () => nodePath.resolve(tempRootDir);

const getAppGradle = (): string =>
  fs.readFileSync(nodePath.join(tempRootDir, `android/app/build.gradle`)).toString();

const getstringXML = (): string =>
  fs
    .readFileSync(nodePath.join(tempRootDir, `android/app/src/main/res/values/strings.xml`))
    .toString();

const getManifest = (): string =>
  fs
    .readFileSync(nodePath.join(tempRootDir, `android/app/src/main/AndroidManifest.xml`))
    .toString();

const getNetworkSecurityConfig = (): string =>
  fs
    .readFileSync(
      nodePath.join(tempRootDir, 'android/app/src/main/res/xml/network_security_config.xml')
    )
    .toString();

const getGradleProperties = (): string =>
  fs.readFileSync(nodePath.join(tempRootDir, `android/gradle.properties`)).toString();

describe('android', () => {
  beforeEach(() => {
    fs.removeSync(tempRootDir);
    fs.copySync(mockProjectDir, tempRootDir);
  });

  afterEach(() => {
    fs.removeSync(tempRootDir);
  });

  it(`update bundle id`, () => {
    android.bundleId({
      name: appName,
      // @ts-expect-error only include needed values
      bundleIds: {
        android: `test.bundle.id`,
      },
    });

    expect(getAppGradle()).toMatch(`applicationId "test.bundle.id"`);
  });

  it(`update display name`, () => {
    // @ts-expect-error only include needed values
    android.displayName({
      name: appName,
      displayName: `Mock App`,
    });

    expect(getstringXML()).toMatch(`<string name="app_name">Mock App</string>`);
  });

  it(`update google map api key`, () => {
    // @ts-expect-error only include needed values
    android.googleMaps({
      name: appName,
      googleMapApiKey: `1231231231abc`,
    });

    expect(getManifest()).toMatch(`1231231231abc`);
  });

  it(`update icon`, () => {
    android.icon({
      name: appName,
      // @ts-expect-error only include needed values
      appIconDir: {
        android: nodePath.join(tempRootDir, `assets/appIcons/android`),
      },
    });

    const iconFilesSource = fs
      .readdirSync(nodePath.join(tempRootDir, `assets/appIcons/android`))
      .toString();
    const resourceFiles = fs
      .readdirSync(nodePath.join(tempRootDir, `android/app/src/main/res`))
      .toString();

    expect(resourceFiles).toMatch(iconFilesSource);
  });

  it(`update launch screen`, () => {
    android.launchScreen({
      name: appName,
      // @ts-expect-error only include needed values
      launchScreen: {
        android: nodePath.join(tempRootDir, `assets/launchScreen/android`),
      },
    });

    const launchScreenFilesSource = fs
      .readdirSync(nodePath.join(tempRootDir, `assets/launchScreen/android`))
      .toString();
    const resourceFiles = fs
      .readdirSync(nodePath.join(tempRootDir, `android/app/src/main/res`))
      .toString();

    expect(resourceFiles).toMatch(launchScreenFilesSource);
  });

  it('update activity attributes', () => {
    android.mainActivityAttributes({
      manifest: {
        activityAttributes: {
          'android:resizeableActivity': 'false',
        },
      },
    });

    expect(getManifest()).toContain('android:resizeableActivity');
  });

  it('add additional dependencies', () => {
    const firebaseDependency = 'implementation "com.google.firebase:firebase-messaging:17.3.4"';
    android.additionalDependencies({
      build: {
        additionalDependencies: [firebaseDependency],
      },
    });

    expect(getAppGradle()).toContain(firebaseDependency);
  });

  it('add additional permissions', () => {
    const externalWritePermission =
      '<uses-permission ' +
      'android:name="android.permission.WRITE_EXTERNAL_STORAGE" ' +
      'android:maxSdkVersion="18" />';
    android.additionalPermissions({
      manifest: {
        additionalPermissions: [externalWritePermission],
      },
    });

    expect(getManifest()).toContain(externalWritePermission);
  });

  it('update application attributes', () => {
    android.mainApplicationAttributes({
      manifest: {
        applicationAttributes: {
          'android:resizeableActivity': 'false',
        },
      },
    });

    expect(getManifest()).toContain('android:resizeableActivity');
  });

  it('add application elements', () => {
    const rnPushActivity =
      '<activity ' + 'android:name="com.reactnativenavigation.controllers.NavigationActivity" />';
    android.mainApplicationElements({
      manifest: {
        additionalElements: [rnPushActivity],
      },
    });

    expect(getManifest()).toContain(rnPushActivity);
  });

  it(`set url scheme without specifying urlScheme`, () => {
    // @ts-expect-error only include needed values
    android.urlScheme({
      name: appName,
    });

    expect(getManifest()).toMatch(`<data android:scheme="${appName.toLowerCase()}"`);
    expect(getManifest()).not.toMatch(`<data android:scheme="default-bb-rn-url-scheme"`);
  });

  it(`set url scheme by specifying urlScheme`, () => {
    // @ts-expect-error only include needed values
    android.urlScheme({
      name: appName,
      urlScheme: 'mockapp-app-url',
    });

    expect(getManifest()).toMatch(`<data android:scheme="mockapp-app-url"`);
    expect(getManifest()).not.toMatch(`<data android:scheme="default-bb-rn-url-scheme"`);
  });

  it('set url scheme host', () => {
    const newURLHost = 'app/app/app/app';
    android.urlSchemeHost({
      manifest: {
        urlSchemeHost: newURLHost,
      },
    });

    expect(getManifest()).toMatch(`android:host="${newURLHost}"`);
  });

  it(`update version number`, () => {
    const androidConfig = android.androidConfigWithDefault(undefined);
    const version = '1.3.2';
    android.version(version, androidConfig);

    expect(getGradleProperties()).toMatch(`VERSION_NAME=${version}`);
    expect(getGradleProperties()).toMatch(`VERSION_CODE_SHORT=01003002`);
  });

  it(`update version number with function`, () => {
    const androidConfig = android.androidConfigWithDefault({
      build: {
        versionName: () => '1.4.2',
        versionShortCode: () => '10004002',
        versionCode: '1610004002',
      },
    });
    const version = '1.3.2';
    android.version(version, androidConfig);

    expect(getGradleProperties()).toMatch(`VERSION_NAME=1.4.2`);
    expect(getGradleProperties()).toMatch(`VERSION_CODE_SHORT=10004002`);
    expect(getAppGradle()).toContain('1610004002');
  });

  it(`copy sentry properties`, () => {
    // @ts-expect-error only include needed values
    android.sentryProperties({
      name: appName,
      sentry: {
        propertiesPath: nodePath.join(tempRootDir, `assets/sentry.properties`),
      },
    });

    const sentryPropertiesPathSource = fs
      .readFileSync(nodePath.join(tempRootDir, `assets/sentry.properties`))
      .toString();
    const sentryPropertiesPath = fs
      .readFileSync(nodePath.join(tempRootDir, `android/sentry.properties`))
      .toString();

    expect(sentryPropertiesPathSource).toEqual(sentryPropertiesPath);
  });

  it(`set env switcher initial env`, () => {
    android.setEnvSwitcherInitialEnv(
      {
        name: appName,
      } as any,
      'stage2stage'
    );

    const EnvSwitcherFile = fs
      .readFileSync(
        nodePath.join(
          tempRootDir,
          `android/app/src/main/java/com/brandingbrand/reactnative/and/mockapp/EnvSwitcher.java`
        )
      )
      .toString();

    expect(EnvSwitcherFile).toMatch(
      `String initialEnvName = "stage2stage"; // [EnvSwitcher initialEnvName]`
    );
  });

  it('android exception domains', () => {
    android.exceptionDomains({
      name: appName,
      bundleIds: {
        android: `test.bundle.id`,
      },
      exceptionDomains: ['brandingbrand.com'],
    } as any);

    expect(getNetworkSecurityConfig()).toMatch(
      '<domain includeSubdomains="true">localhost</domain>'
    );
    expect(getNetworkSecurityConfig()).toMatch(
      '<domain includeSubdomains="true">10.0.2.2</domain>'
    );
    expect(getNetworkSecurityConfig()).toMatch(
      '<domain includeSubdomains="true">brandingbrand.com</domain>'
    );
  });
});
