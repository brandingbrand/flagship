import { NativeModules } from 'react-native';

const { NativeConstants } = NativeModules as { NativeConstants: Record<string, string> };

export { NativeConstants };
