const android = require(`../android`);
const fs = require(`fs-extra`);
const nodePath = require(`path`);

const mockProjectDir = nodePath.join(__dirname, '..', '..', '..', '__tests__', `mock_project`);
const tempRootDir = nodePath.join(__dirname, `__android_test`);
const appName = `MOCKAPP`;

global.process.cwd = () => nodePath.resolve(tempRootDir);

beforeEach(() => {
  fs.removeSync(tempRootDir);
  fs.copySync(mockProjectDir, tempRootDir);
});

afterEach(() => {
  fs.removeSync(tempRootDir);
});

function getAppGradle(): string {
  return fs.readFileSync(nodePath.join(tempRootDir, `android/app/build.gradle`)).toString();
}

function getstringXML(): string {
  return fs
    .readFileSync(nodePath.join(tempRootDir, `android/app/src/main/res/values/strings.xml`))
    .toString();
}

function getManifest(): string {
  return fs
    .readFileSync(nodePath.join(tempRootDir, `android/app/src/main/AndroidManifest.xml`))
    .toString();
}

function getNetworkSecurityConfig(): string {
  return fs
    .readFileSync(
      nodePath.join(tempRootDir, 'android/app/src/main/res/xml/network_security_config.xml')
    )
    .toString();
}

function getGradleProperties(): string {
  return fs.readFileSync(nodePath.join(tempRootDir, `android/gradle.properties`)).toString();
}

test(`update bundle id`, () => {
  android.bundleId({
    name: appName,
    bundleIds: {
      android: `test.bundle.id`
    }
  });

  expect(getAppGradle()).toMatch(`applicationId "test.bundle.id"`);
});

test(`update display name`, () => {
  android.displayName({
    name: appName,
    displayName: `Mock App`
  });

  expect(getstringXML()).toMatch(`<string name="app_name">Mock App</string>`);
});

test(`update google map api key`, () => {
  android.googleMaps({
    name: appName,
    googleMapApiKey: `1231231231abc`
  });

  expect(getManifest()).toMatch(`1231231231abc`);
});

test(`update icon`, () => {
  android.icon({
    name: appName,
    appIconDir: {
      android: nodePath.join(tempRootDir, `assets/appIcons/android`)
    }
  });

  const iconFilesSource = fs
    .readdirSync(nodePath.join(tempRootDir, `assets/appIcons/android`))
    .toString();
  const resourceFiles = fs
    .readdirSync(nodePath.join(tempRootDir, `android/app/src/main/res`))
    .toString();

  expect(resourceFiles).toMatch(iconFilesSource);
});

test(`update launch screen`, () => {
  android.launchScreen({
    name: appName,
    launchScreen: {
      android: nodePath.join(tempRootDir, `assets/launchScreen/android`)
    }
  });

  const launchScreenFilesSource = fs
    .readdirSync(nodePath.join(tempRootDir, `assets/launchScreen/android`))
    .toString();
  const resourceFiles = fs
    .readdirSync(nodePath.join(tempRootDir, `android/app/src/main/res`))
    .toString();

  expect(resourceFiles).toMatch(launchScreenFilesSource);
});

test(`set url scheme without specifying urlScheme`, () => {
  android.urlScheme({
    name: appName
  });

  expect(getManifest()).toMatch(`<data android:scheme="${appName.toLowerCase()}"`);
  expect(getManifest()).not.toMatch(`<data android:scheme="default-bb-rn-url-scheme"`);
});

test(`set url scheme by specifying urlScheme`, () => {
  android.urlScheme({
    name: appName,
    urlScheme: 'mockapp-app-url'
  });

  expect(getManifest()).toMatch(`<data android:scheme="mockapp-app-url"`);
  expect(getManifest()).not.toMatch(`<data android:scheme="default-bb-rn-url-scheme"`);
});

test(`update version number`, () => {
  const version = '1.3.2';
  android.version(version);

  expect(getGradleProperties()).toMatch(`VERSION_NAME=${version}`);
  expect(getGradleProperties()).toMatch(`VERSION_CODE_SHORT=01003002`);
});

test(`copy sentry properties`, () => {
  android.sentryProperties({
    name: appName,
    sentry: {
      propertiesPath: nodePath.join(tempRootDir, `assets/sentry.properties`)
    }
  });

  const sentryPropertiesPathSource = fs
    .readFileSync(nodePath.join(tempRootDir, `assets/sentry.properties`))
    .toString();
  const sentryPropertiesPath = fs
    .readFileSync(nodePath.join(tempRootDir, `android/sentry.properties`))
    .toString();

  expect(sentryPropertiesPathSource).toEqual(sentryPropertiesPath);
});

test(`set env switcher initial env`, () => {
  android.setEnvSwitcherInitialEnv(
    {
      name: appName
    },
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

test('android exception domains', () => {
  android.exceptionDomains({
    name: appName,
    bundleIds: {
      android: `test.bundle.id`
    },
    exceptionDomains: ['brandingbrand.com']
  });

  expect(getNetworkSecurityConfig()).toMatch('<domain includeSubdomains="true">localhost</domain>');
  expect(getNetworkSecurityConfig()).toMatch('<domain includeSubdomains="true">10.0.2.2</domain>');
  expect(getNetworkSecurityConfig()).toMatch(
    '<domain includeSubdomains="true">brandingbrand.com</domain>'
  );
});
