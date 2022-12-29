import type { Rule } from "../types";

export const android: Rule[] = [
  {
    platform: "android",
    size: { legacy: 192, adaptive: 432 },
    dpi: "xxxhdpi",
  },
  {
    platform: "android",
    size: { legacy: 144, adaptive: 324 },
    dpi: "xxhdpi",
  },
  {
    platform: "android",
    size: { legacy: 96, adaptive: 216 },
    dpi: "xhdpi",
  },
  {
    platform: "android",
    size: { legacy: 72, adaptive: 162 },
    dpi: "hdpi",
  },
  {
    platform: "android",
    size: { legacy: 48, adaptive: 108 },
    dpi: "mdpi",
  },
];
