export default interface AnalyticsProviderConfiguration {
  userAgent: string | Promise<string>;
  osType: string | Promise<string>;
  osVersion: string | Promise<string>;
  appName: string | Promise<string>;
  appId: string | Promise<string>;
  appVersion: string | Promise<string>;
  appInstallerId?: string | Promise<string>;
}
