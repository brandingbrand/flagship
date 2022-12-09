import type {PluginPermissionsConfig} from '@brandingbrand/kernel-plugin-permissions';

const dev: {} & PluginPermissionsConfig = {
  permissions: {
    ios: [
      {
        permission: 'LOCATION_WHEN_IN_USE',
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

export default dev;
