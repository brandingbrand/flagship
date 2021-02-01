import type { AppConstructor } from './types';

import { AppRegistry } from 'react-native';

import { StaticImplements } from '../utils';
import { FSAppBase } from './app.base';

@StaticImplements<AppConstructor>()
export class FSAppBeta extends FSAppBase {
  private root: Element | null =
    (typeof this.config.root === 'string'
      ? document.querySelector(this.config.root)
      : this.config.root) ?? document.getElementById('root');

  public async startApplication(): Promise<void> {
    AppRegistry.runApplication('Flagship', {
      rootTag: this.root,
      initialProps: {}
    });
  }

  public async stopApplication(): Promise<void> {
    if (this.root) {
      // React Native Web hack due to unmatched Type Definitions
      // React Native Web aliases `unmountComponentAtNode` from `react-dom`
      AppRegistry.unmountApplicationComponentAtRootTag((this.root as unknown) as number);
    }
  }
}
