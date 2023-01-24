import { Config } from '@brandingbrand/kernel-core';
import { KernelPluginLocal } from './types';
declare const ios: (config: Config & KernelPluginLocal) => void;
declare const android: (config: Config & KernelPluginLocal) => void;
export * from './types';
export { ios, android };
