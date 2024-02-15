import type { Plugin } from "@brandingbrand/code-cli-kit";

import * as permissions from "./permissions";

/**
 * Represents a set of permissions required by a Code Plugin for both iOS and Android platforms.
 */
export type CodePluginPermissions = {
  /**
   * A plugin object specifying permissions required for a Code Plugin.
   */
  codePluginPermissions: Plugin<{
    /**
     * Permissions required for the iOS platform.
     */
    ios?: IOSPermission[];
    /**
     * Permissions required for the Android platform.
     */
    android?: AndroidPermission[];
  }>;
};

type IOSPermission = {
  [T in keyof typeof permissions.ios]: {
    /**
     * The permission key for the iOS permission.
     */
    permission: T;

    /**
     * Optional text providing additional information about the permission.
     * This property is required if the usageKey for the permission is defined.
     */
    text?: string;

    /**
     * Optional purpose key for the permission.
     * This property is required if the purposeKey for the permission is defined.
     */
    purposeKey?: string;
  } & /**
   * Conditional type to enforce 'text' property requirement based on 'usageKey'.
   */ ((typeof permissions.ios)[T]["usageKey"] extends undefined
    ? {} // If 'usageKey' is undefined, 'text' is optional
    : { text: string }) & // If 'usageKey' is defined, 'text' is required
    /**
     * Conditional type to enforce 'purposeKey' property requirement based on 'purposeKey'.
     */
    ((typeof permissions.ios)[T]["purposeKey"] extends undefined
      ? {} // If 'purposeKey' is undefined, 'purposeKey' is optional
      : { purposeKey: string }); // If 'purposeKey' is defined, 'purposeKey' is required
}[keyof typeof permissions.ios];

/**
 * Represents an Android permission.
 */
type AndroidPermission = (typeof permissions.android)[number] | {};
