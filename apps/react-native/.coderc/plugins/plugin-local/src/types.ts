import {Plugin} from '@brandingbrand/code-core';

interface PluginLocal {}

export interface KernelPluginLocal {
  kernelPluginLocal: Plugin<PluginLocal>;
}
