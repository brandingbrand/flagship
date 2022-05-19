import { Injector } from '@brandingbrand/fslinker';

import type { ModalService } from '../modal';
import type { FSRouterHistory } from '../router';
import type { WebShell } from '../shell.web';

import { makeLegacyModal } from './components/legacy-modal.component';
import { BaseLegacyNavigator } from './internal/legacy-navigator.base';
import { LEGACY_ROUTES } from './internal/screens.token';
import { layoutToPath } from './internal/utils/layout-to-path';
import type { LegacyNavLayout, LegacyNavOptions, LegacyTab } from './legacy-navigator.type';

const legacyModals = () => {
  const legacyRouteEntries = [...(Injector.get(LEGACY_ROUTES) ?? [])];
  return new Map(legacyRouteEntries.map(([key, route]) => [key, makeLegacyModal(route.component)]));
};

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
    private readonly modals: ModalService,
    private readonly shell: WebShell
  ) {
    super();
  }

  private readonly modalScreens = legacyModals();

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
    this.router.open(layoutToPath({ name: alternateId ?? this.componentId }));
  }

  /**
   * @param layout
   * @deprecated
   */
  public async setStackRoot(layout: LegacyNavLayout): Promise<void> {
    await this.push(layout);
  }

  /**
   * @param options
   * @deprecated
   */
  public mergeOptions(options: LegacyNavOptions): void {
    if (options.sideMenu) {
      if (options.sideMenu.left && options.sideMenu.left.visible !== undefined) {
        this.shell.toggleLeftDrawer(options.sideMenu.left.visible);
      } else if (options.sideMenu.right && options.sideMenu.right.visible !== undefined) {
        this.shell.toggleRightDrawer(options.sideMenu.right.visible);
      }
    }
  }

  /**
   * @param newProps
   * @param alternateId
   * @deprecated
   */
  public async updateProps(newProps: object, alternateId?: string): Promise<void> {
    await this.push({ component: { name: this.componentId ?? alternateId, passProps: newProps } });
  }

  /**
   * @param layout
   * @deprecated
   */
  public async showModal(layout: LegacyNavLayout): Promise<void> {
    if (layout.component?.name) {
      const modal = this.modalScreens.get(`${layout.component.name}`);
      if (modal) {
        await this.modals.showModal(modal);
      }
    }
  }

  /**
   * @param _options
   * @param alternateId
   * @deprecated
   */
  public async dismissModal(_options?: LegacyNavOptions, alternateId?: string): Promise<void> {
    if (alternateId) {
      await this.modals.dismissModal(alternateId);
    }
  }

  /**
   * @deprecated
   */
  public async dismissAllModals(): Promise<void> {
    await this.modals.dismissAllModals();
  }
}
