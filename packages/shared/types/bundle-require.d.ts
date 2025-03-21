declare module 'bundle-require' {
  /**
   * Options for bundling and requiring a module
   */
  export interface Options {
    /** File path of the module to bundle */
    filepath: string;
    /** Current working directory */
    cwd?: string;
    /** Module format - CommonJS or ES Modules */
    format?: 'cjs' | 'esm';
  }

  /**
   * Bundles and requires a module file
   * @param options - Bundle options
   * @returns Promise resolving to the loaded module and its dependencies
   */
  declare function bundleRequire<T = any>(
    options: Options,
  ): Promise<{
    /** The loaded module */
    mod: T;
    /** Array of dependency file paths */
    dependencies: string[];
  }>;
}
