import type { ComponentType } from 'react';
import type { ModalProps, StyleProp, ViewStyle } from 'react-native';
import type { ModalOptions as RNModalOptions, Options } from 'react-native-navigation';
import type { TopBarStyle } from '../router/types';

export interface ModalService {
  showModal<T>(modal: ModalComponentType<T, void>): Promise<T>;
  showModal<T, P>(modal: ModalComponentType<T, P>, props: P): Promise<T>;
  dismissModal(modalId: string): Promise<void>;
  dismissAllModals(): Promise<void>;
}

export interface ModalOptions extends RNModalOptions, ModalProps {
  readonly backdropStyle?: StyleProp<ViewStyle>;
  readonly title?: string;
  navigationOptions?: Options;
}

export interface ModalComponentProps<T = void> {
  readonly children?: never;
  resolve(data: T): void;
  reject(): void;
}

export type ModalComponentType<T = void, P = {}> = ComponentType<ModalComponentProps<T> & P> & {
  readonly __resolves: T;
  readonly definitionId: string;
  readonly options?: ModalOptions;
  readonly topBarOptions?: TopBarStyle;
};

export interface ModalProviderProps {
  readonly screenWrap?: ComponentType;
}
