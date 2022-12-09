import { ios, android } from "./utils";

export type IOSPermission = keyof typeof ios.permissions;
export type AndroidPermission = typeof android.permissions[number];

export interface IOSPermissionType {
  permission: IOSPermission;
  text?: string;
}

export type AndroidPermissionType = AndroidPermission[];

export interface PluginPermissionsConfig {
  permissions: {
    ios?: IOSPermissionType[];
    android?: AndroidPermissionType;
  };
}
