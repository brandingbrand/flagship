# @brandingbrand/code-plugin-packager-install

A plugin designed to handle package installation for React Native projects. It ensures that dependencies for both **iOS** and **Android** platforms are installed, with an emphasis on always using `bundle exec` for Ruby dependencies. The plugin simplifies the installation process by handling **Ruby gems** and **CocoaPods** installations.

## Features

- **Always Uses `bundle exec`**: The plugin always uses `bundle exec` to install Ruby dependencies and run CocoaPods commands for **iOS** and **Android** projects.
- **Platform-Specific Installations**: The plugin checks whether the project is configured for **iOS** and/or **Android** and runs the necessary installation commands for each platform.
- **Simplified Package Management**: Automatically installs **Ruby gems** and **CocoaPods** for iOS and Android, ensuring a smooth setup for your React Native project.

## Installation

To install this plugin into your React Native project, use Yarn (or npm/pnpm):

```bash
yarn add -D @brandingbrand/code-plugin-packager-install
```

Ensure that you have the necessary environment setup to use this plugin with `@brandingbrand/code-cli`.

## Usage

### Configuring the Plugin in `flagship-code.config.ts`

Integrate the `@brandingbrand/code-plugin-packager-install` plugin into your `flagship-code.config.ts` to run it automatically as part of your build or CLI setup.

Example configuration in `flagship-code.config.ts`:

```ts
import { defineConfig } from '@brandingbrand/code-cli-kit';

export default defineConfig({
  plugins: [
    '@brandingbrand/code-plugin-packager-install',
  ],
});
```

### Executing the Plugin

After adding the plugin to your project, you can invoke it as part of your build or through the CLI. The plugin will ensure that **iOS** and **Android** dependencies are installed, including **Ruby gems** and **CocoaPods**.

The plugin will automatically:

- Install Ruby gems for Android and iOS projects.
- Run `pod install` for iOS projects to install CocoaPods dependencies.

### Example Workflow

To execute the plugin, you can run it manually via your build pipeline or through `@brandingbrand/code-cli` commands (as configured in `flagship-code.config.ts`):

```bash
yarn flagship-cli install-packages
```

### Error Handling

The plugin logs detailed errors and will throw exceptions if it encounters any issues during the installation of Ruby gems or CocoaPods. For instance:

```bash
Error: failed to run "bundle exec install" for Android: <error_message>
Error: failed to run "bundle exec pod install" for iOS: <error_message>
```

## Plugin Functionality

### Platform-Specific Logic

1. **Android**:
   - If **Android** is supported, the plugin runs `bundle exec install` inside the `android` directory to install necessary Ruby gems.

2. **iOS**:
   - If **iOS** is supported, the plugin will:
     - Run `bundle exec install` inside the `ios` directory to install Ruby gems.
     - Run `bundle exec pod install` inside the `ios` directory to install CocoaPods dependencies.

## Development

### Running Tests

To run the tests for this plugin:

1. Install the dependencies:

```bash
yarn install
```

2. Run the tests using Jest:

```bash
yarn test
```

### Linting

To ensure your code is properly linted:

```bash
yarn lint
```
