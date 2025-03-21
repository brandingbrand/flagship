# @brandingbrand/code-preset-react-native

A plugin preset that includes plugins required for setup of a react native application using fsapp.

## Installation

To install and use this plugin, you need to have the necessary dependencies installed. You can add this plugin to your project as follows:

```bash
yarn add -D @brandingbrand/code-preset-react-native
```

Ensure your project has the necessary setup to run plugins from `@brandingbrand/code-cli` & `@brandingbrand/code-cli-kit`.

## Usage

This plugin is executed as part of the `@brandingbrand/code-cli-kit` plugin system. Once configured, it will manage environment configuration linking automatically.

### Configuration

#### `flagship-code.config.ts`

You need to specify the `preset` in your project’s `flagship-code.config.ts` file, which points to the package to use for preset setup. 

Example:

```ts
export default {
  preset: '@brandingbrand/code-preset-react-native'
};
```

