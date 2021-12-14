import { RoutableComponentClass } from '../types';

export const pathForScreen = (screen: RoutableComponentClass, key: string) => {
  return screen.path ? screen.path : `/_s/${key}/`;
};
