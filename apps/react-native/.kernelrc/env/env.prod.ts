import type {Config} from '@brandingbrand/kernel-core';
import type {KernelPluginFastlane} from '@brandingbrand/kernel-plugin-fastlane';
import type {KernelPluginPermissions} from '@brandingbrand/kernel-plugin-permissions';
import type {KernelPluginSplashScreen} from '@brandingbrand/kernel-plugin-splash-screen';
import type {KernelPluginTargetExtension} from '@brandingbrand/kernel-plugin-target-extension';

const prod: Config &
  KernelPluginPermissions &
  KernelPluginSplashScreen &
  KernelPluginTargetExtension &
  KernelPluginFastlane = {
  ios: {
    name: 'kernel',
    bundleId: 'com.kernel',
    displayName: 'Kernel',
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
    },
    signing: {
      distCertType: 'iPhone Distribution',
      exportTeamId: '762H5V79XV',
      exportMethod: 'app-store',
      provisioningProfileName: 'Test Provisioning Profile',
      profilesDir: 'xx/xx',
      appleCert: 'xx/xx',
      distCert: 'xx/xx',
      distP12: 'xx/xx'
    },
    frameworks: [
      {
        framework: 'SpriteKit.framework',
      },
    ],
  },
  android: {
    name: 'kernel',
    displayName: 'Kernel',
    packageName: 'com.kernel',
    versioning: {
      version: '0.0.1',
      build: 1,
    },
    manifest: {
      urlScheme: {
        scheme: 'kernel',
      },
    },
  },
  app: {},
  kernelPluginPermissions: {
    kernel: {
      ios: [
        {
          permission: 'LOCATION_ALWAYS',
          text: 'Kernel would like to utilze your location',
        },
        {
          permission: 'CAMERA',
          text: 'Kernel would like to utilize your camera',
        },
      ],
      android: ['ACCESS_FINE_LOCATION', 'CAMERA'],
    },
  },
  kernelPluginSplashScreen: {
    kernel: {
      ios: {
        type: 'generated',
      },
      android: {
        type: 'generated',
      },
    },
  },
  kernelPluginTargetExtension: {
    kernel: [
      {
        path: 'assets/extensions/notifications',
        bundleId: 'com.kernel.notifications',
        provisioningProfileName:
          'Kernel Notifications Store Provisioning Profile',
      },
    ],
  },
  kernelPluginFastlane: {
    kernel: {
      ios: {
        appCenter: {
          organization: 'Branding-Brand',
          appName: 'TestApp-iOS-Internal',
          destinationType: 'store',
          destinations: ['IAT', 'UAT'],
        },
        buildScheme: 'kernel',
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
};

export default prod;
