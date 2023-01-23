import '@brandingbrand/fsapp';

declare module '@brandingbrand/kernel-app' {
  type ENV = import('@brandingbrand/kernel-core').Config<App> &
    import('@brandingbrand/kernel-plugin-asset').KernelPluginAsset &
    import('@brandingbrand/kernel-plugin-app-icon').KernelPluginAppIcon &
    import('@brandingbrand/kernel-plugin-fastlane').KernelPluginFastlane &
    import('@brandingbrand/kernel-plugin-permissions').KernelPluginPermissions &
    import('@brandingbrand/kernel-plugin-splash-screen').KernelPluginSplashScreen &
    import('@brandingbrand/kernel-plugin-target-extension').KernelPluginTargetExtension;

  interface App {}
}

declare module '@brandingbrand/fsapp' {
  let env: import('@brandingbrand/kernel-core').Config<
    import('@brandingbrand/kernel-app').App
  >;
}
