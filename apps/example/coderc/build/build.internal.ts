import { defineBuild } from "@brandingbrand/code-cli-kit";

export default defineBuild({
  ios: {
    bundleId: "com.brandingbrand",
    displayName: "Branding Brand",
    podfile: {
      pods: ["pod 'PubNub', '~> 4.0'", "pod 'FlagshipCode', '~> 13.0'"],
    },
  },
  android: {
    packageName: "com.brandingbrand",
    displayName: "Branding Brand",
    gradle: {
      projectGradle: {
        compileSdkVersion: 35,
      },
    },
  },
});
