export interface Config {
  android: Android;
  envSwitcher?: EnvSwitcher;
  ios: IOS;
}

export interface EnvSwitcher {
  /** Array of environment names to hide from the Environment Switcher
   *
   * @example ['store']
   */
  hiddenEnvs?: string[];
}

//IOS
export interface IOS {
  /**
   * Add Obj-c headers to bridge
   */
  bridgingHeader?: BridgingHeader;
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
  iosVersionTarget: string;
  /**
   * Additional Pods needed
   */
  podsConfig: PodsConfig;
  /**
   * Additional Plist values
   */
  propertyList?: string[];
  /**
   * Signing configuration
   */
  signing: IOSSigning;
  /**
   * App target devices
   */
  targetedDevices: TargetedDevices;
  /**
   * App version Info
   */
  version: IOSVersion;
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
  buildVersion: string | ((packageVersion: string) => string);
  /**
   * App build number
   */
  buildNumber: number;
}
export interface BridgingHeader {
  /**
   * Additional imports to bridging header
   */
  imports?: string[];
}

export interface Pod {
  /**
   * Pod name
   */
  name: string;
  /**
   * Pod source path if unpublished
   */
  source?: string;
  /**
   * Pod version
   */
  version?: string;
}

export interface PodsConfig {
  /**
   * Platform build target
   */
  minPlatformBuildTarget: string;
  /**
   * Minimum platform build target
   */
  minPodBuildTarget: string;
  /**
   * Additional required Pods
   */
  pods?: Pod[];
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
  gradle: Gradle;
  /**
   * MainApplication.java configuration
   */
  mainApplication?: MainApplication;
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
  version: AndroidVersion;
}

export interface AndroidVersion {
  /**
   * App version name
   */
  versionName: string | ((packageVersion: string) => string);
  /**
   * App version
   */
  versionCode: number;
}

export interface AndroidSigning {
  exportMethod?: string;
  exportTeamId?: string;
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
  buildToolsVersion: string;
  /**
   * Android compile SDK version
   */
  compileSdkVersion: number;
  /**
   * Kotlin version
   */
  kotlinVersion?: string;
  /**
   * Min supported Android SDK
   */
  minSdkVersion: number;
  /**
   * Specified NDK version
   */
  ndkVersion: string;
  /**
   * Additional repository search paths
   */
  repositories: string[];
  /**
   * Android support lib version
   */
  supportLibVersion?: string;
  /**
   * Android target SDK version
   */
  targetSdkVersion: number;
  /**
   * Gradle wrapper version
   */
  wrapperVersion: string;
}

export interface MainApplication {
  /**
   * Additional packages for MainApplication.java
   */
  additionalPackages?: string[];
  /**
   * Additional imports for MainApplication.java
   */
  additionalImports?: string[];
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
  urlSchemeHost?: string;
  /**
   * Additional elements to add inside the <application> tag
   */
  applicationElements?: string[];
  /**
   * Additional elements to add inside the main <activity> tag
   */
  mainActivityElements?: string[];
}

export interface Gradle {
  /**
   * app/build.gradle config
   */
  appGradle: AppGradle;
  /**
   * Gradle wrapper distribution url
   */
  distributionUrl: string;
  /**
   * jvm args i.e. heap memory
   */
  jvmArgs: string;
  /**
   * build.gradle config
   */
  projectGradle: ProjectGradle;
}

//NPM
export interface NPMPackageConfig {
  [key: string]: unknown;
  dependencies?: Record<string, string>;
  name: string;
  version: string;
}
