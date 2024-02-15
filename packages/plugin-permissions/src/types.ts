import type { Plugin } from "@brandingbrand/code-cli-kit";

import * as permissions from "./permissions";

export type IOSPermissions = Record<string, { pod: string; usageKey?: string }>;

export type AndroidPermissions = string[];

export type CodePluginPermissions = {
  codePluginPermissions: Plugin<{
    ios?: {
      permission: keyof typeof permissions.ios;
      text?: string;
      purposeKey?: string;
    }[];
    android?: ((typeof permissions.android)[number] | (string & {}))[];
  }>;
};
