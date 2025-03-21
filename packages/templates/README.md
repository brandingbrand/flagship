# @brandingbrand/code-templates
Repository of templates for Flagship Code react-native application.

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

