import type { Plugin } from "@brandingbrand/code-cli-kit";

export type CodePluginLeanplum = {
  codePluginLeanplum: Plugin<{
    ios?: {
      swizzle?: boolean;
    };
    android?: {
      leanplumFCMVersion: string;
      notificationColor: string;
    };
  }>;
};
