# @brandingbrand/code-plugin-clean-native-files

A plugin for cleaning up native `android` and `ios` directories from your project. This plugin checks if these directories exist and removes them, providing clear logging for each action. It is useful for resetting your environment or cleaning up unnecessary native directories during your build or maintenance process.

## Features

- **Directory Removal**: Removes `android` and `ios` directories if they exist in the project.
- **Clear Logging**: Logs success or failure messages for both directories.
- **Error Handling**: Catches and logs errors if the directories cannot be removed.

## Installation

To install the plugin with Yarn, run the following command:

```bash
yarn add @brandingbrand/code-plugin-clean-native-files rimraf
```

Ensure that you have the necessary setup to use the plugin with `@brandingbrand/code-cli`.

## Usage

This plugin is executed using `@brandingbrand/code-cli`, making it part of your build or maintenance process to clean up unnecessary directories.

### Configuration

You can add this plugin to your project by integrating it with your build pipeline or running it manually like this:

```ts
import cleanNativeFilesPlugin from '@brandingbrand/code-plugin-clean-native-files';

cleanNativeFilesPlugin.common();
```

### Plugin Workflow

The plugin performs the following steps:

1. **Check for the existence of the `android` directory**:
   - If the `android` directory exists, it will be removed.
2. **Check for the existence of the `ios` directory**:
   - If the `ios` directory exists, it will be removed.
3. **Clear Logging**:
   - Logs whether the `android` and `ios` directories were successfully removed.
   - Logs any errors encountered during the removal process.

### Example Usage

You can run this plugin within a build or cleanup script using `@brandingbrand/code-cli` like this:

```ts
import cleanNativeFilesPlugin from '@brandingbrand/code-plugin-clean-native-files';

cleanNativeFilesPlugin.common()
  .then(() => {
    console.log('Cleanup completed successfully');
  })
  .catch(err => {
    console.error('Error during cleanup:', err);
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

## License

This plugin is licensed under the [MIT License](LICENSE).
