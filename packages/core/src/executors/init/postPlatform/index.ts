import * as manifest from "./manifest";
import * as plist from "./plist";
import * as plugins from "./plugins";
import * as cocoapods from "./cocoapods";

export const executors = [manifest, plist, plugins, cocoapods];
