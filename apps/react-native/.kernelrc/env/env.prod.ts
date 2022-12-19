import {Config, TargetedDevices} from '@brandingbrand/kernel-core';
import type {KernelPluginPermissions} from '@brandingbrand/kernel-plugin-permissions';

const prod: Config & KernelPluginPermissions = {
  ios: {
    name: 'HelloWorld',
    bundleId: 'com.helloworld',
    displayName: 'Hello World',
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
    name: 'HelloWorld',
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

export default prod;
