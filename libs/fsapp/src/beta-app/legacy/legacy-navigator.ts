import { Navigation } from 'react-native-navigation';

import type { ModalService } from '../modal';
import type { FSRouterHistory } from '../router';
import type { WebShell } from '../shell.web';

import { BaseLegacyNavigator } from './internal/legacy-navigator.base';
import { layoutToPath } from './internal/utils/layout-to-path';
import type { LegacyNavLayout, LegacyNavOptions, LegacyTab } from './legacy-navigator.type';

/**
 * @deprecated
 */
export class LegacyNavigator extends BaseLegacyNavigator {
  constructor(
    /**
     * @deprecated
     */
    public readonly componentId: string,
    /**
     * @deprecated
     */
    public readonly tabs: LegacyTab[],
    private readonly router: FSRouterHistory,
    private readonly _modals: ModalService,
    private readonly _shell: WebShell
  ) {
    super();
  }

  /**
   * @param layout
   * @param alternateId
   * @deprecated
   */
  public async push(layout: LegacyNavLayout, alternateId?: string): Promise<void> {
    if (alternateId) {
      this.router.pushTo(layoutToPath(layout), alternateId);
    } else {
      this.router.push(layoutToPath(layout));
    }
  }

  /**
   * @deprecated
   */
  public async pop(): Promise<void> {
    this.router.pop();
  }

  /**
   * @deprecated
   */
  public async popToRoot(): Promise<void> {
    this.router.popToRoot();
  }

  /**
   * @param _options
   * @param alternateId
   * @deprecated
   */
  public async popTo(_options?: LegacyNavOptions, alternateId?: string): Promise<void> {
    this.router.popTo(alternateId ?? this.componentId);
  }

  /**
   *
   * @param layout
   * @param alternateId
   * @deprecated
   */
  public async setStackRoot(layout: LegacyNavLayout, alternateId?: string): Promise<void> {
    await Navigation.setStackRoot(alternateId ?? this.componentId, layout);
  }

  /**
   * @param layout
   * @deprecated
   */
  public async showModal(layout: LegacyNavLayout): Promise<void> {
    await Navigation.showModal(layout);
  }

  /**
   * @param options
   * @param alternateId
   * @deprecated
   */
  public mergeOptions(options: LegacyNavOptions, alternateId?: string): void {
    Navigation.mergeOptions(alternateId ?? this.componentId, options);
  }

  /**
   * @param newProps
   * @param alternateId
   * @deprecated
   */
  public async updateProps(newProps: object, alternateId?: string): Promise<void> {
    Navigation.updateProps(alternateId ?? this.componentId, newProps);
  }

  /**
   * @param options
   * @param alternateId
   * @deprecated
   */
  public async dismissModal(options?: LegacyNavOptions, alternateId?: string): Promise<void> {
    await Navigation.dismissModal(alternateId ?? this.componentId, options);
  }

  /**
   * @param options
   * @deprecated
   */
  public async dismissAllModals(options?: LegacyNavOptions): Promise<void> {
    await Navigation.dismissAllModals(options);
  }
}
