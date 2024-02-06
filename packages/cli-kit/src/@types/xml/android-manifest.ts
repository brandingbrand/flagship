/**
 * Represents a string value that can only be "true" or "false".
 */
type StringBoolean = "true" | "false";

/**
 * Represents the attributes of metadata in the AndroidManifest.
 */
type ManifestMetaDataAttributes = AndroidManifestAttributes & {
  /** Value attribute for metadata. */
  "android:value"?: string;

  /** Resource attribute for metadata. */
  "android:resource"?: string;
};

/**
 * Represents general attributes in the AndroidManifest.
 */
type AndroidManifestAttributes = {
  /** Name attribute in the AndroidManifest. */
  "android:name": string | "android.intent.action.VIEW";

  /** Node attribute in the AndroidManifest. */
  "tools:node"?: string | "remove";
};

/**
 * Represents an action in the AndroidManifest.
 */
type ManifestAction = {
  $: AndroidManifestAttributes;
};

/**
 * Represents a category in the AndroidManifest.
 */
type ManifestCategory = {
  $: AndroidManifestAttributes;
};

/**
 * Represents data in the AndroidManifest.
 */
type ManifestData = {
  $: {
    [key: string]: string | undefined;
    "android:host"?: string;
    "android:pathPrefix"?: string;
    "android:scheme"?: string;
  };
};

/**
 * Represents a receiver in the AndroidManifest.
 */
type ManifestReceiver = {
  $: AndroidManifestAttributes & {
    /** "ed" attribute for the receiver. */
    "android:ed"?: StringBoolean;

    /** "enabled" attribute for the receiver. */
    "android:enabled"?: StringBoolean;
  };
  /** Intent filter for the receiver. */
  "intent-filter"?: ManifestIntentFilter[];
};

/**
 * Represents an intent filter in the AndroidManifest.
 */
type ManifestIntentFilter = {
  $?: {
    /** "autoVerify" attribute for the intent filter. */
    "android:autoVerify"?: StringBoolean;

    /** "data-generated" attribute for the intent filter. */
    "data-generated"?: StringBoolean;
  };
  /** Action elements within the intent filter. */
  action?: ManifestAction[];
  /** Data elements within the intent filter. */
  data?: ManifestData[];
  /** Category elements within the intent filter. */
  category?: ManifestCategory[];
};

/**
 * Represents metadata in the AndroidManifest.
 */
type ManifestMetaData = {
  $: ManifestMetaDataAttributes;
};

/**
 * Represents attributes for a provider in the AndroidManifest.
 */
type ManifestProviderAttributes = {
  /** "authorities" attribute for the provider. */
  "android:authorities": string;

  /** "directBootAware" attribute for the provider. */
  "android:directBootAware"?: boolean;

  /** "enabled" attribute for the provider. */
  "android:enabled"?: boolean;

  /** "ed" attribute for the provider. */
  "android:ed"?: boolean;

  /** "grantUriPermissions" attribute for the provider. */
  "android:grantUriPermissions"?: boolean;

  /** "icon" attribute for the provider. */
  "android:icon"?: string;

  /** "initOrder" attribute for the provider. */
  "android:initOrder"?: number;

  /** "label" attribute for the provider. */
  "android:label"?: number;

  /** "multiprocess" attribute for the provider. */
  "android:multiprocess"?: boolean;

  /** "name" attribute for the provider. */
  "android:name"?: string;

  /** "permission" attribute for the provider. */
  "android:permission"?: string;

  /** "process" attribute for the provider. */
  "android:process"?: string;

  /** "readPermission" attribute for the provider. */
  "android:readPermission"?: string;

  /** "syncable" attribute for the provider. */
  "android:syncable"?: boolean;

  /** "writePermission" attribute for the provider. */
  "android:writePermission"?: string;
};

/**
 * Represents a provider in the AndroidManifest.
 */
type ManifestProvider = {
  $: ManifestProviderAttributes;
};

/**
 * Represents attributes for a service in the AndroidManifest.
 */
type ManifestServiceAttributes = AndroidManifestAttributes & {
  /** "enabled" attribute for the service. */
  "android:enabled"?: StringBoolean;

  /** "ed" attribute for the service. */
  "android:ed"?: StringBoolean;

  /** "permission" attribute for the service. */
  "android:permission"?: string;
};

/**
 * Represents a service in the AndroidManifest.
 */
type ManifestService = {
  $: ManifestServiceAttributes;
  /** Intent filter for the service. */
  "intent-filter"?: ManifestIntentFilter[];
};

/**
 * Represents attributes for an application in the AndroidManifest.
 */
type ManifestApplicationAttributes = {
  /** "name" attribute for the application. */
  "android:name": string | ".MainApplication";

  /** "icon" attribute for the application. */
  "android:icon"?: string;

  /** "roundIcon" attribute for the application. */
  "android:roundIcon"?: string;

  /** "label" attribute for the application. */
  "android:label"?: string;

  /** "allowBackup" attribute for the application. */
  "android:allowBackup"?: StringBoolean;

  /** "largeHeap" attribute for the application. */
  "android:largeHeap"?: StringBoolean;

  /** "requestLegacyExternalStorage" attribute for the application. */
  "android:requestLegacyExternalStorage"?: StringBoolean;

  /** "usesCleartextTraffic" attribute for the application. */
  "android:usesCleartextTraffic"?: StringBoolean;

  /** "networkSecurityConfig" attribute for the application. */
  "android:networkSecurityConfig"?: string;

  /** Additional attributes for the application. */
  [key: string]: string | undefined;
};

