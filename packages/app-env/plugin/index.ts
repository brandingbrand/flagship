import path from 'path';
import fs from 'fs';

import type * as Babel from '@babel/core';
import {cosmiconfigSync, defaultLoadersSync} from 'cosmiconfig';

const NODE_PROCESS_IDENTIFIER = 'process';
const NODE_PROCESS_ENV_IDENTIFIER = 'env';
const FLAGSHIP_APP_ENV_IDENTIFIER = 'FLAGSHIP_APP_ENV';
const MODULE_NAME = 'flagshipappenvrc';

/**
 * Babel plugin to replace process.env.FLAGSHIP_APP_ENV with the appropriate environment configuration.
 *
 * This plugin dynamically loads environment configurations based on the .flagshipappenvrc file.
 * It replaces occurrences of `process.env.FLAGSHIP_APP_ENV` in your code with the correct
 * environment object, making it possible to have environment-specific builds.
 *
 * @param {typeof Babel} babel - Babel types.
 * @returns {Babel.PluginObj} Babel plugin object.
 */
export default function ({types: t}: typeof Babel): Babel.PluginObj {
  /**
   * Load environment configurations based on the .flagshipappenvrc file.
   *
   * This function reads the environment directory specified in the .flagshipappenvrc file,
   * filters the environment files based on the configuration, and returns an object
   * where each key is the environment name and the value is the environment configuration.
   *
   * @throws Will throw an error if the .flagshipappenvrc configuration file is not found.
   * @returns {Record<string, any>} A record containing environment configurations.
   */
  function getEnvs() {
    const explorerSync = cosmiconfigSync(MODULE_NAME);
    const result = explorerSync.load(
      path.resolve(process.cwd(), '.' + MODULE_NAME),
    );

    if (result === null || result.isEmpty) {
      throw new Error('Unable to find .flagshipappenvrc configuration file');
    }

    const {
      dir,
      hiddenEnvs = [],
      singleEnv,
    } = result.config as {
      dir: string;
      singleEnv?: string;
      hiddenEnvs?: string[];
    };

    const envFiles = fs
      .readdirSync(path.resolve(process.cwd(), dir))

      // Filter to only include files that match the pattern `env.<envName>.ts`
      .filter(it => /^env\.\w+\.ts/gm.test(it))

      // Filter out any environments that are hidden or don't match the single environment (if specified)
      .filter(it => {
        const regex = new RegExp(/^env\.(\w+)\.ts/gm);
        const match = regex.exec(it);

        if (!match || !match[1]) {
          return false;
        }

        // Exclude hidden environments
        return !hiddenEnvs.includes(match[1]);
      })

      // If `singleEnv` is specified, filter to only include that specific environment
      .filter(it => {
        if (!singleEnv) return true;

        const regex = new RegExp(/^env\.(\w+)\.ts/gm);
        const match = regex.exec(it);

        if (!match || !match[1]) {
          return false;
        }

        return singleEnv === match[1];
      })

      // Convert each environment file path to an absolute path
      .map(file => {
        return path.resolve(process.cwd(), dir, file);
      });

    /**
     * Reduce the array of environment file paths into an object where each key is the environment name
     * and the value is the environment's configuration object.
     */
    const envs = envFiles.reduce((acc, curr) => {
      // Load the environment configuration using cosmiconfig's TypeScript loader
      const env = defaultLoadersSync['.ts'](
        curr,
        fs.readFileSync(curr, 'utf-8'),
      );

      // Extract the environment name from the file path
      const regex = new RegExp(/env\.(\w+)\.ts/gm);
      const match = regex.exec(curr);

      if (!match || !match[1]) {
        return acc;
      }

      const envName = match[1];

      // Accumulate the environment configurations into a single object
      return {...acc, [envName]: env};
    }, {});

    return envs;
  }

  /**
   * Converts a JavaScript object to a Babel AST representation.
   *
   * This function recursively traverses a JavaScript object and converts it into
   * a corresponding Babel AST node, allowing it to be used in code transformations.
   *
   * @param {Object} value - The value to convert.
   * @returns {Babel.types.Expression} The Babel AST representation of the value.
   * @throws Will throw an error if the value type is unsupported.
   */
  function convertToBabelAST(value: Object): any {
    if (Array.isArray(value)) {
      return t.arrayExpression(value.map(convertToBabelAST));
    } else if (value === null) {
      return t.nullLiteral();
    } else if (typeof value === 'undefined') {
      return t.identifier('undefined');
    } else if (typeof value === 'boolean') {
      return t.booleanLiteral(value);
    } else if (typeof value === 'number') {
      return t.numericLiteral(value);
    } else if (typeof value === 'string') {
      return t.stringLiteral(value);
    } else if (typeof value === 'object') {
      // Handle objects
      const properties = Object.keys(value).map(key => {
        const propValue = convertToBabelAST((value as any)[key]) as any;
        return t.objectProperty(t.stringLiteral(key), propValue);
      });

      return t.objectExpression(properties);
    } else {
      throw new Error(`Unsupported type: ${typeof value}`);
    }
  }

  return {
    visitor: {
      /**
       * Visitor method to replace process.env.FLAGSHIP_APP_ENV with the appropriate environment object.
       *
       * This method checks if the MemberExpression is accessing `process.env.FLAGSHIP_APP_ENV`.
       * If it is, it replaces the expression with the corresponding environment object.
       *
       * @param {Babel.NodePath<Babel.types.MemberExpression>} path - The current AST node path.
       * @param {Babel.PluginPass} state - Plugin state.
       */
      MemberExpression({node, parentPath: parent}, state) {
        // Check if the MemberExpression is accessing process.env
        if (
          !t.isIdentifier(node.object, {name: NODE_PROCESS_IDENTIFIER}) ||
          !t.isIdentifier(node.property, {name: NODE_PROCESS_ENV_IDENTIFIER})
        ) {
          return;
        }
        // Ensure that the MemberExpression has a parent MemberExpression
        if (!t.isMemberExpression(parent.node)) {
          return;
        }

        // Replace process.env.FLAGSHIP_APP_ENV with the loaded environment object
        if (
          t.isIdentifier(parent.node.property, {
            name: FLAGSHIP_APP_ENV_IDENTIFIER,
          })
        ) {
          let envs = (state.file.metadata as any)[FLAGSHIP_APP_ENV_IDENTIFIER];

          if (!envs) {
            envs = getEnvs();
            (state.file.metadata as any)[FLAGSHIP_APP_ENV_IDENTIFIER] = envs;
          }

          parent.replaceWith(convertToBabelAST(envs));
        }
      },
    },
  };
}
