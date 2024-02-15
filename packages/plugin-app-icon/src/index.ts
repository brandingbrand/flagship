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

import * as icons from "./icons";
import * as rules from "./rules";
import type { CodePluginAppIcon } from "./types";
import sharp from "sharp";

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
    const { appIconPath } = build.codePluginAppIcon.plugin;
    const appIconSetPath = path.project.resolve(
      "ios",
      "app",
      "Images.xcassets",
      "AppIcon.appiconset"
    );

    const contents = { images: [] };

    for (const i of icons.ios) {
      const inputFile = path.project.resolve(appIconPath, i.inputFile);

      for (const r of rules.ios) {
        const outputFileName = i.name
          .replace("{size}", (r.size as any)[i.type])
          .replace("{idiom}", (r as any).idiom)
          .replace("{scale}", (r.scale as any) > 1 ? `@${r.scale}x` : "");

        contents.images.push({
          filename: outputFileName,
          idiom: r.idiom,
          scale: `${r.scale}x`,
          size: `${r.size.universal}x${r.size.universal}`,
        } as never);

        const outputFilePath = path.project.resolve(
          appIconSetPath,
          outputFileName
        );

        const outputSize = (r.size as any)[i.type] * (r.scale || 1);

        await sharp(inputFile)
          .resize(outputSize, outputSize, { fit: "fill" })
          .toFile(outputFilePath);
      }
    }

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
    const { appIconPath, iconInsets } = build.codePluginAppIcon.plugin;
    const resourcesPath = path.project.resolve(
      "android",
      "app",
      "src",
      "main",
      "res"
    );

    for (const i of icons.android) {
      const inputFilePath = path.project.resolve(appIconPath, i.inputFile);
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

      for (const r of rules.android) {
        const outputFileName = i.name.replace("{dpi}", (r as any).dpi);

        const outputFilePath = path.project.resolve(
          resourcesPath,
          outputFileName
        );

        const outputSize = (r.size as any)[i.type] * (r.scale || 1);

        await sharp(inputFile)
          .resize(outputSize, outputSize, { fit: "fill" })
          .toFile(outputFilePath);
      }
    }
    await fs.mkdir(path.project.resolve(resourcesPath, "mipmap-anydpi-v26"));

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
