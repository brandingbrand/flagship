import type {DependencyProfile} from '../types';

/**
 * Package dependency configurations and requirements
 * Maps package names to their profile configurations
 */
export default {
  react: {
    version: '18.2.0',
    capabilities: ['@types/react'],
    required: true,
  },
  'react-native': {
    version: '^0.72.0',
    capabilities: [
      'react',
      'metro-react-native-babel-preset',
      '@react-native/metro-config',
    ],
    required: true,
  },
  'metro-react-native-babel-preset': {
    version: '^0.76.9',
    capabilities: ['@babel/core', '@babel/preset-env', '@babel/runtime'],
    devOnly: true,
  },
  '@babel/core': {
    version: '^7.20.0',
    devOnly: true,
  },
  '@babel/preset-env': {
    version: '^7.20.0',
    devOnly: true,
  },
  '@babel/runtime': {
    version: '^7.20.0',
    devOnly: true,
  },
  '@react-native/metro-config': {
    version: '^0.72.0',
    devOnly: true,
  },
  '@types/react': {
    version: '^18.2.0',
    devOnly: true,
  },
  '@types/react-native': {
    version: '1000.0.0',
    devOnly: true,
    banned: true,
  },
  '@brandingbrand/fsapp': {
    version: '>=10 <=13',
    capabilities: [
      'react-native-navigation',
      '@brandingbrand/react-native-app-restart',
      'react-native-device-info',
      '@react-native-async-storage/async-storage',
      'react-native-sensitive-info',
    ],
  },
  'react-native-navigation': {
    version: '^7.37.2',
  },
  '@brandingbrand/react-native-app-restart': {
    version: '^0.4.0',
  },
  'react-native-device-info': {
    version: '>=10.7.0',
  },
  '@react-native-async-storage/async-storage': {
    version: '>=1.23.1',
  },
  'react-native-sensitive-info': {
    version: '^5.0.0',
  },
} satisfies Record<string, DependencyProfile>;
