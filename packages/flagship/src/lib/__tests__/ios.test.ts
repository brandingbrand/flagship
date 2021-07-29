const ios = require(`../ios`);
const fs = require(`fs-extra`);
const nodePath = require(`path`);

const mockProjectDir = nodePath.join(__dirname, '..', '..', '..', '__tests__', `mock_project`);
const tempRootDir = nodePath.join(__dirname, `__ios_test`);
const appName = `MOCKAPP`;

global.process.cwd = () => nodePath.resolve(tempRootDir);

beforeEach(() => {
  fs.removeSync(tempRootDir);
  fs.copySync(mockProjectDir, tempRootDir);
});

afterEach(() => {
  fs.removeSync(tempRootDir);
});

test(`update bundle id`, () => {
  ios.bundleId({
    name: appName,
    bundleIds: {
      ios: `test.bundle.id`
    }
  });

  const infoPlist = fs
    .readFileSync(nodePath.join(tempRootDir, `ios`, appName, `Info.plist`))
    .toString();

  expect(infoPlist).toMatch(`<key>CFBundleIdentifier</key><string>test.bundle.id</string>`);
});

test(`enable capabilities`, () => {
  ios.capabilities({
    name: appName,
    enabledCapabilitiesIOS: [`Push`, `HomeKit`]
  });

  const pbxprojFile = fs
    .readFileSync(nodePath.join(tempRootDir, `ios`, `${appName}.xcodeproj`, `project.pbxproj`))
    .toString();

  expect(pbxprojFile).toMatch(`com.apple.Push = { enabled = 1;`);
  expect(pbxprojFile).toMatch(`com.apple.HomeKit = { enabled = 1;`);
});

test(`enable entitlements`, () => {
  ios.entitlements({
    name: appName,
    entitlementsFileIOS: `${appName}.entitlements`
  });

  const entitlementsFileSource = fs
    .readFileSync(nodePath.join(tempRootDir, `env`, `${appName}.entitlements`))
    .toString();
  const entitlementsFile = fs
    .readFileSync(nodePath.join(tempRootDir, `ios`, appName, `${appName}.entitlements`))
    .toString();
  const pbxprojFile = fs
    .readFileSync(nodePath.join(tempRootDir, `ios`, `${appName}.xcodeproj`, `project.pbxproj`))
    .toString();

  expect(entitlementsFileSource).toEqual(entitlementsFile);
  expect(pbxprojFile).toMatch(
    `CODE_SIGN_ENTITLEMENTS = ${appName + nodePath.sep + appName}.entitlements`
  );
});

test(`update display name`, () => {
  ios.displayName({
    name: appName,
    displayName: `Mock App`
  });

  const infoPlist = fs
    .readFileSync(nodePath.join(tempRootDir, `ios`, appName, `Info.plist`))
    .toString();

  expect(infoPlist).toMatch(`<key>CFBundleDisplayName</key><string>Mock App</string>`);
});

test(`update icon`, () => {
  ios.icon({
    name: appName,
    appIconDir: {
      ios: nodePath.join(tempRootDir, 'assets', 'appIcons', 'ios')
    }
  });

  const iconFilesSource = fs
    .readdirSync(nodePath.join(tempRootDir, 'assets', 'appIcons' , 'ios'))
    .toString();
  const iconFiles = fs
    .readdirSync(nodePath.join(tempRootDir, `ios`, appName, `Images.xcassets/AppIcon.appiconset`))
    .toString();

  expect(iconFilesSource).toEqual(iconFiles);
});

test(`update launch screen`, () => {
  ios.launchScreen({
    name: appName,
    launchScreen: {
      ios: {
        images: nodePath.join(tempRootDir, `assets`, `launchScreen`, `ios`, `images`),
        storyboard: nodePath.join(
          tempRootDir, `assets`, `launchScreen`, `ios`, `launchScreen.storyboard`)
      }
    }
  });

  const launchScreenImagesSource = fs
    .readdirSync(nodePath.join(tempRootDir, `assets`, `launchScreen`, `ios`, `images`))
    .toString();
  const launchScreenImages = fs
    .readdirSync(nodePath.join(tempRootDir, `ios`, appName, `LaunchImages.xcassets`))
    .toString();

  const xibSource = fs
    .readFileSync(
      nodePath.join(tempRootDir, `assets`, `launchScreen`, `ios`, `launchScreen.storyboard`))
    .toString();

  const xib = fs
    .readFileSync(nodePath.join(tempRootDir, `ios`, appName, `LaunchScreen.storyboard`))
    .toString();

  expect(launchScreenImagesSource).toEqual(launchScreenImages);
  expect(xibSource).toEqual(xib);
});

test(`add exception domains by string`, () => {
  ios.exceptionDomains({
    name: appName,
    exceptionDomains: [`some-domain.com`]
  });

  const infoPlist = fs
    .readFileSync(nodePath.join(tempRootDir, `ios`, appName, `Info.plist`))
    .toString();

  expect(infoPlist).toMatch(
    `<key>some-domain.com</key><dict><key>NSExceptionAllowsInsecureHTTPLoads</key><true/></dict>`
  );
});

test(`add exception domains by object`, () => {
  ios.exceptionDomains({
    name: appName,
    exceptionDomains: [{ domain: `some-domain.com`, value: `SOMEVALUE` }]
  });

  const infoPlist = fs
    .readFileSync(nodePath.join(tempRootDir, `ios`, appName, `Info.plist`))
    .toString();

  expect(infoPlist).toMatch(`<key>some-domain.com</key><dict>SOMEVALUE</dict>`);
});

