/**
 * Configuration object containing various settings.
 *
 * @type {Context}
 */
export const ctx = {
  /**
   * @property {Object} fscodeConfig - Configuration object for fscode.
   */
  fscodeConfig: {},
  /**
   * @property {function} fscode - Getter function for accessing fscode configuration.
   */
  get fscode() {
    return this.fscodeConfig;
  },
  /**
   * @property {function} fsCode - Setter function for updating fscode configuration.
   */
  set fsCode(data: any) {
    this.fscodeConfig = data;
  },
  /**
   * @property {Object} optionsConfig - Configuration object for options.
   */
  optionsConfig: {},
  /**
   * @property {function} options - Getter function for accessing options configuration.
   */
  get options() {
    return this.optionsConfig;
  },
  /**
   * @property {function} options - Setter function for updating options configuration.
   */
  set options(data: any) {
    this.optionsConfig = data;
  },
  /**
   * @property {Object} envConfig - Configuration object for environment settings.
   */
  envConfig: {},
  /**
   * @property {function} env - Getter function for accessing environment configuration.
   */
  get env() {
    return this.envConfig;
  },
  /**
   * @property {function} env - Setter function for updating environment configuration.
   */
  set env(data: any) {
    this.envConfig = data;
  },
  /**
   * @property {Object} buildConfig - Configuration object for build settings.
   */
  buildConfig: {},
  /**
   * @property {function} build - Getter function for accessing build configuration.
   */
  get build() {
    return this.buildConfig;
  },
  /**
   * @property {function} build - Setter function for updating build configuration.
   */
  set build(data: any) {
    this.buildConfig = data;
  },
};
