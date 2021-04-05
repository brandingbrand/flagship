import type { ComponentType } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface WebShell {
  toggleLeftDrawer(open?: boolean): void;
  toggleRightDrawer(open?: boolean): void;
}

export interface DrawerOptions {
  readonly slideShell?: true;
  readonly width?: number | string;
  readonly animationDuration?: string;
  readonly overlayOpacity?: number;
  readonly style?: StyleProp<ViewStyle>;
}

export interface DrawerComponentProps {
  readonly close: () => void;
  readonly children?: never;
}

export type DrawerComponentType = ComponentType<DrawerComponentProps> & {
  readonly options?: DrawerOptions;
};

export interface ShellConfig {
  readonly header?: ComponentType;
  readonly footer?: ComponentType;
  readonly leftDrawer?: DrawerComponentType;
  readonly rightDrawer?: DrawerComponentType;
}

