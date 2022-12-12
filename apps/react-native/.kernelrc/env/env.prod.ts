import type {KernelPluginPermissions} from '@brandingbrand/kernel-plugin-permissions';

const prod: {[key: string]: any} & KernelPluginPermissions = {
  ios: {
    foo: 'bar',
  },
  android: {
    foo: 'bar',
  },
  kernelPluginPermissions: {
    ios: {
      foo: 'baz',
    },
    android: {
      foo: 'alpha'
    },
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
