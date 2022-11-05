import type { StyleSheet } from 'react-native';

export * from './utils.base';

// No-op web exclusive APIs
export const CreateWebStyles = <T>(obj: T): StyleSheet.NamedStyles<T> =>
  obj as StyleSheet.NamedStyles<T>;
export const unlockScroll = (): void => undefined;
export const lockScroll = (): void => undefined;
