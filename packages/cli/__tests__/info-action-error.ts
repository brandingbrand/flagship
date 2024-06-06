/**
 * @jest-environment-options {"requireTemplate": true}
 */

import {config} from '@/lib';
import info from '../src/actions/info';

jest.spyOn(console, 'log').mockImplementation(jest.fn());
jest.spyOn(console, 'warn').mockImplementation(jest.fn());
jest.spyOn(console, 'info').mockImplementation(jest.fn());
jest.spyOn(console, 'error').mockImplementation(jest.fn());
jest.spyOn(process, 'exit').mockImplementation(jest.fn() as any);

jest.mock('update-check');
jest.mock('@brandingbrand/code-cli-kit', () => ({
  ...jest.requireActual('@brandingbrand/code-cli-kit'), // Use the actual 'os' module implementation
  isWindows: true,
}));

describe('info action', () => {
  it('should throw error', async () => {
    config.options = {
      build: 'internal',
      env: 'staging',
      command: 'prebuild',
      platform: 'native',
      release: false,
      verbose: false,
    };

    await info();

    expect(process.exit).toHaveBeenCalled();
  });
});
