import type { Rule } from "../../types";

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
