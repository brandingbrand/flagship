import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    starlight({
      title: "Flagship Code",
      favicon: "./src/assets/logo.svg",
      logo: {
        src: "./src/assets/logo.svg",
      },
      social: {
        github: "https://github.com/brandingbrand/flagship",
      },
      customCss: ["./src/styles.css"],
      sidebar: [
        {
          label: "Overview",
          items: [
            { label: "Overview", link: "/overview/overview/" },
            { label: "Objectives", link: "/overview/objectives/" },
            { label: "How It Works", link: "/overview/how-it-works/" },
          ],
        },
        {
          label: "Guides",
          items: [
            {
              label: "Getting Started",
              link: "/guides/getting-started",
            },
            {
              label: "Flagship Code Configuration",
              link: "/guides/config/",
            },
            { label: "Build Configuration", link: "/guides/build/" },
            { label: "Env Configuration", link: "/guides/env/" },
            { label: "Plugins", link: "/guides/plugins/" },
            { label: "Migration", link: "/guides/migration/" },
          ],
        },
        {
          label: "Packages",
          items: [
            { label: "cli", link: "/packages/cli/" },
            {
              label: "cli-kit",
              link: "/packages/cli-kit/",
            },
            {
              label: "jest-config",
              link: "/packages/jest-config/",
            },
            {
              label: "plugin-app-icon",
              link: "/packages/plugin-app-icon/",
            },
            {
              label: "plugin-asset",
              link: "/packages/plugin-asset/",
            },
            {
              label: "plugin-fastlane",
              link: "/packages/plugin-fastlane/",
            },
            {
              label: "plugin-native-navigation",
              link: "/packages/plugin-native-navigation/",
            },
            {
              label: "plugin-permissions",
              link: "/packages/plugin-permissions/",
            },
            {
              label: "plugin-splash-screen",
              link: "/packages/plugin-splash-screen/",
            },
            {
              label: "plugin-target-extension",
              link: "/packages/plugin-target-extension/",
            },
          ],
        },
      ],
    }),
  ],
  site: "https://brandingbrand.github.io",
  base: "flagship",
});
