/* eslint-disable @typescript-eslint/no-explicit-any */
import sharp from "sharp";
import { fs, path, summary } from "@brandingbrand/code-core";
import type { Config } from "@brandingbrand/code-core";

import { icons, rules } from "./utils";
import type { CodePluginAppIcon } from "./types";

const ios = summary.withSummary(
  async (config: Config & CodePluginAppIcon) => {
    const { appIconPath = "./assets/app-icon" } =
      config.codePluginAppIcon?.plugin ?? {};

    const contents = { images: [] };

    for (const i of icons.ios) {
      const inputFile = path.project.resolve(
        path.config.resolve(appIconPath),
        i.inputFile
      );

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
          path.ios.appIconSetPath(config),
          outputFileName
        );

        const outputSize = (r.size as any)[i.type] * (r.scale || 1);

        await sharp(inputFile)
          .resize(outputSize, outputSize, { fit: "fill" })
          .toFile(outputFilePath);
      }
    }

    await fs.writeFile(
      path.project.resolve(path.ios.appIconSetPath(config), "Contents.json"),
      JSON.stringify(contents, null, 2)
    );
  },
  "plugin-app-icon",
  "platform::ios"
);

const android = summary.withSummary(
  async (config: Config & CodePluginAppIcon) => {
    const { appIconPath = "./assets/app-icon" } =
      config.codePluginAppIcon?.plugin ?? {};
    const { inset } = config.codePluginAppIcon?.plugin?.android ?? {};

    for (const i of icons.android) {
      const inputFilePath = path.project.resolve(
        path.config.resolve(appIconPath),
        i.inputFile
      );
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
          path.android.resourcesPath(),
          outputFileName
        );

        const outputSize = (r.size as any)[i.type] * (r.scale || 1);

        await sharp(inputFile)
          .resize(outputSize, outputSize, { fit: "fill" })
          .toFile(outputFilePath);
      }
    }
    await fs.mkdir(
      path.project.resolve(path.android.resourcesPath(), "mipmap-anydpi-v26")
    );

    await fs.writeFile(
      path.project.resolve(
        path.android.resourcesPath(),
        "mipmap-anydpi-v26",
        "ic_launcher.xml"
      ),
      `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background"/>
    ${
      inset
        ? `    <foreground>
        <inset android:drawable="@mipmap/ic_launcher_foreground" android:inset="${inset}%"/>
    </foreground>`
        : `    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>`
    }
</adaptive-icon>
`
    );
  },
  "plugin-app-icon",
  "platform::android"
);

export * from "./types";

export { ios, android };
