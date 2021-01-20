import type FSNetwork from '@brandingbrand/fsnetwork';

import type { WebApplication } from '../../fsapp/FSAppBase';
import type { AppRouter } from '../AppRouter';
import type { GenericState } from '../Store';

export abstract class AppBase<S extends GenericState> {
  protected constructor(protected readonly router: AppRouter, protected readonly api: FSNetwork) {}
  public async openUrl(url: string): Promise<void> {
    await this.router.open(url);
  }

  public abstract shouldShowDevMenu(): boolean;
  public abstract getApp(): WebApplication | undefined;
}
