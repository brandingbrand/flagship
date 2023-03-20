/// <reference path="../../src/types/app.d.ts" />

import {ENV} from '@brandingbrand/code-app';

const prod: ENV = {
  ios: {
    name: 'code',
    bundleId: 'com.code',
    displayName: 'Flagship Code™',
    versioning: {
      version: '0.0.1',
      build: 1,
    },
    plist: {
      NSAppTransportSecurity: {
        NSExceptionDomains: {
          localhost: {
            NSExceptionAllowsInsecureHTTPLoads: true,
          },
        },
      },
      UISupportedInterfaceOrientations: ['UIInterfaceOrientationPortrait'],
      urlScheme: {
        scheme: 'code',
      },
    },
    signing: {
      distCertType: 'iPhone Distribution',
      exportTeamId: '762H5V79XV',
      exportMethod: 'app-store',
      provisioningProfileName: 'Test Provisioning Profile',
      profilesDir: 'xx/xx',
      appleCert: 'xx/xx',
      distCert: 'xx/xx',
      distP12: 'xx/xx',
    },
    frameworks: [
      {
        framework: 'SpriteKit.framework',
      },
    ],
  },
  android: {
    name: 'code',
    displayName: 'Flagship Code™',
    packageName: 'com.code',
    versioning: {
      version: '0.0.1',
      build: 1,
    },
    manifest: {
      mainActivityAttributes: {
        "android:screenOrientation": "portrait"
      },
      urlScheme: {
        scheme: 'code',
      },
    },
    styles: {
      appThemeAttributes: {
        parent: 'Theme.AppCompat.Light.NoActionBar',
      },
    },
    strings: {
      string: [
        {
          $: {
            name: 'foo_bar',
          },
          _: 'Foobar',
        },
      ],
    },
  },
  app: {
    docs: {
      domain: 'https://feat-flagship-12--whimsical-tartufo-49504f.netlify.app',
      path: {
        plugins: '/en/packages/plugins',
      },
    },
  },
  codePluginPermissions: {
    plugin: {
      ios: [
        {
          permission: 'LOCATION_ALWAYS',
          text: 'Flagship Code would like to utilze your location',
        },
        {
          permission: 'CAMERA',
          text: 'Flagship Code would like to utilize your camera',
        },
      ],
      android: ['ACCESS_FINE_LOCATION', 'CAMERA'],
    },
  },
  codePluginSplashScreen: {
    plugin: {
      ios: {
        type: 'generated',
        generated: {
          logoPath: 'assets/splash-screen/ios/generated/logo.png',
          backgroundColor: '#1e2126',
        },
      },
      android: {
        type: 'generated',
        generated: {
          logoPath: 'assets/splash-screen/android/generated/logo.png',
          backgroundColor: '#1e2126',
        },
      },
    },
  },
  codePluginTargetExtension: {
    plugin: [
      {
        path: 'assets/extensions/notifications',
        bundleId: 'com.code.notifications',
        provisioningProfileName:
          'Code Notifications Store Provisioning Profile',
      },
    ],
  },
  codePluginFastlane: {
    plugin: {
      ios: {
        appCenter: {
          organization: 'Branding-Brand',
          appName: 'TestApp-iOS-Internal',
          destinationType: 'store',
          destinations: ['IAT', 'UAT'],
        },
        buildScheme: 'code',
      },
      android: {
        appCenter: {
          organization: 'Branding-Brand',
          appName: 'TestApp-Android-Internal',
          destinationType: 'store',
          destinations: ['IAT', 'UAT'],
        },
      },
    },
  },
  codePluginAsset: {
    plugin: {
      assetPath: ['assets/fonts'],
    },
  },
  codePluginAppIcon: {
    plugin: {
      appIconPath: 'assets/app-icon',
      android: {
        inset: 20,
      },
    },
  },
};

export default prod;
