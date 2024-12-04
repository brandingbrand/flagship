import fs from 'fs';
import {cwd} from 'process';

import {Command, Option} from 'commander';
import {glob} from 'glob';
import findNodeModules from 'find-node-modules';
import Ajv from 'ajv';

import schema from '../../schema.json';

const ajv = new Ajv();

/**
 * Interface for the configuration options in the JSON file.
 */
interface CommandOption {
  /**
   * The flag syntax for the option, e.g., `--flag <value>` or `--flag [value]`.
   */
  flags: string;
  /**
   * A description of the option, shown in the CLI help output.
   */
  description: string;
  /**
   * The default value for the option if it is not provided by the user.
   */
  defaultValue?: string | number | boolean | null;
  /**
   * A list of valid values for the option, if applicable.
   */
  choices?: string[];
  /**
   * The name of a global function to parse the input value.
   */
  parse?: string;
  /**
   * Whether the option is mandatory.
   */
  required?: boolean;
}

/**
 * Interface for the structure of the flagship-code.commands.json file.
 */
interface ConfigFile {
  /**
   * A list of command options to dynamically add to the CLI.
   */
  options: CommandOption[];
}

/**
 * The name of the configuration file to search for in node_modules directories.
 *
 * This file contains CLI configuration options defined by plugins or packages
 * and is used to dynamically extend the functionality of the CLI.
 */
const CONFIG_FILE_NAME = '.flagshipcoderc.json';

/**
 * Find all flagship-code.commands.json files in node_modules
 */
function findConfigFiles() {
  const nodeModulesPaths = findNodeModules({cwd: cwd(), relative: false}).map(
    it => `${it}/**/${CONFIG_FILE_NAME}`,
  );

  return glob.sync(nodeModulesPaths, {
    nodir: true, // Ensure we only get files
  });
}

/**
 * Reads and parses a single JSON configuration file.
 *
 * @param configPath - Path to the configuration file.
 * @returns Parsed configuration or null if invalid.
 */
function parseConfigFile(configPath: string): ConfigFile | null {
  const fileContents = fs.readFileSync(configPath, 'utf8');
  const json = JSON.parse(fileContents) as ConfigFile;

  const validate = ajv.compile(schema);
  const valid = validate(json);

  if (!valid)
    throw Error(
      `ValidationError: ${CONFIG_FILE_NAME} does not conform to the json schema.`,
    );

  return json;
}

/**
 * Loads and aggregates all JSON configuration files matching the glob pattern.
 *
 * @returns Aggregated configuration object.
 */
function loadConfigFiles(): ConfigFile {
  const configFiles = findConfigFiles();

  const aggregatedOptions: CommandOption[] = [];

  if (configFiles.length === 0) {
    console.warn(`No ${CONFIG_FILE_NAME} files found.`);
    return {options: []};
  }

  configFiles.forEach(configPath => {
    const parsedConfig = parseConfigFile(configPath);
    if (parsedConfig?.options) {
      aggregatedOptions.push(...parsedConfig.options);
    }
  });

  return {options: aggregatedOptions};
}

/**
 * Custom argument parser to validate input against choices.
 *
 * @param value - The input value.
 * @param choices - The allowed choices.
 * @returns The validated value.
 * @throws Error if the value is not in the allowed choices.
 */
function validateChoice(value: string, choices: string[]): string {
  if (!choices.includes(value)) {
    throw new Error(
      `Invalid value '${value}'. Allowed choices are: ${choices.join(', ')}`,
    );
  }
  return value;
}

/**
 * Dynamically registers custom options from the configuration file to a given Commander command.
 *
 * @param command - The Commander command to which options will be added.
 */
export function registerCustomOptions(command: Command): void {
  const config = loadConfigFiles();

  config.options.forEach(opt => {
    const option = new Option(opt.flags, opt.description);

    if (opt.defaultValue !== undefined) {
      option.default(opt.defaultValue);
    }

    if (opt.required) {
      option.makeOptionMandatory();
    }

    if (opt.choices) {
      option.argParser((value: string, previous: unknown) =>
        validateChoice(value, opt.choices ?? []),
      );
    }

    command.addOption(option);
  });
}
