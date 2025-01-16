import {defineConfig} from '@brandingbrand/code-cli-kit';

export default defineConfig({
  buildPath: './coderc/build',
  envPath: './coderc/env',
  pluginPath: './coderc/plugins',
  plugins: [
    '@brandingbrand/code-plugin-asset',
    '@brandingbrand/code-plugin-app-icon',
    '@brandingbrand/code-plugin-splash-screen',
    'plugin-monorepo',
  ],
});
