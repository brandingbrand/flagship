import type { Rule } from "./types";

/**
 * Array of rules for iOS platform.
 * @type {Rule[]}
 */
export const ios: Rule[] = [
  {
    platform: "ios",
    size: { universal: 1024 },
    scale: 1,
    idiom: "ios-marketing",
  },
  {
    platform: "ios",
    size: { universal: 83.5 },
    scale: 2,
    idiom: "ipad",
  },
  { platform: "ios", size: { universal: 20 }, scale: 1, idiom: "ipad" },
  { platform: "ios", size: { universal: 20 }, scale: 2, idiom: "ipad" },
  { platform: "ios", size: { universal: 29 }, scale: 1, idiom: "ipad" },
  { platform: "ios", size: { universal: 29 }, scale: 2, idiom: "ipad" },
  { platform: "ios", size: { universal: 40 }, scale: 1, idiom: "ipad" },
  { platform: "ios", size: { universal: 40 }, scale: 2, idiom: "ipad" },
  { platform: "ios", size: { universal: 76 }, scale: 1, idiom: "ipad" },
  { platform: "ios", size: { universal: 76 }, scale: 2, idiom: "ipad" },
  {
    platform: "ios",
    size: { universal: 20 },
    scale: 2,
    idiom: "iphone",
  },
  {
    platform: "ios",
    size: { universal: 20 },
    scale: 3,
    idiom: "iphone",
  },
  {
    platform: "ios",
    size: { universal: 29 },
    scale: 2,
    idiom: "iphone",
  },
  {
    platform: "ios",
    size: { universal: 29 },
    scale: 3,
    idiom: "iphone",
  },
  {
    platform: "ios",
    size: { universal: 40 },
    scale: 2,
    idiom: "iphone",
  },
  {
    platform: "ios",
    size: { universal: 40 },
    scale: 3,
    idiom: "iphone",
  },
  {
    platform: "ios",
    size: { universal: 60 },
    scale: 2,
    idiom: "iphone",
  },
  {
    platform: "ios",
    size: { universal: 60 },
    scale: 3,
    idiom: "iphone",
  },
];

/**
 * Array of rules for Android platform.
 * @type {Rule[]}
 */
export const android: Rule[] = [
  {
    platform: "android",
    size: { legacy: 192, adaptive: 432, notification: 96 },
    dpi: "xxxhdpi",
  },
  {
    platform: "android",
    size: { legacy: 144, adaptive: 324, notification: 72 },
    dpi: "xxhdpi",
  },
  {
    platform: "android",
    size: { legacy: 96, adaptive: 216, notification: 48 },
    dpi: "xhdpi",
  },
  {
    platform: "android",
    size: { legacy: 72, adaptive: 162, notification: 36 },
    dpi: "hdpi",
  },
  {
    platform: "android",
    size: { legacy: 48, adaptive: 108, notification: 24 },
    dpi: "mdpi",
  },
];
