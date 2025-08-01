import {Plugin} from '@brandingbrand/code-cli-kit';

export type CodePluginEnvironment = {
  codePluginEnvironment?: Plugin<{
    /**
     * List of environment names that should be hidden in the app's environment switcher.
     */
    hiddenEnvs: string[];
  }>;
};
