import { UrlScheme } from "../universal";

export type StringBoolean = "true" | "false";

type ManifestMetaDataAttributes = AndroidManifestAttributes & {
  "android:value"?: string;
  "android:resource"?: string;
};

export type AndroidManifestAttributes = {
  "android:name": string | "android.intent.action.VIEW";
  "tools:node"?: string | "remove";
};

type ManifestAction = {
  $: AndroidManifestAttributes;
};

type ManifestCategory = {
  $: AndroidManifestAttributes;
};

type ManifestData = {
  $: {
    [key: string]: string | undefined;
    "android:host"?: string;
    "android:pathPrefix"?: string;
    "android:scheme"?: string;
  };
};

export type ManifestReceiver = {
  $: AndroidManifestAttributes & {
    "android:exported"?: StringBoolean;
    "android:enabled"?: StringBoolean;
  };
  "intent-filter"?: ManifestIntentFilter[];
};

export type ManifestIntentFilter = {
  $?: {
    "android:autoVerify"?: StringBoolean;
    "data-generated"?: StringBoolean;
  };
  action?: ManifestAction[];
  data?: ManifestData[];
  category?: ManifestCategory[];
};

export type ManifestMetaData = {
  $: ManifestMetaDataAttributes;
};

export type ManifestProviderAttributes = {
  "android:authorities": string;
  "android:directBootAware"?: boolean;
  "android:enabled"?: boolean;
  "android:exported"?: boolean;
  "android:grantUriPermissions"?: boolean;
  "android:icon"?: string;
  "android:initOrder"?: number;
  "android:label"?: number;
  "android:multiprocess"?: boolean;
  "android:name"?: string;
  "android:permission"?: string;
  "android:process"?: string;
  "android:readPermission"?: string;
  "android:syncable"?: boolean;
  "android:writePermission"?: string;
};

export type ManifestProvider = {
  $: ManifestProviderAttributes;
};

type ManifestServiceAttributes = AndroidManifestAttributes & {
  "android:enabled"?: StringBoolean;
  "android:exported"?: StringBoolean;
  "android:permission"?: string;
};

export type ManifestService = {
  $: ManifestServiceAttributes;
  "intent-filter"?: ManifestIntentFilter[];
};

export type ManifestApplicationAttributes = {
  "android:name": string | ".MainApplication";
  "android:icon"?: string;
  "android:roundIcon"?: string;
  "android:label"?: string;
  "android:allowBackup"?: StringBoolean;
  "android:largeHeap"?: StringBoolean;
  "android:requestLegacyExternalStorage"?: StringBoolean;
  "android:usesCleartextTraffic"?: StringBoolean;
  "android:networkSecurityConfig"?: string;
  [key: string]: string | undefined;
};

export type ManifestActivityAttributes = ManifestApplicationAttributes & {
  "android:exported"?: StringBoolean;
  "android:launchMode"?: string;
  "android:theme"?: string;
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
  [key: string]: string | undefined;
};

export type ManifestActivity = {
  $: ManifestActivityAttributes;
} & ManifestActivityElements;

export type ManifestActivityElements = {
  "intent-filter"?: ManifestIntentFilter[];
};

export type ManifestUsesLibrary = {
  $: AndroidManifestAttributes & {
    "android:required"?: StringBoolean;
  };
};

export type ManifestApplication = {
  $: ManifestApplicationAttributes;
} & ManifestApplicationElements;

export type ManifestApplicationElements = {
  activity?: ManifestActivity[];
  service?: ManifestService[];
  receiver?: ManifestReceiver[];
  "meta-data"?: ManifestMetaData[];
  "uses-library"?: ManifestUsesLibrary[];
  provider?: ManifestProvider[];
};

type ManifestPermission = {
  $: AndroidManifestAttributes & {
    "android:protectionLevel"?: string | "signature";
  };
};

export type ManifestUsesPermission = {
  $: AndroidManifestAttributes;
};

type ManifestUsesFeature = {
  $: AndroidManifestAttributes & {
    "android:glEsVersion"?: string;
    "android:required": StringBoolean;
  };
};

export type AndroidManifest = {
  manifest: {
    $: {
      "xmlns:android": string;
      "xmlns:tools"?: string;
      package?: string;
      [key: string]: string | undefined;
    };
  } & AndroidManifestElements;
};

export type AndroidManifestElements = {
  permission?: ManifestPermission[];
  "uses-permission"?: ManifestUsesPermission[];
  "uses-permission-sdk-23"?: ManifestUsesPermission[];
  "uses-feature"?: ManifestUsesFeature[];
  application?: ManifestApplication[];
};

export type Manifest = {
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
};
