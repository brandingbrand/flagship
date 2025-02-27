import {definePlugin, fs, path, logger} from '@brandingbrand/code-cli-kit';
import sharp from 'sharp';

import {CodePluginAppIcon} from './types';

/**
 * Mapping of Android density bucket names to their corresponding icon sizes in pixels.
 * Each density requires a specific icon size to maintain visual consistency across devices.
 * @constant {Record<string, number>}
 */
const ANDROID_ICON_SIZES = {
  'mipmap-mdpi': 48, // 1x density
  'mipmap-hdpi': 72, // 1.5x density
  'mipmap-xhdpi': 96, // 2x density
  'mipmap-xxhdpi': 144, // 3x density
  'mipmap-xxxhdpi': 192, // 4x density
} as const;

/**
 * Required size in pixels for Android adaptive icons.
 * This larger size allows for visual effects and animations in supported launchers.
 * The visible area is typically the center 108x108dp region.
 * @constant {number}
 */
const ANDROID_ADAPTIVE_ICON_SIZE = 432;

/**
 * Generates iOS app icons from a source image.
 * Creates necessary directory structure and generates both the icon and required metadata.
 *
 * @param {string} sourceIcon - Path to source icon file (must be 1024x1024 PNG)
 * @param {string} iosPath - Path to iOS project directory
 * @throws {Error} If directory creation or file operations fail
 * @returns {Promise<void>} Resolves when icon generation is complete
 */
async function generateIOSIcons(
  sourceIcon: string,
  iosPath: string,
): Promise<void> {
  const imagesPath = path.join(
    iosPath,
    'Images.xcassets',
    'AppIcon.appiconset',
  );
  await fs.mkdir(imagesPath, {recursive: true});

  // Copy 1024x1024 icon
  await sharp(sourceIcon)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(imagesPath, 'Icon.png'));

  // Create Contents.json
  const contents = {
    images: [
      {
        idiom: 'universal',
        platform: 'ios',
        scale: '2x',
        size: '20x20',
      },
      {
        idiom: 'universal',
        platform: 'ios',
        scale: '3x',
        size: '20x20',
      },
      {
        idiom: 'universal',
        platform: 'ios',
        scale: '2x',
        size: '29x29',
      },
      {
        idiom: 'universal',
        platform: 'ios',
        scale: '3x',
        size: '29x29',
      },
      {
        idiom: 'universal',
        platform: 'ios',
        scale: '2x',
        size: '38x38',
      },
      {
        idiom: 'universal',
        platform: 'ios',
        scale: '3x',
        size: '38x38',
      },
      {
        idiom: 'universal',
        platform: 'ios',
        scale: '2x',
        size: '40x40',
      },
      {
        idiom: 'universal',
        platform: 'ios',
        scale: '3x',
        size: '40x40',
      },
      {
        idiom: 'universal',
        platform: 'ios',
        scale: '2x',
        size: '60x60',
      },
      {
        idiom: 'universal',
        platform: 'ios',
        scale: '3x',
        size: '60x60',
      },
      {
        idiom: 'universal',
        platform: 'ios',
        scale: '2x',
        size: '64x64',
      },
      {
        idiom: 'universal',
        platform: 'ios',
        scale: '3x',
        size: '64x64',
      },
      {
        idiom: 'universal',
        platform: 'ios',
        scale: '2x',
        size: '68x68',
      },
      {
        idiom: 'universal',
        platform: 'ios',
        scale: '2x',
        size: '76x76',
      },
      {
        idiom: 'universal',
        platform: 'ios',
        scale: '2x',
        size: '83.5x83.5',
      },
      {
        filename: 'Icon.png',
        idiom: 'universal',
        platform: 'ios',
        size: '1024x1024',
      },
    ],
    info: {
      author: 'xcode',
      version: 1,
    },
  };

  await fs.writeFile(
    path.join(imagesPath, 'Contents.json'),
    JSON.stringify(contents, null, 2),
  );

  logger.info('Generated iOS app icon (1024x1024)');
}

const ICON_CONFIGS = {
  standard: {
    size: 1024,
    padding: 0.13, // 13% padding
    radius: 64, // moderate rounded corners
  },
  round: {
    size: 1024,
    padding: 0.04, // 4% padding
    radius: 512, // fully round
  },
};

const NOTIFICATION_ICON_CONFIGS = {
  size: 24, // base size in dp
  // Android density multipliers for different resolutions
  densities: {
    'mipmap-mdpi': 1, // 24x24
    'mipmap-hdpi': 1.5, // 36x36
    'mipmap-xhdpi': 2, // 48x48
    'mipmap-xxhdpi': 3, // 72x72
    'mipmap-xxxhdpi': 4, // 96x96
  },
};

