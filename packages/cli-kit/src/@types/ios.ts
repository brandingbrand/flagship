import type { InfoPlist } from "./plist";
import type { UrlScheme } from "./universal";

export type IOS = {
  /**
   * Application Bundle ID
   */
  bundleId: string;
  /**
   * Application's display name
   */
  displayName: string;
  /**
   * File path to app entitlements
   */
  entitlementsFilePath?: string;
  /**
   * Additional frameworks to embed
   */
  frameworks?: FrameworksConfig[];
  /**
   * iOS compile version target
   */
  deploymentTarget?: string;
  /**
   * Additional Pods needed
   */
  podfile?: Podfile;
  /**
   * Additional Plist values
   */
  plist?: Plist & InfoPlist;
  /**
   * Signing configuration
   */
  signing?: IOSSigning;
  /**
   * App target devices
   * iPhone - 1
   * iPad - 2
   * Universal - 1,2
   */
  targetedDevices?: "1" | "2" | "1,2";
  /**
   * App version Info
   */
  versioning?: IOSVersion;
  /**
   * Gemfile dependencies
   */
  gemfile?: string[];
};

export type Plist = {
  urlScheme?: UrlScheme;
};

export type IOSVersion = {
  /**
   * App version
   */
  version: string;
  /**
   * App build number
   */
  build?: number;
};

export type Podfile = {
  /**
   * Additional podfile configuration
   */
  config?: string[];
  /**
   * Additional required Pods
   */
  pods?: string[];
};

export type IOSSigning = {
  /**
   * Paths to certificates
   */
  appleCert: string;
  distCert: string;
  distP12: string;
  distCertType:
    | "iPhone Development"
    | "iPhone Distribution"
    | "Apple Development"
    | "Apple Distribution";
  /**
   * Export Method
   */
  exportMethod:
    | "app-store"
    | "validation"
    | "ad-hoc"
    | "package"
    | "enterprise"
    | "development"
    | "developer-id"
    | "mac-application";
  /**
   * Development team id.
   */
  exportTeamId: string;
  profilesDir: string;
  /**
   * Provisioning profile name
   */
  provisioningProfileName: string;
};

export type FrameworksConfig = {
  /**
   * iOS Framework to be added to project
   */
  framework: string;
  /**
   * iOS Framework directory path from project root source
   */
  path?: string;
};
