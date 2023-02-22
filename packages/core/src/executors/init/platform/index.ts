import * as clean from "./clean";
import * as plist from "./plist";
import * as styles from "./styles";
import * as strings from "./strings";
import * as plugins from "./plugins";
import * as template from "./template";
import * as manifest from "./manifest";
import * as packages from "./packages";
import * as cocoapods from "./cocoapods";
import * as frameworks from "./frameworks";
import * as entitlements from "./entitlements";

export const executors = [
  clean,
  template,
  entitlements,
  frameworks,
  packages,
  manifest,
  styles,
  strings,
  plist,
  plugins,
  cocoapods,
];
