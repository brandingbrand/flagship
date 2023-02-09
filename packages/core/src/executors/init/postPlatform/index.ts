import * as plist from "./plist";
import * as styles from "./styles";
import * as plugins from "./plugins";
import * as manifest from "./manifest";
import * as cocoapods from "./cocoapods";

export const executors = [manifest, styles, plist, plugins, cocoapods];
