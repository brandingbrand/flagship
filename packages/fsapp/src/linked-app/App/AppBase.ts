import { AppRouter } from '../AppRouter';

export abstract class AppBase {
  protected constructor(private readonly router: AppRouter) {}
  public async openUrl(url: string): Promise<void> {
    await this.router.open(url);
  }
}
