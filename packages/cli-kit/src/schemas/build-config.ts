import * as t from "io-ts";

/**
 * Represents the schema for versioning information.
 */
const VersioningSchema = t.intersection([
  t.type({
    version: t.string, // The version string.
  }),
  t.partial({
    build: t.number, // Optional build number.
  }),
]);

/**
 * Represents the schema for framework information.
 */
const FrameworksSchema = t.array(
  t.intersection([
    t.type({
      framework: t.string, // The name of the framework.
    }),
    t.partial({
      path: t.string, // Optional path to the framework.
    }),
  ])
);

/**
 * Represents the schema for a Podfile.
 */
const PodfileSchema = t.partial({
  config: t.array(t.string), // Array of configurations.
  pods: t.array(t.string), // Array of pods.
});

/**
 * Represents the schema for URL scheme information.
 */
const UrlSchemeSchema = t.intersection([
  t.type({
    scheme: t.string, // The URL scheme.
  }),
  t.partial({
    host: t.string, // Optional host.
  }),
]);

/**
 * Represents the schema for style information.
 */
const StyleSchema = t.union([
  t.literal("light"), // Light style.
  t.literal("dark"), // Dark style.
  t.literal("system"), // System style.
]);

/**
 * Represents the schema for a property list (plist).
 */
const PlistSchema = t.partial({
  urlScheme: UrlSchemeSchema, // URL scheme information.
  style: StyleSchema, // Style information.
});

/**
 * Represents the schema for iOS signing information.
 */
const IOSSigningSchema = t.type({
  appleCert: t.string, // Apple certificate.
  distCert: t.string, // Distribution certificate.
  distP12: t.string, // Distribution P12 file.
  distCertType: t.union([
    // Distribution certificate type.
    t.literal("iPhone Development"),
    t.literal("iPhone Distribution"),
    t.literal("Apple Development"),
    t.literal("Apple Distribution"),
  ]),
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
  exportTeamId: t.string, // Export team ID.
  profilesDir: t.string, // Profiles directory.
  provisioningProfileName: t.string, // Provisioning profile name.
});

/**
 * Represents the schema for iOS configuration.
 */
const IOSSchema = t.intersection([
  t.type({
    bundleId: t.string, // Bundle identifier.
    displayName: t.string, // Display name.
  }),
  t.partial({
    entitlementsFilePath: t.string, // Path to entitlements file.
    frameworks: FrameworksSchema, // Frameworks information.
    deploymentTarget: t.string, // Deployment target.
    podfile: PodfileSchema, // Podfile information.
    plist: PlistSchema, // Property list (plist) information.
    signing: IOSSigningSchema, // Signing information.
    targetedDevices: t.union([
      // Targeted devices.
      t.literal("1"),
      t.literal("2"),
      t.literal("1,2"),
    ]),
    versioning: VersioningSchema, // Versioning information.
    gemfile: t.array(t.string), // Array of Gemfile names.
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
