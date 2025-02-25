/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import {fs} from '@brandingbrand/code-cli-kit';
import cleanPlugin from '../src';

describe('Clean Plugin', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('ios()', () => {
    it('should remove ios directory when it exists', async () => {
      // Verify ios directory exists before cleaning
      // Execute ios clean
      await cleanPlugin.ios?.(__flagship_code_build_config, {} as any);

      // Verify ios directory was removed
      const iosExistsAfter = await fs.doesPathExist('ios');
      expect(iosExistsAfter).toBe(false);
    });

    it('should not throw error when ios directory does not exist', async () => {
      // Remove ios directory first
      await cleanPlugin.ios?.(__flagship_code_build_config, {} as any);

      // Attempt to clean again - should not throw
      await expect(
        cleanPlugin.ios?.(__flagship_code_build_config, {} as any),
      ).resolves.not.toThrow();
    });
  });

  describe('android()', () => {
    it('should remove android directory when it exists', async () => {
      // Execute android clean
      await cleanPlugin.android?.(__flagship_code_build_config, {} as any);

      // Verify android directory was removed
      const androidExistsAfter = await fs.doesPathExist('android');
      expect(androidExistsAfter).toBe(false);
    });

    it('should not throw error when android directory does not exist', async () => {
      // Remove android directory first
      await cleanPlugin.android?.(__flagship_code_build_config, {} as any);

      // Attempt to clean again - should not throw
      await expect(
        cleanPlugin.android?.(__flagship_code_build_config, {} as any),
      ).resolves.not.toThrow();
    });
  });

  describe('Integration', () => {
    it('should be able to clean both ios and android directories', async () => {
      // Clean both directories
      await Promise.all([
        cleanPlugin.ios?.(__flagship_code_build_config, {} as any),
        cleanPlugin.android?.(__flagship_code_build_config, {} as any),
      ]);

      // Verify both directories were removed
      const [iosExistsAfter, androidExistsAfter] = await Promise.all([
        fs.doesPathExist('ios'),
        fs.doesPathExist('android'),
      ]);

      expect(iosExistsAfter).toBe(false);
      expect(androidExistsAfter).toBe(false);
    });
  });
});
