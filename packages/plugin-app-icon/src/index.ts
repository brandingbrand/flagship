/**
 * Defines a plugin for @brandingbrand/code-cli-kit.
 * @module Plugin
 */

import {
  type BuildConfig,
  type PrebuildOptions,
  definePlugin,
  path,
  fs,
} from "@brandingbrand/code-cli-kit";
import sharp from "sharp";

import * as icons from "./icons";
import * as rules from "./rules";
import type { CodePluginAppIcon } from "./types";

/**
 * Defines a plugin with functions for both iOS and Android platforms.
 * @alias module:Plugin
 * @param {BuildConfig} build - The build configuration object.
 * @param {PrebuildOptions} options - The options object.
 */
export default definePlugin<CodePluginAppIcon>({
  /**
   * Function to be executed for iOS platform.
   * @param {BuildConfig & CodePluginAppIcon} build - The build configuration object for iOS.
   * @param {PrebuildOptions} options - The options object for iOS.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  ios: async function (
    build: BuildConfig & CodePluginAppIcon,
    options: PrebuildOptions
  ): Promise<void> {
    // Destructure appIconPath for later access
    const { appIconPath } = build.codePluginAppIcon.plugin;

    // Set AppIcon.appiconset absolute path for later access
    const appIconSetPath = path.project.resolve(
      "ios",
      "app",
      "Images.xcassets",
      "AppIcon.appiconset"
    );

    // Setup default contents object
    const contents = { images: [] };

    // Iterate through all iOS icons
    for (const i of icons.ios) {
      // Generate the absolute path for the input file
      const inputFile = path.project.resolve(appIconPath, i.inputFile);

      // Iterate through all the icon rules
      for (const r of rules.ios) {
        // Generate file based upon icon and rule object
        const outputFileName = i.name
          .replace("{size}", (r.size as any)[i.type])
          .replace("{idiom}", (r as any).idiom)
          .replace("{scale}", (r.scale as any) > 1 ? `@${r.scale}x` : "");

        // Update contents object with exepected output icon
        contents.images.push({
          filename: outputFileName,
          idiom: r.idiom,
          scale: `${r.scale}x`,
          size: `${r.size.universal}x${r.size.universal}`,
        } as never);

        // Generate the output file path based upon AppIcon.appiconset global path and output filename
        const outputFilePath = path.project.resolve(
          appIconSetPath,
          outputFileName
        );

        // Calculate the output size
        const outputSize = (r.size as any)[i.type] * (r.scale || 1);

        // Utilize sharp to generate the icon with initial app icon
        await sharp(inputFile)
          .resize(outputSize, outputSize, { fit: "fill" })
          .toFile(outputFilePath);
      }
    }

    // Write updated contents to Contents.json
    await fs.writeFile(
      path.project.resolve(appIconSetPath, "Contents.json"),
      JSON.stringify(contents, null, 2)
    );
  },

  /**
   * Function to be executed for Android platform.
   * @param {BuildConfig & CodePluginAppIcon} build - The build configuration object for Android.
   * @param {PrebuildOptions} options - The options object for Android.
   * @returns {Promise<void>} A promise that resolves when the process completes.
   */
  android: async function (
    build: BuildConfig & CodePluginAppIcon,
    options: PrebuildOptions
  ): Promise<void> {
    // Destructure attributes for later use
    const { appIconPath, iconInsets } = build.codePluginAppIcon.plugin;

    // Calculate Android resources path
    const resourcesPath = path.project.resolve(
      "android",
      "app",
      "src",
      "main",
      "res"
    );

    // Iterate through all Android icon types
    for (const i of icons.android) {
      // Generate absolute path to the specific app icon
      const inputFilePath = path.project.resolve(appIconPath, i.inputFile);

      // Generate buffer via sharp for app icon file
      const inputFile = await (async function () {
        if (!i.transform) return inputFilePath;

        const { size, radius, padding } = i.transform;
        const cutoutMask = Buffer.from(
          `<svg><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}"/></svg>`
        );
        return await sharp(inputFilePath)
          .resize(size, size, { fit: "fill" })
          .composite([{ input: cutoutMask, blend: "dest-in" }])
          .extend({
            top: padding,
            bottom: padding,
            left: padding,
            right: padding,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .toBuffer();
      })();

      // Iterate through the icon rules for specific dpi
      for (const r of rules.android) {
        // Generate output file name based upon dpi
        const outputFileName = i.name.replace("{dpi}", (r as any).dpi);

        // Calculate absolute path of the output file
        const outputFilePath = path.project.resolve(
          resourcesPath,
          outputFileName
        );

        // Calcuate the size of resized icon based on type and scale
        const outputSize = (r.size as any)[i.type] * (r.scale || 1);

        // Execute sharp to resize and write the icon
        await sharp(inputFile)
          .resize(outputSize, outputSize, { fit: "fill" })
          .toFile(outputFilePath);
      }
    }

    // Create a new android directory for XML files defining adaptive icons for devices running Android 8.0 (API level 26) and higher
    await fs.mkdir(path.project.resolve(resourcesPath, "mipmap-anydpi-v26"));

    // Write the XML file defining the structure of an adaptive launcher icon
    await fs.writeFile(
      path.project.resolve(
        path.project.resolve("android", "app", "src", "main", "res"),
        "mipmap-anydpi-v26",
        "ic_launcher.xml"
      ),
      `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background"/>
    <foreground>
        <inset android:drawable="@mipmap/ic_launcher_foreground" android:inset="${iconInsets}%"/>
    </foreground>
</adaptive-icon>
`
    );
  },
});

export type { CodePluginAppIcon };