/**
 * Represents attributes for an activity in the AndroidManifest.
 */
type ManifestActivityAttributes = ManifestApplicationAttributes & {
  /** "ed" attribute for the activity. */
  "android:ed"?: StringBoolean;

  /** "launchMode" attribute for the activity. */
  "android:launchMode"?: string;

  /** "theme" attribute for the activity. */
  "android:theme"?: string;

  /** "windowSoftInputMode" attribute for the activity. */
  "android:windowSoftInputMode"?:
    | string
    | "stateUnspecified"
    | "stateUnchanged"
    | "stateHidden"
    | "stateAlwaysHidden"
    | "stateVisible"
    | "stateAlwaysVisible"
    | "adjustUnspecified"
    | "adjustResize"
    | "adjustPan";

  /** "screenOrientation" attribute for the activity. */
  "android:screenOrientation":
    | "unspecified"
    | "behind"
    | "landscape"
    | "portrait"
    | "reverseLandscape"
    | "reversePortrait"
    | "sensorLandscape"
    | "sensorPortrait"
    | "userLandscape"
    | "userPortrait"
    | "sensor"
    | "fullSensor"
    | "nosensor"
    | "user"
    | "fullUser"
    | "locked";

  /** Additional attributes for the activity. */
  [key: string]: string | undefined;
};

/**
 * Represents an activity in the AndroidManifest.
 */
type ManifestActivity = {
  $: ManifestActivityAttributes;
} & ManifestActivityElements;

/**
 * Represents elements within an activity in the AndroidManifest.
 */
type ManifestActivityElements = {
  /** Intent filter for the activity. */
  "intent-filter"?: ManifestIntentFilter[];
};

/**
 * Represents a uses-library entry in the AndroidManifest.
 */
type ManifestUsesLibrary = {
  $: AndroidManifestAttributes & {
    /** "required" attribute for uses-library. */
    "android:required"?: StringBoolean;
  };
};

/**
 * Represents an application in the AndroidManifest.
 */
type ManifestApplication = {
  $: ManifestApplicationAttributes;
} & ManifestApplicationElements;

/**
 * Represents elements within the application in the AndroidManifest.
 */
type ManifestApplicationElements = {
  /** Array of activity entries within the application. */
  activity?: ManifestActivity[];

  /** Array of service entries within the application. */
  service?: ManifestService[];

  /** Array of receiver entries within the application. */
  receiver?: ManifestReceiver[];

  /** Array of metadata entries within the application. */
  "meta-data"?: ManifestMetaData[];

  /** Array of uses-library entries within the application. */
  "uses-library"?: ManifestUsesLibrary[];

  /** Array of provider entries within the application. */
  provider?: ManifestProvider[];
};

/**
 * Represents a permission entry in the AndroidManifest.
 */
type ManifestPermission = {
  $: AndroidManifestAttributes & {
    /** "protectionLevel" attribute for the permission. */
    "android:protectionLevel"?: string | "signature";
  };
};

/**
 * Represents a uses-permission entry in the AndroidManifest.
 */
type ManifestUsesPermission = {
  $: AndroidManifestAttributes;
};

/**
 * Represents a uses-feature entry in the AndroidManifest.
 */
type ManifestUsesFeature = {
  $: AndroidManifestAttributes & {
    /** "glEsVersion" attribute for the uses-feature. */
    "android:glEsVersion"?: string;

    /** "required" attribute for the uses-feature. */
    "android:required": StringBoolean;
  };
};

/**
 * Represents elements within the AndroidManifest, including permissions, features, and application details.
 */
type AndroidManifestElements = {
  /** Array of permission entries within the AndroidManifest. */
  permission?: ManifestPermission[];

  /** Array of uses-permission entries within the AndroidManifest. */
  "uses-permission"?: ManifestUsesPermission[];

  /** Array of uses-permission-sdk-23 entries within the AndroidManifest. */
  "uses-permission-sdk-23"?: ManifestUsesPermission[];

  /** Array of uses-feature entries within the AndroidManifest. */
  "uses-feature"?: ManifestUsesFeature[];

  /** Application details within the AndroidManifest. */
  application?: ManifestApplication[];
};

/**
 * Represents the entire AndroidManifest.xml file for Android.
 */
export type AndroidManifestXML = {
  /** Root element for the AndroidManifest file. */
  manifest: {
    $: {
      /** "xmlns:android" attribute for the manifest. */
      "xmlns:android": string;

      /** "xmlns:tools" attribute for the manifest. */
      "xmlns:tools"?: string;

      /** "package" attribute for the manifest. */
      package?: string;

      /** Additional attributes for the manifest. */
      [key: string]: string | undefined;
    };
  } & AndroidManifestElements;
};
