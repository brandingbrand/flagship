import { AppRegistry } from 'react-native';

import ReactDOMServer from 'react-dom/server';

import { StaticImplements } from '../utils';

import { FSAppBase } from './app.base';
import type { AppConstructor, AppServerElements } from './types';

export {
  APP_CONFIG_TOKEN,
  APP_VERSION_TOKEN,
  API_TOKEN,
  ENGAGEMENT_COMPONENT,
  ENGAGEMENT_SERVICE,
} from './app.base';

@StaticImplements<AppConstructor>()
export class FSAppBeta extends FSAppBase {
  public async startApplication(): Promise<void> {
    // Needs to wait for event loop to finish initialization
    // of router
    setTimeout(() => {
      this.markStable();
    }, 1000);
  }

  public stopApplication(): void {
    this.config.onDestroy?.();
  }

  public async getProfile(accountId?: string): Promise<string | undefined> {
    return undefined;
  }

  public getReactServerDom(): typeof ReactDOMServer {
    return ReactDOMServer;
  }

  public getApplication(): AppServerElements {
    return (
      AppRegistry as unknown as { getApplication: (app: string) => AppServerElements }
    ).getApplication('Flagship');
  }
}
