export interface ConfigGeneratorSchema {
  projectName: string;
  /**
   * The framework this project was written with
   */
  framework: Framework;
  /**
   * Wether to use JavaScript or TypeScript
   */
  language: Language;
  /**
   * A list of libraries that this project consumes
   */
  libraries: Library[];
  /**
   * The testing framework the project uses
   */
  testing: Testing;
}

/**
 * The framework this project was written with
 */
export const enum Framework {
  Angular = 'angular',
  Node = 'node',
  None = 'none',
  React = 'react',
  ReactNative = 'react-native',
}

/**
 * Wether to use JavaScript or TypeScript
 */
export const enum Language {
  Javascript = 'javascript',
  Typescript = 'typescript',
}

export const enum Library {
  FPTs = 'fp-ts',
  Lodash = 'lodash',
  Ngneat = 'ngneat',
  Ngrx = 'ngrx',
  Rxjs = 'rxjs',
}

/**
 * The testing framework the project uses
 */
export const enum Testing {
  Jest = 'jest',
  Cypress = 'cypress',
  None = 'none',
}
