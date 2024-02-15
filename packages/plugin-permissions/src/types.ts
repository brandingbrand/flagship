import type { Plugin } from "@brandingbrand/code-cli-kit";

import * as permissions from "./permissions";

export type CodePluginPermissions = {
  codePluginPermissions: Plugin<{
    ios?: IOSPermission[];
    android?: AndroidPermission[];
  }>;
};

type IOSPermission = {
  [T in keyof typeof permissions.ios]: {
    permission: T;
    text?: string;
    purposeKey?: string;
  } & ((typeof permissions.ios)[T]["usageKey"] extends undefined
    ? {}
    : { text: string }) &
    ((typeof permissions.ios)[T]["purposeKey"] extends undefined
      ? {}
      : { purposeKey: string });
}[keyof typeof permissions.ios];

type AndroidPermission = (typeof permissions.android)[number] | {};
