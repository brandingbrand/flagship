/**
 * @jest-environment-options {"requireTemplate": true, "fixtures": "fixtures"}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import {fs} from '@brandingbrand/code-cli-kit';
import {glob} from 'glob';

import {isPackage, resolveProjectEnvIndexPath, validateEnvFiles} from '../src';

describe('plugin-fsapp', () => {
  it('ios', async () => {
    expect(true).toBeTruthy();
  });

  it('android', async () => {
    expect(true).toBeTruthy();
  });
});

describe('isPackage', () => {
  test('should return true for valid package names', () => {
    expect(isPackage('package-name')).toBe(true);
    expect(isPackage('@scope/package-name')).toBe(true);
    expect(isPackage('package.name')).toBe(true);
  });

  test('should return false for file paths', () => {
    expect(isPackage('./path/to/file')).toBe(false);
    expect(isPackage('../file.ts')).toBe(false);
    expect(isPackage('/absolute/path')).toBe(false);
  });
});

describe('validateEnvFiles', () => {
  const mockValidEnvFile = `
    import { defineEnv } from '@brandingbrand/code-cli-kit';
    export default defineEnv({
      key: 'value'
    });
  `;

  const mockInvalidEnvFile = `
    import { defineEnv } from '@brandingbrand/code-cli-kit';
    export const something = {};
    export default defineEnv({
      key: 'value'
    });
  `;

  beforeEach(() => {
    jest.spyOn(fs, 'readFile').mockImplementation();
    jest.spyOn(glob, 'sync').mockImplementation();
  });

  test('should validate correct env files', async () => {
    jest.spyOn(fs, 'readFile').mockResolvedValue(mockValidEnvFile);
    jest.spyOn(glob, 'sync').mockReturnValue(['env.dev.ts', 'env.prod.ts']);

    const files = ['env.dev.ts', 'env.prod.ts'];
    const result = await validateEnvFiles('/base/dir');

    expect(result).toEqual(files);
  });

  test('should throw error for invalid env files', async () => {
    jest.spyOn(fs, 'readFile').mockResolvedValue(mockInvalidEnvFile);
    jest.spyOn(glob, 'sync').mockReturnValue(['env.dev.ts', 'env.prod.ts']);

    await expect(validateEnvFiles('/base/dir')).rejects.toThrow();
  });
});

describe('resolveProjectEnvIndexPath', () => {
  test('should resolve path for version < 11', () => {
    const version = '10.0.0';
    const result = resolveProjectEnvIndexPath(version);
    expect(result).toContain('project_env_index.js');
  });

  test('should resolve path for version >= 11', () => {
    const version = '11.0.0';
    const result = resolveProjectEnvIndexPath(version);
    expect(result).toContain('src/project_env_index.js');
  });

  test('should throw error for invalid version', () => {
    expect(() => resolveProjectEnvIndexPath('invalid')).toThrow();
  });
});
