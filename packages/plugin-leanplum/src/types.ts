import type { Plugin } from "@brandingbrand/kernel-core";

interface PluginLeanplum {
  ios?: {
    swizzle?: boolean;
  };
  android?: {
    leanplumFCMVersion: string;
  };
}

export interface KernelPluginLeanplum {
  kernelPluginLeanplum?: Plugin<PluginLeanplum>;
}
