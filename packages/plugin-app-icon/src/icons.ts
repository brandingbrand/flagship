import type { Icon } from "./types";

/**
 * Array of iOS icons.
 * @type {Icon[]}
 */
export const ios: Icon[] = [
  {
    platform: "ios",
    type: "universal",
    name: "Icon-{size}-{idiom}{scale}.png",
    inputFile: "ios-universal.png",
  },
];

/**
 * Array of Android icons.
 * @type {Icon[]}
 */
export const android: Icon[] = [
  {
    platform: "android",
    type: "adaptive",
    name: "mipmap-{dpi}/ic_launcher_background.png",
    inputFile: "android-adaptive-background.png",
  },
  {
    platform: "android",
    type: "adaptive",
    name: "mipmap-{dpi}/ic_launcher_foreground.png",
    inputFile: "android-adaptive-foreground.png",
  },
  {
    platform: "android",
    type: "legacy",
    name: "mipmap-{dpi}/ic_launcher.png",
    inputFile: "android-legacy.png",
    transform: { size: 812, radius: 64, padding: 106 },
  },
  {
    platform: "android",
    type: "legacy",
    name: "mipmap-{dpi}/ic_launcher_round.png",
    inputFile: "android-legacy.png",
    transform: { size: 944, radius: 472, padding: 40 },
  },
  {
    platform: "android",
    type: "notification",
    name: "mipmap-{dpi}/ic_notification.png",
    inputFile: "android-notification.png",
  },
];
