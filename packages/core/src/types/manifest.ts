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