import {
  AndroidManifestAttributes,
  AndroidManifestElements,
  ManifestActivityAttributes,
  ManifestActivityElements,
  ManifestApplicationAttributes,
  ManifestApplicationElements,
} from "./manifest";

export interface Config<T = unknown> {
  android: Android;
  ios: IOS;
  app: T;
}

export interface IOS {
  /**
   * Application source code name
   */
  name: string;
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
  plist?: Record<string, unknown>;
  /**
   * Signing configuration
   */
  signing?: IOSSigning;
  /**
   * App target devices
   */
  targetedDevices?: TargetedDevices;
  /**
   * App version Info
   */
  versioning?: IOSVersion;
}

export enum TargetedDevices {
  iPhone = "1",
  iPad = "2",
  Universal = "1,2",
}

export interface IOSVersion {
  /**
   * App version
   */
  version: string;
  /**
   * App build number
   */
  build: number;
}

export interface Podfile {
  /**
   * Additional podfile configuration
   */
  config?: string[];
  /**
   * Additional required Pods
   */
  pods?: string[];
}

export interface IOSSigning {
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
}

export interface FrameworksConfig {
  /**
   * iOS Framework to be added to project
   */
  framework: string;
  /**
   * iOS Framework directory path from project root source
   */
  path?: string;
}

// ANDROID
export interface Android {
  /**
   * Application source code name
   */
  name: string;
  /**
   * Android app display name
   */
  displayName: string;
  /**
   * Gradle configuration
   */
  gradle?: Gradle;
  /**
   * AndroidManifest.xml configuration
   */
  manifest?: Manifest;
  /**
   * App package name
   */
  packageName: string;
  /**
   * signing config
   */
  signing?: AndroidSigning;
  /**
   * App version
   */
  versioning?: AndroidVersion;
}

export interface AndroidVersion {
  /**
   * App version i.e. versionName
   */
  version: string;
  /**
   * App build i.e. versionCode
   */
  build: number;
}

export interface AndroidSigning {
  keyAlias: string;
  storeFile: string;
}

export interface AppGradle {
  /**
   * Additional dependencies for app/build.gradle
   */
  dependencies?: string[];
}

export interface ProjectGradle {
  /**
   * Android build tools version
   */
  buildToolsVersion?: string;
  /**
   * Android compile SDK version
   */
  compileSdkVersion?: number;
  /**
   * Kotlin version
   */
  kotlinVersion?: string;
  /**
   * Min supported Android SDK
   */
  minSdkVersion?: number;
  /**
   * Specified NDK version
   */
  ndkVersion?: string;
  /**
   * Additional repository search paths
   */
  repositories?: string[];
  /**
   * Android target SDK version
   */
  targetSdkVersion?: number;
  /**
   * Ext config
   */
  ext?: string[];
  /**
   * Dependencies
   */
  dependencies?: string[];
  /**
   * Build repositories
   */
  buildRepositories?: string[];
}

export interface Manifest {
  /**
   * Additional Manifest attributes
   */
  manifestAttributes?: Partial<AndroidManifestAttributes>;
  /**
   * Additional MainActivity attributes
   */
  mainActivityAttributes?: Partial<ManifestActivityAttributes>;
  /**
   * Additional Application attributes
   */
  mainApplicationAttributes?: Partial<ManifestApplicationAttributes>;
  /**
   * Url Scheme for intents
   */
  urlScheme?: UrlScheme;
  /**
   * Additional elements to add inside the <manifest> tag
   */
  manifestElements?: AndroidManifestElements;
  /**
   * Additional elements to add inside the <application> tag
   */
  mainApplicationElements?: ManifestApplicationElements;
  /**
   * Additional elements to add inside the main <activity> tag
   */
  mainActivityElements?: ManifestActivityElements;
}

export interface UrlScheme {
  scheme: string;
  host?: string;
}

export interface Gradle {
  /**
   * app/build.gradle config
   */
  appGradle?: AppGradle;
  /**
   * Gradle wrapper distribution url
   */
  distributionVersion?: string;
  /**
   * jvm args i.e. heap memory
   */
  jvmArgs?: string;
  /**
   * build.gradle config
   */
  projectGradle?: ProjectGradle;
}

export interface PackageManager {
  packageManager?: string;
}

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

interface Kernel<T> {
  kernel: T;
}

export type Plugin<T, U = unknown> = DeepPartial<Config<U>> & Kernel<T>;
