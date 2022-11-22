import type { Icon } from "../../types";

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
];
