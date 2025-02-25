/**
 * @jest-environment-options {"requireTemplate": true}
 * @description Tests for the clean plugin that removes iOS and Android directories
 * @requires Jest environment with template support enabled
 */

/// <reference types="@brandingbrand/code-jest-config" />

import {fs, path} from '@brandingbrand/code-cli-kit';
import cleanPlugin from '../src';

describe('Clean Plugin', () => {
  /**
   * Tests for iOS directory cleaning functionality
   */
  describe('ios()', () => {
    /**
     * Verifies that the plugin can successfully remove an existing iOS directory
     * @test Checks directory existence before and after cleaning
     */
    it('should remove ios directory when it exists', async () => {
      // Verify ios directory exists before cleaning
      const iosExists = await fs.doesPathExist(path.project.resolve('ios'));
      expect(iosExists).toBe(true);

      // Execute ios clean
      await cleanPlugin.ios?.(__flagship_code_build_config, {} as any);

      // Verify ios directory was removed
      const iosExistsAfter = await fs.doesPathExist(
        path.project.resolve('ios'),
      );
      expect(iosExistsAfter).toBe(false);
    });

    /**
     * Verifies that the plugin handles gracefully when iOS directory doesn't exist
     * @test Ensures no errors are thrown for missing directory
     */
    it('should not throw error when ios directory does not exist', async () => {
      // Remove ios directory first
      // await cleanPlugin.ios?.(__flagship_code_build_config, {} as any);

      // Attempt to clean again - should not throw
      await expect(
        cleanPlugin.ios?.(__flagship_code_build_config, {} as any),
      ).resolves.not.toThrow();
    });
  });

  /**
   * Tests for Android directory cleaning functionality
   */
  describe('android()', () => {
    /**
     * Verifies that the plugin can successfully remove an existing Android directory
     * @test Checks directory existence before and after cleaning
     */
    it('should remove android directory when it exists', async () => {
      // Verify android directory exists before cleaning
      const androidExists = await fs.doesPathExist(
        path.project.resolve('android'),
      );
      expect(androidExists).toBe(true);

      // Execute android clean
      await cleanPlugin.android?.(__flagship_code_build_config, {} as any);

      // Verify android directory was removed
      const androidExistsAfter = await fs.doesPathExist(
        path.project.resolve('android'),
      );
      expect(androidExistsAfter).toBe(false);
    });

    /**
     * Verifies that the plugin handles gracefully when Android directory doesn't exist
     * @test Ensures no errors are thrown for missing directory
     */
    it('should not throw error when android directory does not exist', async () => {
      // Remove android directory first
      await cleanPlugin.android?.(__flagship_code_build_config, {} as any);

      // Attempt to clean again - should not throw
      await expect(
        cleanPlugin.android?.(__flagship_code_build_config, {} as any),
      ).resolves.not.toThrow();
    });
  });
});
