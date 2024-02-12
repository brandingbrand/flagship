import * as t from "io-ts";

/**
 * Represents the schema for versioning information.
 *
 * @example
 * ```
 * versioning: {
 *   version: "1.5",
 *   build: 3
 * }
 * ```
 */
const VersioningSchema = t.intersection([
  /**
   * The version string.
   * @default "1.0"
   */
  t.type({
    version: t.string,
  }),

  /**
   * Optional build number.
   * @default 1
   */
  t.partial({
    build: t.number,
  }),
]);

/**
 * Represents the schema for framework information.
 *
 * @example
 * ```
 * frameworks: {
 *   framework: "MyFramework.framework",
 *   path: "./path/to/framework/directory"
 * }
 * ```
 *
 * @example
 * ```
 * frameworks: {
 *   framework: "Sprite.framework"
 * }
 * ```
 */
const FrameworksSchema = t.array(
  t.intersection([
    /**
     * The name of the framework, this can be a system framework
     * or custom framework
     */
    t.type({
      framework: t.string,
    }),

    /**
     * Path to the framework if it's a custom framework i.e. not
     * a system framework Sprite.framework
     */
    t.partial({
      path: t.string,
    }),
  ])
);

/**
 * Represents the schema for a Podfile.
 *
 * @example
 * ```
 * podfile: {
 *   config: ["inhibit_all_warnings!"],
 *   pods: ["pod 'PubNub', '~> 4.0'", "pod 'FlagshipCode', '~> 13.0'"]
 * }
 * ```
 */
const PodfileSchema = t.partial({
  /**
   * Optional array of top-level configurations
   */
  config: t.array(t.string),

  /**
   * Optional array of pods
   */
  pods: t.array(t.string),
});

/**
 * Represents the schema for URL scheme information.
 *
 * @example
 * ```
 * urlScheme: {
 *   scheme: "myapp",
 *   host: "app"
 * }
 * ```
 *
 * @example
 * ```
 * urlScheme: {
 *   scheme: "myapp",
 * }
 * ```
 */
const UrlSchemeSchema = t.intersection([
  /**
   * URL scheme
   */
  t.type({
    scheme: t.string,
  }),

  /**
   * Optional URL host. Most times with apps there is no
   * need for a host.
   */
  t.partial({
    host: t.string,
  }),
]);

/**
 * Represents the schema for style information.
 *
 * @example
 * style: "light"
 *
 * @example
 * style: "dark"
 *
 * @example
 * style: "system"
 */
const StyleSchema = t.union([
  t.literal("light"), // Light style.
  t.literal("dark"), // Dark style.
  t.literal("system"), // System style.
]);

/**
 * Represents the schema for a property list (plist).
 *
 * @example
 * plist: {
 *   urlScheme: {
 *     scheme: "myapp",
 *   },
 *   style: "light",
 * },
 */
const PlistSchema = t.partial({
  /**
   * Optional URL Scheme information
   */

  urlScheme: UrlSchemeSchema,
  /**
   * Optional style configuration
   */
  style: StyleSchema,
});

/**
 * Represents the schema for iOS signing information.
 * This configuration is more important for continuous integration.
 *
 * @example
 * ```
 * signing: {
 *   appleCert: "signing/AppleWWDRCA.cer",
 *   distCert: "signing/enterprise/enterprise.cer",
 *   distP12: "signing/enterprise/enterprise.p12",
 *   distCertType: "iPhone Distribution",
 *   exportTeamId: "ABC12345",
 *   profilesDir: "signing/enterprise",
 *   provisioningProfileName: "In House Provisioning Profile",
 *   exportMethod: "enterprise",
 * }
 * ```
 */
