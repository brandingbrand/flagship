# @brandingbrand/code-plugin-env

A plugin designed to manage multi-tenant environment configurations for Flagship™ Code projects. This plugin automates the process of validating the required dependencies, and linking environment configuration files to your chosen environment provider.

## Features

- **Environment Configuration Retrieval**: Automatically retrieves environment configuration files based on release and environment settings.
- **Environment Linking**: Links environment configurations to either `@brandingbrand/code-app-env`, or `@brandingbrand/fsapp`'s `project_env_index.js` file based on project dependencies.
- **FSApp Version Compatibility**: Ensures compatibility with FSApp versions, including pre-v11 and v11+.
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

Additionally, if you are **not** using `@brandingbrand/code-preset-react-native`, you will need to specify `@brandingbrand/code-plugin-env` in the `plugins` array.

**With** `@brandingbrand/code-preset-react-native`:

```ts
export default {
  preset: '@brandingbrand/code-preset-react-native',
  envPath: 'path/to/your/env/configs', // Path to the environment configuration
  // ... other configurations
}
```

**Without** `@brandingbrand/code-preset-react-native`:

```ts
export default {
  envPath: 'path/to/your/env/configs', // Path to the environment configuration files
  plugins: [
    '@brandingbrand/code-plugin-env', // Include the environment plugin
    // ... other plugins
  ],
};
```

#### `build.<mode>.ts`

If in certain build modes you wish to hide specific app environments, You may also specify a `hiddenEnvs` array in your `build.<mode>.ts` file.

When using:

- `@brandingbrand/fsapp` - Hidden environments are filtered out, and will not be linked to the `project_env_index.js` file.
- `@brandingbrand/code-app-env` - The hidden environment array is copied to the `.flagshipappenvrc` file. When `code-app-env` loads the environment configurations via it's transformer, it will filter out the hidden environments according to this array.

In all cases, hidden environments are ignored when `--release` mode is enabled during `prebuild`.

```ts
// build.uat.ts
import type { CodePluginEnvironment } from '@brandingbrand/code-plugin-env';

export default defineBuild<CodePluginEnvironment>({
  // ... other build configurations ...
  codePluginEnvironment: {
    plugin: {
      // For example, hiding your internal 'env.dev.ts' environment when building for QA teams
      hiddenEnvs: ['dev'],
    },
  },
});
```

### Environment File Structure

The plugin expects environment configuration files to follow the naming convention `env.<mode>.ts`. For example:

- `env.dev.ts`
- `env.prod.ts`
- `env.staging.ts`

These files should export the environment-specific configuration.

### Plugin Execution

Once the configuration is in place, execute the plugin as part of your build or CLI workflow. The plugin performs the following steps:

1. **Validates `package.json`**:
    - Checks for the presence of one of the required dependencies: `@brandingbrand/fsapp` or `@brandingbrand/code-app-env`.
    - If neither is found, the rest of this plugin's execution is skipped.
    - If multiple are found, the plugin will execute tasks for both packages, but a warning will be logged as this is not recommended.
1. **If `@brandingbrand/fsapp` is found**:
    1. Retrieves and filters environment configuration files:
        - Finds files in the specified `envPath` directory that match the naming convention `env.<mode>.ts`.
        - if the current build configuration specifies `hiddenEnvs`, matching environment modes are filtered out.
        - In `--release` mode, only the mode supplied to the `--env` arg will be linked, and all other modes will be ignored.
    1. Parses and processes environment files:
        - Loads and parses the configuration files, preparing them for linking.
    1. Verifies FSApp Version:
        - Ensures the installed FSApp version is valid. The plugin supports both versions before and after FSApp v11.
        - If the version is incompatible, or cannot be validated, an error is thrown.
    1. Links environment configurations to `project_env_index.js`:
        - For FSApp versions before v11, configurations are written under `exports.default`.
        - For FSApp v11+, configurations are written directly under `exports`.
1. **If `@brandingbrand/code-app-env` is found**:
    1. Validates the configured `envPath` and confirms that the configured `--env` mode is valid.
    1. Generates a `.flagshipappenvrc` file in the root of the project to link the environment configurations.
    1. Configures native project files for Android and iOS:
        - For Android, `android/app/src/main/res/values/strings.xml` is modified to include:
          - `flagship_env` - The initial environment mode, specified by the `--env` argument.
          - `flagship_dev_menu` - Indicates if the dev menu should be enabled, `true` unless `--release` is specified.
        - For iOS, `ios/app/Info.plist` is modified to include:
          - `FlagshipEnv` - The initial environment mode, specified by the `--env` argument.
          - `FlagshipDevMenu` - Indicates if the dev menu should be enabled, `true` unless `--release` is specified.

### Example Execution

After configuring the environment file paths and dependencies, simply run the plugin with the desired options for your environment:

```bash
yarn flagship-code prebuild --build <build_mode> --env <env_mode>
```

## File Structure

Here is an overview of the file structure for this plugin:

```txt
plugin-env/
  ├── src/
  │   ├── packages/
  │   │   ├── <package>.ts
  |   |   └── index.ts
  |   ├── utils/
  │   │   ├── code-config.ts
  │   │   ├── package-plugin.ts
  │   │   ├── validators.ts
  │   ├── index.ts
  │   └── types.ts
  ├── .eslintrc.js
  ├── package.json
  ├── tsconfig.json
  └── __tests__/
      └── index.ts
```

### `plugin-env/src/index.ts`

This is the main entry point of the plugin, which contains the logic for enabling package-specific plugin functionality.

### `plugin-env/src/types.ts`

Defines the `CodePluginEnvironment` type to be extend the code project's build config with the plugin's specific properties, such as `hiddenEnvs`.

### `plugin-env/src/packages/<package>.ts`

Each `<package>.ts` file contains the logic for handling specific environment configurations. The plugin dynamically runs these files based on the project's installed packages

- `code-env.ts`: Links environment configurations to `@brandingbrand/code-app-env` through its `.flagshipappenvrc` file, and configures the necessary native code properties for Android and iOS.
- `fsapp-env.ts`: Links environment configurations to `@brandingbrand/fsapp` through its `project_env_index.js` file.

### `plugin-env/src/packages/index.ts`

Provides all package plugins as an array, which is filtered based on installed packages, and executed accordingly.

### `plugin-env/src/utils/`

Contains utility functions for the plugin:

- `code-config.ts`: Contains functions to retrieve and validate the Flagship™ Code configuration file.
- `package-plugin.ts`: Defines the special package-plugin structure for this plugin, and provides a purpose-built define function.
- `validators.ts`: Contains validation functions to ensure the environment paths and configurations exist as expected on the local filesystem.

### `plugin-env/package.json`

Contains the dependencies required for the plugin, such as `bundle-require`, `magicast`, and the development dependencies for `eslint`, `jest`, and `typescript`.

### `plugin-env/.eslintrc.js`

Defines the ESLint configuration to maintain code quality across the plugin’s source files.

### `plugin-env/tsconfig.json`

Provides TypeScript configuration for compiling the plugin’s source code.

## Dependencies

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
