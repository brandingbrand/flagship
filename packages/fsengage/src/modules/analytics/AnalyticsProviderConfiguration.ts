export default interface AnalyticsProviderConfiguration {
  userAgent: string;
  osType: string;
  osVersion: string;
  appName: string;
  appId: string;
  appVersion: string;
  appInstallerId?: string;
}
