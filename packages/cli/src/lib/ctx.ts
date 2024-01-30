import type {
  BuildConfig,
  PrebuildOptions,
  CodeConfig,
} from "@brandingbrand/code-cli-kit";

/**
 * Configuration object containing various settings.
 *
 * @type {Context}
 */
export const ctx = {
  /**
   * @property {Object} fscodeConfig - Configuration object for fscode.
   */
  fscodeConfig: {} as CodeConfig,
  /**
   * @property {function} fscode - Getter function for accessing fscode configuration.
   */
  get fscode() {
    return this.fscodeConfig;
  },
  /**
   * @property {function} fsCode - Setter function for updating fscode configuration.
   */
  set fsCode(data: CodeConfig) {
    this.fscodeConfig = data;
  },
  /**
   * @property {Object} optionsConfig - Configuration object for options.
   */
  optionsConfig: {} as PrebuildOptions,
  /**
   * @property {function} options - Getter function for accessing options configuration.
   */
  get options() {
    return this.optionsConfig;
  },
  /**
   * @property {function} options - Setter function for updating options configuration.
   */
  set options(data: PrebuildOptions) {
    this.optionsConfig = data;
  },
  /**
   * @property {Object} buildConfig - Configuration object for build settings.
   */
  buildConfig: {} as BuildConfig,
  /**
   * @property {function} build - Getter function for accessing build configuration.
   */
  get build() {
    return this.buildConfig;
  },
  /**
   * @property {function} build - Setter function for updating build configuration.
   */
  set build(data: BuildConfig) {
    this.buildConfig = data;
  },
};
