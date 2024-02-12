/**
 * Represents the URL schemes configuration for an iOS app.
 */
export type URLScheme = {
  CFBundleURLName?: string;
  CFBundleURLSchemes: string[];
};

/**
 * Represents the possible interface orientations for an iOS app.
 */
export type InterfaceOrientation =
  | "UIInterfaceOrientationPortrait"
  | "UIInterfaceOrientationPortraitUpsideDown"
  | "UIInterfaceOrientationLandscapeLeft"
  | "UIInterfaceOrientationLandscapeRight";

/**
 * Represents the possible interface styles for an iOS app.
 */
export type InterfaceStyle = "Light" | "Dark" | "Automatic";

/**
 * Represents the App Transport Security settings for an iOS app.
 */
export type AppTransportSecurity = {
  NSExceptionDomains?: {
    [key: string]: {
      NSIncludesSubdomains?: boolean;
      NSExceptionAllowsInsecureHTTPLoads?: boolean;
      NSExceptionMinimumTLSVersion?: string;
      NSExceptionRequiresForwardSecrecy?: boolean;
    };
  };
};

/**
 * Represents the Info.plist configuration for an iOS app.
 */
export type InfoPlist = Record<string, unknown> & {
  UIStatusBarHidden?: boolean;
  UIStatusBarStyle?: string;
  UILaunchStoryboardName?: string | "LaunchScreen";
  CFBundleShortVersionString?: string;
  CFBundleVersion?: string;
  CFBundleDisplayName?: string;
  CFBundleIdentifier?: string;
  CFBundleName?: string;
  CFBundleURLTypes?: URLScheme[];
  CFBundleDevelopmentRegion?: string;
  ITSAppUsesNonExemptEncryption?: boolean;
  UIBackgroundModes?: string[];
  UISupportedInterfaceOrientations?: InterfaceOrientation[];
  UIUserInterfaceStyle?: InterfaceStyle;
  UIRequiresFullScreen?: boolean;
  NSAppTransportSecurity?: AppTransportSecurity;
};
