import type { ImageRequireSource, ModalProps, ViewStyle } from 'react-native';
import type {
  Layout,
  LayoutComponent,
  LayoutStack,
  LayoutStackChildren,
  ModalOptions,
  Options,
} from 'react-native-navigation';

/**
 * @deprecated
 */
export interface LegacyNavOptions extends Options {
  /**
   * @deprecated
   */
  modal?: LegacyNavModalOptions;
  /**
   * @deprecated
   */
  title?: string;
}

/**
 * @deprecated
 */
export interface LegacyNavModalOptions extends ModalOptions {
  /**
   * @deprecated
   */
  modalProps?: ModalProps;
  /**
   * @deprecated
   */
  style?: ViewStyle;
  /**
   * @deprecated
   */
  backdropStyle?: ViewStyle;
}

/**
 * @deprecated
 */
export interface LegacyNavLayoutComponent extends LayoutComponent {
  /**
   * @deprecated
   */
  options?: LegacyNavOptions;
}

/**
 * @deprecated
 */
export interface LegacyNavLayoutStackChildren extends LayoutStackChildren {
  /**
   * @deprecated
   */
  component?: LegacyNavLayoutComponent;
}

/**
 * @deprecated
 */
export interface LegacyNavLayoutStack extends LayoutStack {
  /**
   * @deprecated
   */
  children?: LegacyNavLayoutStackChildren[];
}

/**
 * @deprecated
 */
export interface LegacyNavLayout extends Layout {
  /**
   * @deprecated
   */
  stack?: LegacyNavLayoutStack;
  /**
   * @deprecated
   */
  component?: LegacyNavLayoutComponent;
}

/**
 * @deprecated
 */
export interface LegacyTab extends LayoutComponent {
  /**
   * @deprecated
   */
  id?: string;
  /**
   * @deprecated
   */
  label?: string;
  /**
   * @deprecated
   */
  title?: string;
  /**
   * @deprecated
   */
  icon?: ImageRequireSource;
  /**
   * @deprecated
   */
  selectedIcon?: ImageRequireSource;
}
