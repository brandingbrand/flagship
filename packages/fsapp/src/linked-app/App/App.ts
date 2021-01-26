import type { AppConfig, AppConstructor, WebApplication } from './types';

import { NativeModules } from 'react-native';

import NativeConstants from '../../lib/native-constants';

import { StaticImplements } from '../utils';
import { AppBase } from './AppBase';

const { CodePush, EnvSwitcher } = NativeModules;

export interface CodePushVersion {
  label: string;
}

@StaticImplements<AppConstructor>()
export class App extends AppBase {
  public static async getVersion(config: AppConfig): Promise<string> {
    return CodePush?.getUpdateMetadata(CodePush.codePushUpdateStateRunning).then(
      (version: CodePushVersion) =>
        `${config.version ?? ''}${version?.label ?? ''}  env:${EnvSwitcher.envName ?? 'prod'}`
    );
  }

  public static getApp(): WebApplication | undefined {
    return;
  }

  public static shouldShowDevMenu(): boolean {
    return NativeConstants && NativeConstants.ShowDevMenu && NativeConstants.ShowDevMenu === 'true';
  }
}
