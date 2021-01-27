import { ComponentType } from 'react';
import type { ModalProps, StyleProp, ViewStyle } from 'react-native';
import type { ModalOptions as RNModalOptions } from 'react-native-navigation';

export interface ModalOptions extends RNModalOptions, ModalProps {
  backdropStyle?: StyleProp<ViewStyle>;
}

export interface ModalComponentProps<T = void> {
  resolve: (data: T) => void;
  reject: () => void;
  children?: never;
}

export type ModalComponentType<T = void> = ComponentType<ModalComponentProps<T>> & {
  type: string;
  resolves: T;
  options?: ModalOptions;
};
