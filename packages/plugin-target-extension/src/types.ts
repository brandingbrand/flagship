import { Plugin } from "@brandingbrand/kernel-core";

interface PluginTargetExtension {
  path: string;
  bundleId: string;
  frameworks?: string[];
  provisioningProfileName: string;
  buildSettings?: Record<string, unknown>;
}

export interface KernelPluginTargetExtension {
  kernelPluginTargetExtension: Plugin<Array<PluginTargetExtension>>;
}