async function generateAndroidNotificationIcon(
  sourceIcon: string,
  androidResPath: string,
): Promise<void> {
  for (const [folder, multiplier] of Object.entries(
    NOTIFICATION_ICON_CONFIGS.densities,
  )) {
    const size = Math.floor(NOTIFICATION_ICON_CONFIGS.size * multiplier);
    const folderPath = path.join(androidResPath, folder);
    await fs.mkdir(folderPath, {recursive: true});

    await sharp(sourceIcon)
      .resize(size, size)
      .png()
      .toFile(path.join(folderPath, 'ic_notification.png'));

    logger.info(
      `Generated Android notification icon in ${folder} (${size}x${size})`,
    );
  }
}

async function generateAndroidIcons(
  sourceIcon: string,
  androidResPath: string,
  notificationIcon?: string,
): Promise<void> {
  for (const [folder, size] of Object.entries(ANDROID_ICON_SIZES)) {
    const folderPath = path.join(androidResPath, folder);
    await fs.mkdir(folderPath, {recursive: true});

    // Calculate scaled values for this size
    const standardPadding = Math.round(size * ICON_CONFIGS.standard.padding);
    const roundPadding = Math.round(size * ICON_CONFIGS.round.padding);
    const standardRadius = Math.round(
      size * (ICON_CONFIGS.standard.radius / ICON_CONFIGS.standard.size),
    );
    const roundRadius = Math.round(
      size * (ICON_CONFIGS.round.radius / ICON_CONFIGS.round.size),
    );

    // Create SVG masks
    const standardMask = Buffer.from(`
      <svg width="${size}" height="${size}">
        <rect
          x="0"
          y="0"
          width="${size}"
          height="${size}"
          rx="${standardRadius}"
          ry="${standardRadius}"
          fill="white"
        />
      </svg>
    `);

    const cutoutMask = Buffer.from(
      `<svg><rect x="0" y="0" width="${size}" height="${size}" rx="${roundRadius}" ry="${roundRadius}"/></svg>`,
    );

    // Generate standard icon
    await sharp(sourceIcon)
      .resize(size, size, {fit: 'fill'})
      .composite([
        {
          input: standardMask,
          blend: 'dest-in',
        },
      ])
      .extend({
        top: standardPadding,
        bottom: standardPadding,
        left: standardPadding,
        right: standardPadding,
        background: {r: 0, g: 0, b: 0, alpha: 0},
      })

      .png()
      .toFile(path.join(folderPath, 'ic_launcher.png'));

    // Generate round icon
    await sharp(sourceIcon)
      .resize(size, size, {fit: 'fill'})
      .composite([{input: cutoutMask, blend: 'dest-in'}])
      .extend({
        top: roundPadding,
        bottom: roundPadding,
        left: roundPadding,
        right: roundPadding,
        background: {r: 0, g: 0, b: 0, alpha: 0},
      })
      .png()
      .toFile(path.join(folderPath, 'ic_launcher_round.png'));

    logger.info(`Generated Android icons in ${folder} (${size}x${size})`);

    if (notificationIcon) {
      await generateAndroidNotificationIcon(notificationIcon, androidResPath);
    }
  }
}

/**
 * Generates Android adaptive icons, including foreground, background, and configuration files.
 * Creates all necessary resources for supporting adaptive icons on Android 8.0 (API 26) and above.
 *
 * @param {string} foregroundIcon - Path to foreground layer image (must be 1024x1024 PNG)
 * @param {string} [backgroundIcon] - Optional path to background layer image (must be 1024x1024 PNG)
 * @param {string} [backgroundColor] - Optional hex color code for background (e.g. '#FFFFFF')
 * @param {string} androidResPath - Path to Android resources directory
 * @throws {Error} If required files cannot be created or processed
 * @returns {Promise<void>} Resolves when all adaptive icon resources are generated
 */
