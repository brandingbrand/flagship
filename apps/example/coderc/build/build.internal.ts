import { defineBuild } from "@brandingbrand/code-cli-kit";

export default defineBuild({
  ios: {
    bundleId: "com.brandingbrand",
    displayName: "Branding Brand",
    frameworks: [
      {
        framework: "SpriteKit.framework",
      },
    ],
  },
  android: {
    packageName: "com.brandingbrand",
    displayName: "Branding Brand",
  },
});
