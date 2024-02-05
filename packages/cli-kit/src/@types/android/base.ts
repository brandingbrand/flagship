import type { Manifest } from "./android-manifest";
import type { NetworkSecurityConfigElements } from "./network-security";
import type { StringsElements } from "./strings";
import type { Styles } from "./styles";

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
   * Android network_security_config.xml configuration
   */
  security?: NetworkSecurityConfigElements;
  /**
   * Android styles.xml configuration
   */
  styles?: Styles;
  /**
   * Android strings.xml configuration
   */
  strings?: StringsElements;
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
  build?: number;
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
}

export interface PropertiesGradle {
  /**
   * AndroidX package structure to make it clearer which packages are bundled with the
   * Android operating system, and which are packaged with your app's APK
   *
   * @default true
   */
  useAndroidX?: boolean;
  /**
   * Automatically convert third-party libraries to use AndroidX
   *
   * @default true
   */
  enableJetifier?: boolean;
  /**
   * Version of flipper SDK to use with React Native
   *
   * @default 0.182.0
   */
  FLIPPER_VERSION?: string;
  /**
   * Use this property to specify which architecture you want to build.
   *
   * @default armeabi-v7a,arm64-v8a,x86,x86_64
   */
  reactNativeArchitectures?: string;
  /**
   * Use this property to enable support to the new architecture.
   *
   * @default false
   */
  newArchEnabled?: boolean;
  /**
   * Use this property to enable or disable the Hermes JS engine.
   * If set to false, you will be using JSC instead.
   *
   * @default true
   */
  hermesEnabled?: boolean;
}

export interface Gradle {
  /**
   * app/build.gradle config
   */
  appGradle?: AppGradle;
  /**
   * build.gradle config
   */
  projectGradle?: ProjectGradle;
  /**
   * gradle.properties config
   */
  properties?: PropertiesGradle;
}
