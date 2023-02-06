export type URLScheme = {
  CFBundleURLName?: string;
  CFBundleURLSchemes: string[];
};

export type InterfaceOrientation =
  | "UIInterfaceOrientationPortrait"
  | "UIInterfaceOrientationPortraitUpsideDown"
  | "UIInterfaceOrientationLandscapeLeft"
  | "UIInterfaceOrientationLandscapeRight";

export type InterfaceStyle = "Light" | "Dark" | "Automatic";

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
};
