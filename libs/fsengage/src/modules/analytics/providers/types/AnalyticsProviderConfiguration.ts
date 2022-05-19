export default interface AnalyticsProviderConfiguration {
  userAgent: Promise<string> | string;
  osType: Promise<string> | string;
  osVersion: Promise<string> | string;
  appName: Promise<string> | string;
  appId: Promise<string> | string;
  appVersion: Promise<string> | string;
  appInstallerId?: Promise<string> | string;
}
