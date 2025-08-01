import {CodeConfig, path} from '@brandingbrand/code-cli-kit';
import {bundleRequire} from 'bundle-require';

let codeConfig: CodeConfig | undefined;
export const getCodeConfig = async (): Promise<CodeConfig> => {
  const configPath = path.project.resolve('flagship-code.config.ts');

  if (!codeConfig) {
    const {mod} = await bundleRequire({
      filepath: configPath,
      format: 'cjs',
    });
    codeConfig = mod?.default;
  }

  if (!codeConfig || typeof codeConfig !== 'object') {
    throw new Error(`Invalid configuration format in ${configPath}`);
  }

  return codeConfig;
};