const IOSSigningSchema = t.type({
  /**
   * Path to Apple certificate - this can be retrieved at https://www.apple.com/certificateauthority/
   * relative to the root of the project.
   */
  appleCert: t.string,

  /**
   * Path to the distribution certificate relative to the root of the project.
   */
  distCert: t.string,

  /**
   * Path to the distribution p12 relative to the root of the project.
   */
  distP12: t.string,

  /**
   * Type of distrution certificate.
   */
  distCertType: t.union([
    // Distribution certificate type.
    t.literal("iPhone Development"),
    t.literal("iPhone Distribution"),
    t.literal("Apple Development"),
    t.literal("Apple Distribution"),
  ]),

  /**
   * Type of export method i.e. distribution location
   */
  exportMethod: t.union([
    // Export method.
    t.literal("app-store"),
    t.literal("validation"),
    t.literal("ad-hoc"),
    t.literal("package"),
    t.literal("enterprise"),
    t.literal("development"),
    t.literal("developer-id"),
    t.literal("mac-application"),
  ]),

  /**
   * Export team identifier.
   */
  exportTeamId: t.string,

  /**
   * Directory of your provisioning profile(s) relative to the root of the project
   */
  profilesDir: t.string,

  /**
   * Provisioning profile name, not to be confused with the filename.
   */
  provisioningProfileName: t.string,
});

/**
 * Represents the schema for iOS configuration.
 *
 * @example
 * ```
 * ios: {
 *   bundleId: "com.app",
 *   displayName: "App",
 * }
 * ```
 */
const IOSSchema = t.intersection([
  /**
   * Required attributes for the iOS configuration.
   *
   * @example
   * ios: {
   *   bundleId: "com.app",
   *   displayName: "App",
   * }
   * ```
   */
  t.type({
    /**
     * Bundle identifier of your application.
     */
    bundleId: t.string,

    /**
     * Display name of your application.
     */
    displayName: t.string,
  }),

  /**
   * Optional attributes for the iOS configuration
   *
   * @example
   * ```
   * ios: {
   *   bundleId: "com.app",
   *   displayName: "App",
   *   entitlementsFilePath: "./path/to/app.entitlements",
   *   frameworks: {
   *     framework: "Sprite.framework",
   *   },
   *   deploymentTarget: "15.0",
   *   podfile: {
   *     config: ["inhibit_all_warnings!"],
   *     pods: ["pod 'PubNub', '~> 4.0'", "pod 'FlagshipCode', '~> 13.0'"],
   *   },
   *   plist: {
   *     urlScheme: {
   *       scheme: "myapp"
   *     },
   *     style: "light",
   *   },
   *   signing: {
   *     appleCert: "signing/AppleWWDRCA.cer",
   *     distCert: "signing/enterprise/enterprise.cer",
   *     distP12: "signing/enterprise/enterprise.p12",
   *     distCertType: "iPhone Distribution",
   *     exportTeamId: "ABC12345",
   *     profilesDir: "signing/enterprise",
   *     provisioningProfileName: "In House Provisioning Profile",
   *     exportMethod: "enterprise",
   *   },
   *   targetedDevices: "1",
   *   versioning: {
   *     version: "1.5",
   *     build: 3,
   *   },
   *   gemfile: ["gem 'sqlite3'"]
   * }
   * ```
   */
  t.partial({
    /**
     * Optional entitlements path relative to the root of the project.
     */
    entitlementsFilePath: t.string,

    /**
     * Optional frameworks.
     *
     * @link FrameworksSchema
     */
    frameworks: FrameworksSchema,

    /**
     * Optional minimum version of the iOS operating system that an app is designed to support.
     *
     * @default "13.4"
     */
    deploymentTarget: t.string,

    /**
     * Optional podfile configuration.
     *
     * @link PodfileSchema
     */
    podfile: PodfileSchema,

    /**
     * Optional Property list (plist) configuration.
     *
     * @link PlistSchema
     */
    plist: PlistSchema,

    /**
     * Optional signing configuration.
     *
     * @link IOSSigningSchema
     */
    signing: IOSSigningSchema,

    /**
     * Optional targeted devices.
     *
     * - iPhone: "1"
     * - iPad: "2"
     * - Universal: "1,2"
     *
     * @default "1"
     */
    targetedDevices: t.union([
      t.literal("1"),
      t.literal("2"),
      t.literal("1,2"),
    ]),

    /**
     * Optional versioning configuration.
     *
     * @link VersioningSchema
     */
    versioning: VersioningSchema,

    /**
     * Optional array of gems to add to to Gemfile.
     */
    gemfile: t.array(t.string),
  }),
]);

