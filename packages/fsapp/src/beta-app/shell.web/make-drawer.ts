import type { ComponentType } from 'react';
import type { Mutable } from '../utils';
import type { DrawerComponentProps, DrawerComponentType, DrawerOptions } from './types';

export const makeDrawer = (
  component: ComponentType<DrawerComponentProps>,
  options?: DrawerOptions
) => {
  const drawer = component as Mutable<DrawerComponentType>;
  drawer.options = options;
  return drawer as DrawerComponentType;
};
