import type {Config} from '@brandingbrand/kernel-core';
import type {KernelPluginPermissions} from '@brandingbrand/kernel-plugin-permissions';
import type {KernelPluginSplashScreen} from '@brandingbrand/kernel-plugin-splash-screen';
import type {KernelPluginFastlane} from '@brandingbrand/kernel-plugin-fastlane';

const dev: Config &
  KernelPluginPermissions &
  KernelPluginSplashScreen &
  KernelPluginFastlane = {
  ios: {
    name: 'HelloWorld',
    bundleId: 'com.helloworld',
    displayName: 'Hello World',
    versioning: {
      version: '0.0.1',
      build: 1,
    },
    signing: {
      exportTeamId: '762H5V79XV',
      exportMethod: 'test',
      provisioningProfileName: 'Test Provisioning Profile',
      profilesDir: './xx',
    },
  },
  android: {
    name: 'HelloWorld',
    displayName: 'Hello World',
    packageName: 'com.helloworld',
    versioning: {
      version: '0.0.1',
      build: 1,
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
  kernelPluginFastlane: {
    kernel: {
      ios: {
        appCenter: {
          organization: 'Branding-Brand',
          appName: 'TestApp-iOS-Internal',
          destinationType: 'test',
          destinations: ['IAT', 'UAT'],
        },
        buildScheme: 'enterprise',
      },
      android: {
        appCenter: {
          organization: 'Branding-Brand',
          appName: 'TestApp-Android-Internal',
          destinationType: 'test',
          destinations: ['IAT', 'UAT'],
        },
      },
    },
  },
};

export default dev;
