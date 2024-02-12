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
     * Display name of your identifier
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
      // Targeted devices.
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
     * Optional array of gems to add to to project.
     */
    gemfile: t.array(t.string),
  }),
]);

/**
 * Represents the schema for App Gradle configuration.
 */
const AppGradleSchema = t.partial({
  dependencies: t.array(t.string), // Array of dependencies.
});

/**
 * Represents the schema for Project Gradle configuration.
 */
const ProjectGradleSchema = t.partial({
  buildToolsVersion: t.string, // Build tools version.
  compileSdkVersion: t.number, // Compile SDK version.
  minSdkVersion: t.number, // Minimum SDK version.
  ndkVersion: t.string, // NDK version.
  repositories: t.array(t.string), // Array of repositories.
  targetSdkVersion: t.number, // Target SDK version.
  ext: t.array(t.string), // Array of extra configurations.
  dependencies: t.array(t.string), // Array of dependencies.
});

/**
 * Represents the schema for properties configuration.
 */
const PropertiesSchema = t.partial({
  useAndroidX: t.boolean, // Whether to use AndroidX.
  enableJetifier: t.boolean, // Whether to enable Jetifier.
  FLIPPER_VERSION: t.string, // Flipper version.
  reactNativeArchitectures: t.string, // React Native architectures.
  newArchEnabled: t.boolean, // Whether new architecture is enabled.
  hermesEnabled: t.boolean, // Whether Hermes is enabled.
});

/**
 * Represents the schema for Gradle configuration.
 */
const GradleSchema = t.partial({
  appGradle: AppGradleSchema, // App Gradle configuration.
  projectGradle: ProjectGradleSchema, // Project Gradle configuration.
  properties: PropertiesSchema, // Properties configuration.
});

/**
 * Represents the schema for Android manifest.
 */
const ManifestSchema = t.partial({
  urlScheme: UrlSchemeSchema, // URL scheme information.
});

/**
 * Represents the schema for Android signing information.
 */
const AndroidSigningSchema = t.type({
  keyAlias: t.string, // Key alias.
  storeFile: t.string, // Store file.
});

/**
 * Represents the schema for colors.
 */
const ColorsSchema = t.record(t.string, t.string); // Record of color names to values.

/**
 * Represents the schema for plurals.
 */
const PluralsSchema = t.record(
  t.string,
  t.array(
    t.type({
      quantity: t.union([
        // Plural quantity.
        t.literal("zero"),
        t.literal("one"),
        t.literal("two"),
        t.literal("few"),
        t.literal("many"),
        t.literal("other"),
      ]),
      // Plural value.
      value: t.string,
    })
  )
);

/**
 * Represents the schema for a string array.
 */
const StringArraySchema = t.record(t.string, t.array(t.string)); // Record of string array names to arrays of strings.

/**
 * Represents the schema for strings.
 */
const StringsSchema = t.partial({
  string: t.record(t.string, t.string), // Record of string names to values.
  stringArray: StringArraySchema, // String array information.
  plurals: PluralsSchema, // Plurals information.
});

/**
 * Represents the schema for Android configuration.
 */
const AndroidSchema = t.intersection([
  t.type({
    packageName: t.string, // Package name.
    displayName: t.string, // Display name.
  }),
  t.partial({
    gradle: GradleSchema, // Gradle configuration.
    manifest: ManifestSchema, // Manifest configuration.
    signing: AndroidSigningSchema, // Signing information.
    versioning: VersioningSchema, // Versioning information.
    gemfile: t.array(t.string), // Array of Gemfile names.
    colors: ColorsSchema, // Colors information.
    style: StyleSchema, // Style information.
    strings: StringsSchema, // Strings information.
  }),
]);

/**
 * Represents the schema for the overall build configuration.
 */
export const BuildConfigSchema = t.type({
  ios: IOSSchema, // iOS configuration.
  android: AndroidSchema, // Android configuration.
});
