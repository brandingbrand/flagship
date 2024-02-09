import * as t from "io-ts";

/**
 * Defines the schema for the FlagshipCodeConfig object.
 */
export const FlagshipCodeConfigSchema = t.type({
  /**
   * The path to the build directory.
   */
  buildPath: t.string,

  /**
   * The path to the environment directory.
   */
  envPath: t.string,

  /**
   * The path to the plugin directory.
   */
  pluginPath: t.string,

  /**
   * An array of plugin names.
   */
  plugins: t.array(t.string),
});
