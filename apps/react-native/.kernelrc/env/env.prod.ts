import {Config} from '@brandingbrand/kernel-core';
import type {KernelPluginPermissions} from '@brandingbrand/kernel-plugin-permissions';
import type {KernelPluginSplashScreen} from '@brandingbrand/kernel-plugin-splash-screen';

const prod: Config & KernelPluginPermissions & KernelPluginSplashScreen = {
  ios: {
    name: 'kernel',
    bundleId: 'com.kerenl',
    displayName: 'Kernel',
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
};

export default prod;