/**
 * Represents the optional schema for App Gradle configuration.
 *
 * @example
 * ```
 * appGradle: {
 *   dependencies: ["com.example.android:app-magic:12.3"],
 * }
 * ```
 */
const AppGradleSchema = t.partial({
  /**
   * Optional array configuration to include external binaries or other library modules to your
   * build as dependencies.
   */
  dependencies: t.array(t.string),
});

/**
 * Represents the optional schema for Project Gradle configuration.
 *
 * @example
 * ```
 * projectGradle: {
 *   buildToolsVersion: "33.0.0",
 *   compileSdkVersion: 33,
 *   minSdkVersion: 21,
 *   ndkVersion: "23.1.7779620",
 *   repositories: ["brandingbrand()"],
 *   targetSdkVersion: 33,
 *   ext: ['kotlinVersion: "1.6.0"'],
 *   dependencies: ["com.example.android:app-magic:12.3"],
 * }
 * ```
 */
const ProjectGradleSchema = t.partial({
  /**
   * Optional Android Build Tools used by the project.
   *
   * @default "33.0.0"
   */
  buildToolsVersion: t.string,

  /**
   * Optional version of the Android SDK that the app is compiled against.
   *
   * @default 33
   */
  compileSdkVersion: t.number,

  /**
   * Optional minimum version of the Android SDK that the app supports.
   *
   * @default 21
   */
  minSdkVersion: t.number,

  /**
   * Optional version of the Android NDK (Native Development Kit) used by the project.
   *
   * @default "23.1.7779620"
   */
  ndkVersion: t.string,

  /**
   * Optional repositories from which the build system should fetch dependencies, such as libraries and plugins, during the build process.
   */
  repositories: t.array(t.string),

  /**
   * Optional version of the Android SDK that the app is targeting.
   *
   * @default 33
   */
  targetSdkVersion: t.number, // Target SDK version.

  /**
   * Optional configuration to define the "ext" block (short for "extra properties") is often used
   * in the build.gradle file to define custom variables or properties that can be reused
   * across different parts of the build configuration.
   */
  ext: t.array(t.string), // Array of extra configurations.

  /**
   * Optional array configuration to include external binaries or other library modules to your
   * build as dependencies.
   */
  dependencies: t.array(t.string), // Array of dependencies.
});

/**
 * Represents the optional schema for properties configuration.
 *
 * @example
 * ```
 * properties: {
 *   useAndroidX: true,
 *   enableJetifier: true,
 *   FLIPPER_VERSION: "33",
 *   reactNativeArchitectures: "arm64-v8a",
 *   newArchEnabled: false,
 *   hermesEnabled: true
 * }
 * ```
 */
const PropertiesSchema = t.partial({
  /**
   * Optional flag to enable AndroidX package structure.
   *
   * @default true
   */
  useAndroidX: t.boolean,

  /**
   * Optional flag to enable Jetifier for third-party libraries.
   *
   * @default true
   */
  enableJetifier: t.boolean,

  /**
   * Optional version of Flipper SDK to use with React Native.
   *
   * @default "0.182.0"
   */
  FLIPPER_VERSION: t.string,

  /**
   * Optional architectures to build for React Native.
   *
   * @default "armeabi-v7a,arm64-v8a,x86,x86_64"
   */
  reactNativeArchitectures: t.string,

  /**
   * Optional flag to enable new architecture support.
   *
   * @default false
   */
  newArchEnabled: t.boolean,

  /**
   * Optional flag to enable Hermes JS engine.
   *
   * @default true
   */
  hermesEnabled: t.boolean,
});

/**
 * Represents the schema for Gradle configuration.
 *
 * @example
 * ```
 * gradle: {
 *   appGradle: {
 *     dependencies: ["com.example.android:app-magic:12.3"],
 *   },
 *   projectGradle: {
 *     buildToolsVersion: "33.0.0",
 *     compileSdkVersion: 33,
 *     minSdkVersion: 21,
 *     ndkVersion: "23.1.7779620",
 *     repositories: ["brandingbrand()"],
 *     targetSdkVersion: 33,
 *     ext: ['kotlinVersion: "1.6.0"'],
 *     dependencies: ["com.example.android:app-magic:12.3"],
 *   },
 *   properties: {
 *     useAndroidX: true,
 *     enableJetifier: true,
 *     FLIPPER_VERSION: "33",
 *     reactNativeArchitectures: "arm64-v8a",
 *     newArchEnabled: false,
 *     hermesEnabled: true,
 *   },
 * }
 * ```
 */
