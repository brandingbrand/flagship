export interface InitOptions {
  env: "prod" | string;
  platform: "ios" | "android" | "native";
  release: boolean;
  verbose: boolean;
}

export interface CleanOptions {
  platform: "ios" | "android" | "native";
  verbose: boolean;
}

export interface KeysOptions {
  platform: "ios" | "android" | "native";
  verbose: boolean;
}
