import { Config } from '@brandingbrand/kernel-core';
import type {KernelPluginPermissions} from '@brandingbrand/kernel-plugin-permissions';
import type {KernelPluginSplashScreen} from '@brandingbrand/kernel-plugin-splash-screen';

const dev: Config & KernelPluginPermissions & KernelPluginSplashScreen = {
  ios: {
    name: 'HelloWorld',
    bundleId: 'com.helloworld',
    displayName: 'Hello World',
  },
  android: {
    name: 'HelloWorld',
    displayName: 'Hello World',
    packageName: 'com.helloworld',
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

export default dev;
