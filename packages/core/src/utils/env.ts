import * as path from "./path";

/**
 * Object to hold the most recent updated env configuration.
 */
export default {
  /**
   * Private up-to-date env configuration.
   */
  _env: undefined as any,
  /**
   * Getter to retrieve private up-to-date copy of env configuration
   * or attempt to require to retrieve the env configruation via file
   * or return empty object.
   *
   * @return {any} The env configuration.
   */
  get get() {
    if (this._env) return this._env;

    try {
      this._env = require(path.project.resolve(
        path.config.envPath(),
        "env.js"
      )).default;

      return this._env;
    } catch {
      return {};
    }
  },
  /**
   * Setter to update the private env configuration.
   *
   * @param {any} env Updated env configuration.
   */
  set set(env: any) {
    this._env = env;
  },
};
