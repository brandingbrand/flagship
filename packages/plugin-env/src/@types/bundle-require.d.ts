declare module 'bundle-require' {
  export interface Options {
    filepath: string;
    cwd?: string;
    format?: 'cjs' | 'esm';
  }

  declare function bundleRequire<T = any>(
    options: Options,
  ): Promise<{
    mod: T;
    dependencies: string[];
  }>;
}
