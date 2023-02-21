import { Plugin } from "@brandingbrand/code-core";

interface PluginTargetExtension {
  path: string;
  bundleId: string;
  frameworks?: string[];
  provisioningProfileName: string;
  buildSettings?: Record<string, unknown>;
}

export interface CodePluginTargetExtension {
  codePluginTargetExtension: Plugin<Array<PluginTargetExtension>>;
}
