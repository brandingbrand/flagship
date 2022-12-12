import { ios, android } from "./utils";

export type IOSPermission = keyof typeof ios.permissions;
export type AndroidPermission = typeof android.permissions[number];

export interface IOSPermissionType {
  permission: IOSPermission;
  text?: string;
}

export type AndroidPermissionType = AndroidPermission[];

interface Kernel {
  kernel: {
    ios?: IOSPermissionType[];
    android?: AndroidPermissionType;
  };
}

export interface KernelPluginPermissions {
  kernelPluginPermissions: {
    [key: string]: any;
  } & Kernel;
}
