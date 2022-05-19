import type { RoutableComponentClass } from '../types';

export const pathForScreen = (screen: RoutableComponentClass, key: string) =>
  screen.path ? screen.path : `/_s/${key}/`;
