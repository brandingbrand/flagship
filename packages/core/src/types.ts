export interface Config {
  android: Android;
  ios: IOS;
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
   * Network exception domains
   */
  exceptionDomains?: Array<
    | string
    | {
        domain: string;
        value: string;
      }
  >;
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
  plist?: string[];
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
  version?: IOSVersion;
}

export enum TargetedDevices {
  iPhone = "iPhone",
  iPad = "iPad",
  Universal = "Universal",
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
  appleCert?: string;
  distCert?: string;
  distP12?: string;
  /**
   * Export Method
   */
  exportMethod?: string;
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
  frameworkPath?: string;
}

// ANDROID
export interface Android {
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
  version?: AndroidVersion;
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
  keyAlias?: string;
  storeFile?: string;
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
   * Android support lib version
   */
  supportLibVersion?: string;
  /**
   * Android target SDK version
   */
  targetSdkVersion?: number;
  /**
   * Gradle wrapper version
   */
  wrapperVersion?: string;
  /**
   * Ext config
   */
  ext?: string;
}

export interface Manifest {
  /**
   * Additional MainActivity attributes
   */
  activityAttributes?: Record<string, string>;
  /**
   * Additional Application attributes
   */
  applicationAttributes?: Record<string, string>;
  /**
   * Url Scheme for intents
   */
  urlScheme?: UrlScheme;
  /**
   * Additional elements to add inside the <application> tag
   */
  applicationElements?: string[];
  /**
   * Additional elements to add inside the main <activity> tag
   */
  mainActivityElements?: string[];
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

interface Kernel<T> {
  kernel: T;
}

export type Plugin<T> = Partial<Config> & Kernel<T>;