test(`add exception domains with disableDevFeature turned off`, () => {
  ios.exceptionDomains({
    name: appName
  });

  const infoPlist = fs
    .readFileSync(nodePath.join(tempRootDir, `ios`, appName, `Info.plist`))
    .toString();

  expect(infoPlist).toMatch(
    `<key>localhost</key><dict><key>NSExceptionAllowsInsecureHTTPLoads</key><true/></dict>`
  );
});

test(`add exception domains with disableDevFeature turned on`, () => {
  ios.exceptionDomains({
    name: appName,
    disableDevFeature: true
  });

  const infoPlist = fs
    .readFileSync(nodePath.join(tempRootDir, `ios`, appName, `Info.plist`))
    .toString();

  expect(infoPlist).not.toMatch(`<key>localhost</key>`);
});

test(`add usage description`, () => {
  ios.usageDescription({
    name: appName,
    usageDescriptionIOS: [{ key: `Camera`, string: `Camera is needed for ${appName}` }]
  });

  const infoPlist = fs
    .readFileSync(nodePath.join(tempRootDir, `ios`, appName, `Info.plist`))
    .toString();

  expect(infoPlist).toMatch(`<key>Camera</key><string>Camera is needed for ${appName}</string>`);
});

test(`set url scheme without specifying urlScheme`, () => {
  ios.urlScheme({
    name: appName
  });

  const infoPlist = fs
    .readFileSync(nodePath.join(tempRootDir, `ios`, appName, `Info.plist`))
    .toString();

  expect(infoPlist).toMatch(
    new RegExp(`<key>CFBundleURLSchemes<\\/key>\\s+<array>\\s+<string>` +
      `${appName.toLowerCase()}<\\/string>\\s+</array>`)
  );
});

test(`set url scheme by specifying urlScheme`, () => {
  ios.urlScheme({
    name: appName,
    urlScheme: 'mockapp-app-url'
  });

  const infoPlist = fs
    .readFileSync(nodePath.join(tempRootDir, `ios`, appName, `Info.plist`))
    .toString();

  expect(infoPlist).toMatch(
    new RegExp(
      `<key>CFBundleURLSchemes<\\/key>\\s+<array>\\s+<string>mockapp-app-url<\\/string>\\s+</array>`
    )
  );
});

test(`update version number`, () => {
  const version = '1.3.2';
  ios.version(
    {
      name: appName
    },
    version
  );

  const infoPlist = fs
    .readFileSync(nodePath.join(tempRootDir, `ios`, appName, `Info.plist`))
    .toString();

  expect(infoPlist).toMatch(`<key>CFBundleShortVersionString</key>\n\t<string>${version}</string>`);
  expect(infoPlist).toMatch(`<key>CFBundleVersion</key>\n\t<string>01003002</string>`);
});

test('provide custom bundle version number', () => {
  const version = '1.3.2';
  ios.version(
    {
      name: appName,
      ios: {
        buildVersion: '1.3.3'
      }
    },
    version
  );

  const infoPlist = fs
    .readFileSync(nodePath.join(tempRootDir, `ios/${appName}/Info.plist`))
    .toString();

  expect(infoPlist).toMatch(`<key>CFBundleShortVersionString</key>\n\t<string>${version}</string>`);
  expect(infoPlist).toMatch(`<key>CFBundleVersion</key>\n\t<string>1.3.3</string>`);
});

test('provide custom short version number', () => {
  const version = '1.3.2';
  ios.version(
    {
      name: appName,
      ios: {
        shortVersion: '1.3.3'
      }
    },
    version
  );

  const infoPlist = fs
    .readFileSync(nodePath.join(tempRootDir, `ios/${appName}/Info.plist`))
    .toString();

  expect(infoPlist).toMatch(`<key>CFBundleShortVersionString</key>\n\t<string>1.3.3</string>`);
  expect(infoPlist).toMatch(`<key>CFBundleVersion</key>\n\t<string>01003002</string>`);
});

test(`set env switcher initial env`, () => {
  ios.setEnvSwitcherInitialEnv(
    {
      name: appName
    },
    'stage2stage'
  );

  const EnvSwitcherFile = fs
    .readFileSync(nodePath.join(tempRootDir, `ios`, appName, `EnvSwitcher.m`))
    .toString();

  expect(EnvSwitcherFile).toMatch(
    `NSString *initialEnvName =  @"stage2stage"; // [EnvSwitcher initialEnvName]`
  );
});

test(`copy sentry properties`, () => {
  ios.sentryProperties({
    name: appName,
    sentry: {
      propertiesPath: nodePath.join(tempRootDir, `assets`, `sentry.properties`)
    }
  });

  const sentryPropertiesPathSource = fs
    .readFileSync(nodePath.join(tempRootDir, `assets`, `sentry.properties`))
    .toString();
  const sentryPropertiesPath = fs
    .readFileSync(nodePath.join(tempRootDir, `ios`, `sentry.properties`))
    .toString();

  expect(sentryPropertiesPathSource).toEqual(sentryPropertiesPath);
});

test('targeted device should default to ios only', () => {
  const realPbxprojFile: string = fs
    .readFileSync(nodePath.join(
      __dirname, '..', '..', '..', 'ios', 'FLAGSHIP.xcodeproj', 'project.pbxproj'
    ))
    .toString();

  const targetMatches = realPbxprojFile.match(/TARGETED_DEVICE_FAMILY = "[1-9\,]+"/g);

  expect((targetMatches || []).length).toEqual(2);

  (targetMatches || []).forEach(match => {
    expect(match).toEqual('TARGETED_DEVICE_FAMILY = "1"');
  });
});

// Force to be treated as a module
export {};