async function generateAndroidAdaptiveIcons(
  foregroundIcon: string,
  backgroundIcon: string | undefined,
  backgroundColor: string | undefined,
  androidResPath: string,
): Promise<void> {
  // Create anydpi-v26 folder
  const adaptivePath = path.join(androidResPath, 'mipmap-anydpi-v26');
  await fs.mkdir(adaptivePath, {recursive: true});

  // Generate foreground icon
  const xxxhdpiPath = path.join(androidResPath, 'mipmap-xxxhdpi');
  await fs.mkdir(xxxhdpiPath, {recursive: true});

  await sharp(foregroundIcon)
    .resize(ANDROID_ADAPTIVE_ICON_SIZE, ANDROID_ADAPTIVE_ICON_SIZE)
    .png()
    .toFile(path.join(xxxhdpiPath, 'ic_launcher_foreground.png'));

  // Generate XML files
  const xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    ${
      backgroundIcon
        ? '<background android:drawable="@mipmap/ic_launcher_background"/>'
        : `<background android:drawable="@color/ic_launcher_background"/>`
    }
    <foreground>
        <inset android:drawable="@mipmap/ic_launcher_foreground" android:inset="20%"/>
    </foreground>
</adaptive-icon>`;

  await fs.writeFile(path.join(adaptivePath, 'ic_launcher.xml'), xmlContent);
  await fs.writeFile(
    path.join(adaptivePath, 'ic_launcher_round.xml'),
    xmlContent,
  );

  // Generate background if image provided
  if (backgroundIcon) {
    await sharp(backgroundIcon)
      .resize(ANDROID_ADAPTIVE_ICON_SIZE, ANDROID_ADAPTIVE_ICON_SIZE)
      .png()
      .toFile(path.join(xxxhdpiPath, 'ic_launcher_background.png'));
  }

  // Generate colors.xml if background color provided
  if (backgroundColor) {
    const colorsPath = path.join(androidResPath, 'values');
    await fs.mkdir(colorsPath, {recursive: true});
    const colorsContent = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">${backgroundColor}</color>
</resources>`;
    await fs.writeFile(path.join(colorsPath, 'colors.xml'), colorsContent);
  }

  logger.info('Generated Android adaptive icons');
}

/**
 * Plugin for generating app icons for iOS and Android platforms.
 * Supports generation of traditional iOS icons, Android density-specific icons,
 * and Android adaptive icons with customizable foreground and background layers.
 *
 * @example
 * ```typescript
 * // Generate iOS icons
 * await plugin.ios({ universalIcon: 'path/to/icon.png' });
 *
 * // Generate Android adaptive icons
 * await plugin.android({
 *   foregroundIcon: 'path/to/fg.png',
 *   backgroundColor: '#FFFFFF'
 * });
 * ```
 */
export default definePlugin({
  /**
   * Generates iOS app icons from a universal icon.
   * Creates a single 1024x1024 icon and necessary metadata for Xcode.
   *
   * @param {CodePluginAppIcon} build - Configuration options
   * @throws {Error} If universalIcon is not provided or cannot be found
   * @returns {Promise<void>} Resolves when icon generation is complete
   */
  async ios(build: CodePluginAppIcon): Promise<void> {
    const {universalIcon} = build.codePluginAppIcon.plugin;
    if (!universalIcon) {
      throw new Error('universalIcon must be provided for iOS');
    }

    const iosPath = path.project.resolve('ios', 'app');

    if (!fs.existsSync(universalIcon)) {
      throw new Error(`Source icon not found: ${universalIcon}`);
    }

    await generateIOSIcons(universalIcon, iosPath);
    logger.info('iOS app icon generated successfully!');
  },

  /**
   * Generates Android app icons, supporting both traditional and adaptive icons.
   * Can generate density-specific traditional icons and/or adaptive icons with
   * customizable foreground and background layers.
   *
   * @param {CodePluginAppIcon} build - Configuration options
   * @throws {Error} If required icons are not provided or cannot be found
   * @returns {Promise<void>} Resolves when all icon generation is complete
   */
  async android(build: CodePluginAppIcon): Promise<void> {
    const {
      universalIcon,
      foregroundIcon,
      backgroundIcon,
      backgroundColor,
      notificationIcon,
    } = build.codePluginAppIcon.plugin;

    if (!universalIcon && !foregroundIcon) {
      throw new Error(
        'Either universalIcon or foregroundIcon must be provided for Android',
      );
    }

    const androidResPath = path.project.resolve('android/app/src/main/res');

    // Check source images exist
    for (const iconPath of [universalIcon, foregroundIcon, backgroundIcon]) {
      if (iconPath && !fs.existsSync(iconPath)) {
        throw new Error(`Source icon not found: ${iconPath}`);
      }
    }

    // Generate traditional icons
    if (universalIcon) {
      await generateAndroidIcons(
        universalIcon,
        androidResPath,
        notificationIcon,
      );
    }

    // Generate adaptive icons
    if (foregroundIcon) {
      await generateAndroidAdaptiveIcons(
        foregroundIcon,
        backgroundIcon,
        backgroundColor,
        androidResPath,
      );
    }

    logger.info('Android app icons generated successfully!');
  },
});

export * from './types';
