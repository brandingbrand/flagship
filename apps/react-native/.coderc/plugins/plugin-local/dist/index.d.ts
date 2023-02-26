import { Config } from "@brandingbrand/code-core";
import { CodePluginLocal } from "./types";
declare const ios: (config: Config<unknown> & CodePluginLocal) => Promise<void>;
declare const android: (config: Config<unknown> & CodePluginLocal) => Promise<void>;
export * from "./types";
export { ios, android };
