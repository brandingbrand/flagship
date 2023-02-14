import * as clean from "./clean";
import * as plist from "./plist";
import * as styles from "./styles";
import * as config from "./config";
import * as strings from "./strings";
import * as plugins from "./plugins";
import * as template from "./template";
import * as manifest from "./manifest";
import * as cocoapods from "./cocoapods";

export const executors = [
  clean,
  template,
  config,
  manifest,
  styles,
  strings,
  plist,
  plugins,
  cocoapods,
];
