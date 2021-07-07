import type { AppConfig, WebApplication } from './types';

import { NativeModules } from 'react-native';

const { CodePush, EnvSwitcher } = NativeModules;

export interface CodePushVersion {
  label: string;
}

export const getVersion = async (config: AppConfig): Promise<string> => {
  if (CodePush) {
    CodePush?.getUpdateMetadata(CodePush.codePushUpdateStateRunning).then(
      (version: CodePushVersion) =>
        `${config.version ?? ''}\n${version?.label ?? ''}\nenv:${EnvSwitcher.envName ?? 'prod'}`
    );
  }

  return `${config.version ?? ''}\nenv:${EnvSwitcher.envName ?? 'prod'}`;
};

export const getApp = (): WebApplication | undefined => {
  return undefined;
};
