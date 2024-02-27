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
            { label: "Getting Started", link: "/guides/getting-started" },
            { label: "Flagship Code Configuration", link: "/guides/config/" },
            { label: "Build Configuration", link: "/guides/build/" },
            { label: "Env Configuration", link: "/guides/env/" },
            { label: "Plugins", link: "/guides/plugins/" },
          ],
        },
        {
          label: "Packages",
          items: [
            { label: "code-cli", link: "/packages/cli/" },
            {
              label: "code-cli-kit",
              link: "/packages/cli-kit/",
            },
            {
              label: "code-jest-config",
              link: "/packages/jest-config/",
            },
            {
              label: "code-plugin-app-icon",
              link: "/packages/plugin-app-icon/",
            },
            {
              label: "code-plugin-asset",
              link: "/packages/plugin-asset/",
            },
            {
              label: "code-plugin-fastlane",
              link: "/packages/plugin-fastlane/",
            },
            {
              label: "code-plugin-native-navigation",
              link: "/packages/plugin-native-navigation/",
            },
            {
              label: "code-plugin-permissions",
              link: "/packages/plugin-permissions/",
            },
            {
              label: "code-plugin-splash-screen",
              link: "/packages/plugin-splash-screen/",
            },
            {
              label: "code-plugin-target-extension",
              link: "/packages/plugin-target-extension/",
            },
          ],
        },
      ],
    }),
  ],
});
