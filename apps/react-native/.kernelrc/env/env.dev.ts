import { Config } from '@brandingbrand/kernel-core';
import type {KernelPluginPermissions} from '@brandingbrand/kernel-plugin-permissions';

const dev: Config & KernelPluginPermissions = {
  ios: {
    name: 'HelloWorld',
    bundleId: 'com.helloworld',
    displayName: 'Hello World',
  },
  android: {
    displayName: 'Hello World',
    packageName: 'com.helloworld',
  },
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
};

export default dev;
