import type { RoutableComponentClass } from '../types';
import type { FlatListProps } from 'react-native';

export const pathForScreen = (screen: RoutableComponentClass, key: string) => {
  return screen.path ? screen.path : `/_s/${key}/`;
};

export function setKeyExtractor<T>(key?: keyof T): FlatListProps<T>['keyExtractor'] {
  return (item: T, index: number) => {
    if (item !== null && !!key) {
      return !!item[key] ? String(item[key]) : index.toString();
    }

    return index.toString();
  };
}
