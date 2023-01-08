import type { WebWebpackExecutorOptions } from '@nrwl/web/src/executors/webpack/webpack.impl';
import type { Configuration } from 'webpack';

export interface ProgrammaticEnvironment {
  options: Partial<WebWebpackExecutorOptions> & {
    transpileOnly?: boolean;
    html?: boolean;
    forkTsCheck?: boolean;
    esm?: boolean;
    keepNames?: boolean;
    envPrefix?: string;
    loadableComponentStats?: boolean;
    reactNativeImageLoader?: boolean;
    server?: boolean;
    target?: string;
  };
}

export interface BuildEnvironment {
  configuration: string;
  options: WebWebpackExecutorOptions & { target?: string };
}

export interface ServeEnvironment {
  configuration: string;
  buildOptions: WebWebpackExecutorOptions & { target?: string };
}

export type GetWebpackConfig = (
  config: Configuration,
  env?: BuildEnvironment | ProgrammaticEnvironment | ServeEnvironment,
  platform?: string
) => Configuration;
