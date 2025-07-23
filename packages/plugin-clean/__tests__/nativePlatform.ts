/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import {fs, path} from '@brandingbrand/code-cli-kit';
import cleanPlugin from '../src';

/**
 * Test suite for the Clean Plugin functionality
 *
 * @remarks
 * This test suite verifies that the plugin correctly handles cleaning of both iOS and Android
 * native directories. It utilizes the custom Jest environment that provides a temporary test
 * fixture with native directories pre-populated.
 */
describe('Clean Plugin', () => {
  /**
   * Integration tests that verify the plugin can handle cleaning multiple platforms
   */
  describe('Integration', () => {
    /**
     * Tests the concurrent cleaning of both iOS and Android directories
     *
     * @remarks
     * - First verifies both directories exist in the temporary test environment
     * - Executes clean operations for both platforms concurrently using Promise.all
     * - Verifies both directories are successfully removed after cleaning
     */
    it('should be able to clean both ios and android directories', async () => {
      // Verify both directories exist initially
      const [iosExists, androidExists] = await Promise.all([
        fs.doesPathExist(path.project.resolve('ios')),
        fs.doesPathExist(path.project.resolve('android')),
      ]);

      expect(iosExists).toBe(true);
      expect(androidExists).toBe(true);

      // Clean both directories
      await Promise.all([
        cleanPlugin.ios?.(__flagship_code_build_config, {} as any),
        cleanPlugin.android?.(__flagship_code_build_config, {} as any),
      ]);

      // Verify both directories were removed
      const [iosExistsAfter, androidExistsAfter] = await Promise.all([
        fs.doesPathExist(path.project.resolve('ios')),
        fs.doesPathExist(path.project.resolve('android')),
      ]);

      expect(iosExistsAfter).toBe(false);
      expect(androidExistsAfter).toBe(false);
    });
  });
});
