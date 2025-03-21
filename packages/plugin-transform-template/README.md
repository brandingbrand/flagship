# @brandingbrand/code-plugin-transform-template
A plugin that takes flagship code templates and transforms them using the given build options. This plugin is part of the code-plugin-react-native preset, so you can just use that [setup](../preset-react-native/README.md). If you want to use manually below are the steps.

## Installation

To install the plugin with Yarn, run the following command:

```bash
yarn add -D @brandingbrand/code-plugin-transform-template
```

Ensure that you have the necessary setup to use the plugin with `@brandingbrand/code-cli`.

### Usage

To use this plugin with `@brandingbrand/code-cli` in a project, ensure that your project is set up with a `flagship-code.config.ts` file. This file typically contains the configuration for various actions and plugins, including this clean-up plugin.

Here’s how to integrate it into your `flagship-code.config.ts`:

1. **Configure the Plugin in `flagship-code.config.ts`**:

   You will need to add the `@brandingbrand/code-plugin-clean` plugin to your `flagship-code.config.ts` to execute it automatically or as part of a custom command.

   Example `flagship-code.config.ts`:

   ```ts
   import { defineConfig } from '@brandingbrand/code-cli-kit';

   export default defineConfig({
     plugins: [
       '@brandingbrand/code-plugin-tranform-template',
     ],
     // Other configurations for your project
   });
   ```

### Error Handling

If the plugin encounters any issues while removing the directories, it will log the errors and throw an exception with a detailed error message. For instance:

```bash
Error: unable to remove ios directory, <error_message>
```

## Development

### Running Tests

To run tests for this plugin:

1. Install the dependencies:

```bash
yarn install
```

2. Run the tests using `jest`:

```bash
yarn test
```

### Linting

To ensure code quality, you can run ESLint:

```bash
yarn lint
```