const GradleSchema = t.partial({
  /**
   * Optional app build.gradle configuration.
   *
   * @link AppGradleSchema
   */
  appGradle: AppGradleSchema,

  /**
   * Optional project build.gradle configuration.
   *
   * @link ProjectGradleSchema
   */
  projectGradle: ProjectGradleSchema,

  /**
   * Optional gradle.properties configuration.
   *
   * @link PropertiesSchema
   */
  properties: PropertiesSchema,
});

/**
 * Represents the optional schema for Android manifest which contains important
 * metadata about the app, including its package name, permissions, activities,
 * services, receivers, and more. Currently only support url scheme configuration.
 *
 * @example
 * ```
 * manifest: {
 *   urlScheme: {
 *     scheme: "myapp",
 *     host: "app",
 *   },
 * }
 * ```
 */
const ManifestSchema = t.partial({
  /**
   * Represents the optional schema for URL scheme information.
   *
   * @link UrlSchemeSchema
   */
  urlScheme: UrlSchemeSchema,
});

/**
 * Represents the schema for Android signing information.
 *
 * @example
 * ```
 * signing: {
 *   keyAlias: "key0",
 *   storeFile: "./path/to/release.keystore",
 * }
 * ```
 */
const AndroidSigningSchema = t.type({
  /**
   * Alias assigned to a cryptographic key stored in a keystore file.
   */
  keyAlias: t.string,

  /**
   * Path to store file relative to the project root which is used to sign the Android
   * application package (APK) during the app signing process.
   */
  storeFile: t.string,
});

/**
 * Represents the schema for colors to be used throughout the native Android application.
 *
 * @example
 * ```
 * colors: {
 *   opaque_red: "#f00",
 * }
 * ```
 */
const ColorsSchema = t.record(t.string, t.string);

/**
 * Represents the schema for a collection of strings, of which, one string is provided depending on the amount of something.
 *
 * @example
 * ```
 * plurals: {
 *   numberOfSongsAvailable: [
 *     {
 *       quantity: "one",
 *       value: "1 song found.",
 *     },
 *     {
 *       quantity: "other",
 *       value: "2 songs found.",
 *     },
 *   ],
 * }
 * ```
 */
const PluralsSchema = t.record(
  /**
   * Plural name, this name is used as the resource ID.
   */
  t.string,

  /**
   * An array of plural or singular strings. The value can be a reference to another string resource
   */
  t.array(
    t.type({
      /**
       * Plural quantity, for example, the quantity 1 is a special case. We write "1 book",
       * but for any other quantity we'd write "n books". This distinction between singular
       * and plural is very common, but other languages make finer distinctions
       */
      quantity: t.union([
        t.literal("zero"),
        t.literal("one"),
        t.literal("two"),
        t.literal("few"),
        t.literal("many"),
        t.literal("other"),
      ]),
      /**
       * Pluralized value.
       */
      value: t.string,
    })
  )
);

/**
 * Represents the schema for an array of strings that can be referenced from the application.
 *
 * @example
 * ```
 * stringArray: {
 *   planets_array: ["Mercury", "Venus", "Earth", "Mars"],
 * }
 * ```
 */
const StringArraySchema = t.record(t.string, t.array(t.string));

/**
 * Represents the schema for a single string that can be referenced from the application orfrom other
 * resource files (such as an XML layout).
 *
 * @example
 * ```
 * strings: {
 *   string: {
 *     appName: "App",
 *   },
 *   stringArray: {
 *     planets_array: ["Mercury", "Venus", "Earth", "Mars"],
 *   },
 *   plurals: {
 *     numberOfSongsAvailable: [
 *       {
 *         quantity: "one",
 *         value: "1 song found.",
 *       },
 *       {
 *         quantity: "other",
 *         value: "2 songs found.",
 *       },
 *     ],
 *   },
 * }
 * ```
 */
