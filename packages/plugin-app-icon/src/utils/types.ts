export interface Icon {
  platform: "ios" | "android";
  type: "universal" | "legacy" | "adaptive" | "notification";
  name: string;
  inputFile: string;
  transform?: {
    size: number;
    radius: number;
    padding: number;
  };
}

export interface Rule {
  platform: "ios" | "android";
  size: {
    universal?: number;
    legacy?: number;
    adaptive?: number;
    notification?: number;
  };
  scale?: number;
  idiom?: "ios-marketing" | "ipad" | "iphone";
  dpi?: string;
}
