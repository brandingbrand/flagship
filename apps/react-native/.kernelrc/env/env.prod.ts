import {Config, TargetedDevices} from '@brandingbrand/kernel-core';
import type {KernelPluginPermissions} from '@brandingbrand/kernel-plugin-permissions';

const prod: Config & KernelPluginPermissions = {
  ios: {
    name: 'kernel',
    bundleId: 'com.kerenl',
    displayName: 'Kernel',
    exceptionDomains: [
      {
        key: 'localhost',
        value: [
          {
            key: 'NSExceptionAllowsInsecureHTTPLoads',
            value: true,
          },
        ],
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
