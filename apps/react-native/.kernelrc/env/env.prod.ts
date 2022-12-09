import type {PluginPermissionsConfig} from '@brandingbrand/kernel-plugin-permissions';

const prod: {} & PluginPermissionsConfig = {
  permissions: {
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
};

export default prod;
