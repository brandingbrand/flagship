import {Config} from '@brandingbrand/kernel-core';
import type {KernelPluginPermissions} from '@brandingbrand/kernel-plugin-permissions';

const prod: Config & KernelPluginPermissions = {
  ios: {
    name: 'kernel',
    bundleId: 'com.kernel',
    displayName: 'Kernel',
  },
  android: {
    name: 'kernel',
    packageName: 'com.kernel',
    displayName: 'Kernel',
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

export default prod;
