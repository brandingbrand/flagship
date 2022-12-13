import type { Plugin } from "@brandingbrand/kernel-core";

import { ios, android } from "./utils";

export type IOSPermission = keyof typeof ios.permissions;
export type AndroidPermission = typeof android.permissions[number];

export interface IOSPermissionType {
  permission: IOSPermission;
  text?: string;
}

export type AndroidPermissionType = AndroidPermission[];

interface PluginPermissions {
  ios?: IOSPermissionType[];
  android?: AndroidPermissionType;
}

export interface KernelPluginPermissions {
  kernelPluginPermissions: Plugin<PluginPermissions>;
}
