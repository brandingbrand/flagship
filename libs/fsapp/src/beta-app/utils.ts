import { StyleSheet } from 'react-native';
export * from './utils.base';

// No-op web exclusive APIs
export const CreateWebStyles: (obj: any) => StyleSheet.NamedStyles<any> = (obj: any) => obj;
export const unlockScroll = () => undefined;
export const lockScroll = () => undefined;