const StringsSchema = t.partial({
  string: t.record(t.string, t.string), // Record of string names to values.
  stringArray: StringArraySchema, // String array information.
  plurals: PluralsSchema, // Plurals information.
});

/**
 * Represents the schema for Android configuration.
 *
 * @example
 * ```
 * android: {
 *   packageName: "com.app",
 *   displayName: "App",
 *   gradle: {
 *     appGradle: {
 *       dependencies: ["com.example.android:app-magic:12.3"],
 *     },
 *     projectGradle: {
 *       buildToolsVersion: "33.0.0",
 *       compileSdkVersion: 33,
 *       minSdkVersion: 21,
 *       ndkVersion: "23.1.7779620",
 *       repositories: ["brandingbrand()"],
 *       targetSdkVersion: 33,
 *       ext: ['kotlinVersion: "1.6.0"'],
 *       dependencies: ["com.example.android:app-magic:12.3"],
 *     },
 *     properties: {
 *       useAndroidX: true,
 *       enableJetifier: true,
 *       FLIPPER_VERSION: "33",
 *       reactNativeArchitectures: "arm64-v8a",
 *       newArchEnabled: false,
 *       hermesEnabled: true,
 *     },
 *   },
 *   manifest: {
 *     urlScheme: {
 *       scheme: "myapp",
 *       host: "app",
 *     },
 *   },
 *   signing: {
 *     keyAlias: "key0",
 *     storeFile: "./path/to/release.keystore",
 *   },
 *   versioning: {
 *     version: "1.5",
 *     build: 3,
 *   },
 *   gemfile: ["gem 'sqlite3'"],
 *   colors: {
 *     opaque_red: "#f00",
 *   },
 *   style: "light",
 *   strings: {
 *     string: {
 *       appName: "App",
 *     },
 *     stringArray: {
 *       planets_array: ["Mercury", "Venus", "Earth", "Mars"],
 *     },
 *     plurals: {
 *       numberOfSongsAvailable: [
 *         {
 *           quantity: "one",
 *           value: "1 song found.",
 *         },
 *         {
 *           quantity: "other",
 *           value: "2 songs found.",
 *         },
 *       ],
 *     },
 *   },
 * }
 * ```
 */
const AndroidSchema = t.intersection([
  /**
   * Required attributes for Android configuration.
   *
   * @example
   * android: {
   *   packageName: "com.app",
   *   displayName: "App",
   * }
   */
  t.type({
    /**
     * Package name for your application - this serves as package path and namespace.
     */
    packageName: t.string,

    /**
     * Display name of your application.
     */
    displayName: t.string,
  }),
  t.partial({
    /**
     * Optional gradle configuration.
     *
     * @link GradleSchema
     */
    gradle: GradleSchema,

    /**
     * Optional Android manifest configuration.
     *
     * @link ManifestSchema
     */
    manifest: ManifestSchema,

    /**
     * Optional signing configuration, mostly used for continuous integration.
     *
     * @link AndroidSigningSchema
     */
    signing: AndroidSigningSchema,

    /**
     * Optional versioning configuration.
     *
     * @link VersioningSchema
     */
    versioning: VersioningSchema,

    /**
     * Optional array of gems to add to to Gemfile.
     */
    gemfile: t.array(t.string),

    /**
     * Optional colors configuration.
     *
     * @link ColorsSchema
     */
    colors: ColorsSchema,

    /**
     * Optional style configuration.
     *
     * @link StyleSchema
     */
    style: StyleSchema,

    /**
     * Optional strings configuration.
     *
     * @link StringsSchema
     */
    strings: StringsSchema,
  }),
]);

/**
 * Represents the required schema for the overall build configuration.
 */
export const BuildConfigSchema = t.type({
  /**
   * Required iOS configuration.
   *
   * @link IOSSchema
   */
  ios: IOSSchema,

  /**
   * Required Android Configuration.
   *
   * @link AndroidSchema
   */
  android: AndroidSchema,
});
