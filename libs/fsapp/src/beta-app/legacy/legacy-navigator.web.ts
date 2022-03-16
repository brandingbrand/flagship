import type { FSRouterHistory } from '../router';
import type { ModalService } from '../modal';
import type { LegacyNavLayout, LegacyNavOptions, LegacyTab } from './legacy-navigator.type';

import { Injector } from '@brandingbrand/fslinker';

import { WebShell } from '../shell.web';

import { BaseLegacyNavigator } from './internal/legacy-navigator.base';
import { layoutToPath } from './internal/utils/layout-to-path';
import { LEGACY_ROUTES } from './internal/screens.token';

import { makeLegacyModal } from './components/legacy-modal.component';

const legacyModals = () => {
  const legacyRouteEntries = Array.from(Injector.get(LEGACY_ROUTES) ?? []);
  return new Map(
    legacyRouteEntries.map(([key, route]) => {
      return [key, makeLegacyModal(route.component)];
    })
  );
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
   * @deprecated
   */
  public async popTo(_options?: LegacyNavOptions, alternateId?: string): Promise<void> {
    this.router.open(layoutToPath({ name: alternateId ?? this.componentId }));
  }

  /**
   * @deprecated
   */
  public async setStackRoot(layout: LegacyNavLayout): Promise<void> {
    await this.push(layout);
  }

  /**
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
   * @deprecated
   */
  public async updateProps(newProps: object, alternateId?: string): Promise<void> {
    await this.push({ component: { name: this.componentId ?? alternateId, passProps: newProps } });
  }

  /**
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
