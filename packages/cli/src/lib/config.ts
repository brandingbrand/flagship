import type {
  BuildConfig,
  PrebuildOptions,
  CodeConfig,
} from "@brandingbrand/code-cli-kit";

/**
 * Configuration object containing various settings.
 */
export const config = {
  /**
   * @property {Object} code - Configuration object for fscode.
   */
  codeConfig: {} as CodeConfig,
  /**
   * @property {function} fscode - Getter function for accessing fscode configuration.
   */
  get code() {
    return this.codeConfig;
  },
  /**
   * @property {function} fsCode - Setter function for updating fscode configuration.
   */
  set code(data: CodeConfig) {
    this.codeConfig = data;
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
