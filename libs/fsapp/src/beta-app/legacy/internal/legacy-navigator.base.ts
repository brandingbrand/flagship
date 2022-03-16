import type { LegacyNavLayout, LegacyNavOptions, LegacyTab } from '../legacy-navigator.type';

/**
 * @internal
 * @deprecated
 */
export abstract class BaseLegacyNavigator {
  /**
   * @deprecated
   */
  abstract componentId: string;

  /**
   * @deprecated
   */
  abstract tabs: LegacyTab[];

  /**
   * @deprecated
   */
  abstract push(layout: LegacyNavLayout, alternateId?: string): Promise<void>;

  /**
   * @deprecated
   */
  abstract pop(options?: LegacyNavOptions, alternateId?: string): Promise<void>;

  /**
   * @deprecated
   */
  abstract popToRoot(options?: LegacyNavOptions, alternateId?: string): Promise<void>;

  /**
   * @deprecated
   */
  abstract popTo(options?: LegacyNavOptions, alternateId?: string): Promise<void>;

  /**
   * @deprecated
   */
  abstract setStackRoot(layout: LegacyNavLayout, alternateId?: string): Promise<void>;

  /**
   * @deprecated
   */
  abstract showModal(layout: LegacyNavLayout): Promise<void>;

  /**
   * @deprecated
   */
  abstract dismissModal(options?: LegacyNavOptions, alternateId?: string): Promise<void>;

  /**
   * @deprecated
   */
  abstract dismissAllModals(options?: LegacyNavOptions): Promise<void>;

  /**
   * @deprecated
   */
  abstract updateProps(newProps: object, alternateId?: string): Promise<void>;

  /**
   * @deprecated
   */
  abstract mergeOptions(options: LegacyNavOptions, alternateId?: string): void;
}
