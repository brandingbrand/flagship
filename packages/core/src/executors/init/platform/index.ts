import * as config from "./config";
import * as template from "./template";
import * as manifest from "./manifest";
import * as plist from "./plist";
import * as plugins from "./plugins";
import * as cocoapods from "./cocoapods";

export const executors = [
  template,
  config,
  manifest,
  plist,
  plugins,
  cocoapods,
];
