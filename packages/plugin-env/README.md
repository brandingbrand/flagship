# @brandingbrand/code-plugin-env

A plugin designed to manage multi-tenant environment configurations for FSApp projects. This plugin automates the process of validating the required dependencies, linking environment configuration files, and writing the configurations to `project_env_index.js` for FSApp.

## Features

- **Validation**: Ensures that `@brandingbrand/fsapp` is present in the `package.json` dependencies.
- **Environment Configuration Retrieval**: Automatically retrieves environment configuration files based on release and environment settings.
- **FSApp Version Compatibility**: Ensures compatibility with FSApp versions, including pre-v11 and v11+.
- **Environment Linking**: Links environment configurations to the FSApp `project_env_index.js` file based on the required format for different FSApp versions.
- **Automatic File Handling**: Identifies and parses `.ts` environment configuration files.

## Installation

To install and use this plugin, you need to have the necessary dependencies installed. You can add this plugin to your project as follows:

```bash
yarn add -D @brandingbrand/code-plugin-env
```

Ensure your project has the necessary setup to run plugins from `@brandingbrand/code-cli` & `@brandingbrand/code-cli-kit`.

## Usage

This plugin is executed as part of the `@brandingbrand/code-cli-kit` plugin system. Once configured, it will manage environment configuration linking automatically.

### Configuration

#### `flagship-code.config.ts`

You need to specify the `envPath` in your project’s `flagship-code.config.ts` file, which points to the directory containing environment configuration files.

Example:

```ts
export default {
  envPath: 'path/to/your/env/configs', // Path to the environment configuration files
};
```

### Environment File Structure

The plugin expects environment configuration files to follow the naming convention `env.<mode>.ts`. For example:

- `env.development.ts`
- `env.production.ts`
- `env.staging.ts`

These files should export the environment-specific configuration.

### Plugin Execution

Once the configuration is in place, execute the plugin as part of your build or CLI workflow. The plugin performs the following steps:

1. **Validates `package.json`**:
   - Ensures the `@brandingbrand/fsapp` dependency is included in your project’s `package.json`.

2. **Retrieves and filters environment configuration files**:
   - Filters files based on the environment mode (e.g., `env.development.ts`) or based on general matching patterns for all environment configurations.

3. **Parses and processes environment files**:
   - Loads and parses the configuration files, preparing them for linking.

4. **Verifies FSApp Version**:
   - Ensures the installed FSApp version is valid. The plugin supports both versions before and after FSApp v11.

5. **Links environment configurations to `project_env_index.js`**:
   - For FSApp versions before v11, configurations are written under `exports.default`.
   - For FSApp v11+, configurations are written directly under `exports`.

### Example Execution

After configuring the environment file paths and dependencies, simply run the plugin with the desired options for your environment:

```bash
yarn flagship-code --env production
```

The plugin will automatically validate the setup, find the configuration files, parse them, and link them to the appropriate `project_env_index.js`.

## Error Handling

The plugin includes multiple checks to ensure that everything is configured correctly:

- If `@brandingbrand/fsapp` is missing from `package.json`, an error will be thrown.
- If no valid environment configuration files are found in the specified directory, an error will be thrown.
- If FSApp’s version cannot be parsed or is incompatible, the plugin will throw an error.

## File Structure

Here is an overview of the file structure for this plugin:

```
plugin-env/
  ├── src/
  │   ├── @types/
  │   │   └── bundle-require.d.ts
  │   └── index.ts
  ├── .eslintrc.js
  ├── package.json
  ├── tsconfig.json
  └── __tests__/
      └── index.ts
```

### `plugin-env/src/@types/bundle-require.d.ts`

Defines the types for the `bundle-require` module, which is used to load the environment configuration files dynamically.

### `plugin-env/src/index.ts`

This is the main entry point of the plugin, which contains the logic for validating, parsing, and linking environment configurations.

### `plugin-env/package.json`

Contains the dependencies required for the plugin, such as `bundle-require`, `magicast`, and the development dependencies for `eslint`, `jest`, and `typescript`.

### `plugin-env/.eslintrc.js`

Defines the ESLint configuration to maintain code quality across the plugin’s source files.

### `plugin-env/tsconfig.json`

Provides TypeScript configuration for compiling the plugin’s source code.

## Dependencies

- **`@brandingbrand/fsapp`**: Required to work with FSApp.
- **`bundle-require`**: Used to dynamically load environment configuration files.
- **`magicast`**: Used for manipulating and writing the final `project_env_index.js`.
- **`@brandingbrand/code-cli-kit`**: Required for defining and running the plugin.

## Development

To contribute to the development of this plugin, follow these steps:

1. Clone the repository.
2. Install the dependencies using `yarn install`.
3. Run linting and tests:
   ```bash
   yarn lint
   yarn test
   ```
4. Make your changes and submit a pull request.
