/**
 * @jest-environment-options {"requireTemplate": true}
 */

/// <reference types="@brandingbrand/code-jest-config" />

import {path} from '@brandingbrand/code-cli-kit';
import packagerInstallPlugin from '../src';

// Mock the getExeca module
jest.mock('../src/execa', () => ({
  getExeca: jest.fn().mockResolvedValue(function* () {
    yield 'Installing...';
    yield 'Done!';
  }),
}));

describe('Packager Install Plugin', () => {
  let mockGetExeca: jest.Mock;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Get reference to mocked getExeca
    mockGetExeca = require('../src/execa').getExeca;

    // Default mock implementation
    mockGetExeca.mockResolvedValue(function* () {
      yield 'Installing...';
      yield 'Done!';
    });
  });

  describe('Platform Specific Installation', () => {
    it('should successfully install for iOS', async () => {
      const mockExeca = jest.fn(function* () {
        yield 'Installing...';
        yield 'Done!';
      });
      mockGetExeca.mockResolvedValue(mockExeca);

      await packagerInstallPlugin.ios?.({} as any, {} as any);

      expect(mockExeca).toHaveBeenCalledTimes(2);
      expect(mockExeca).toHaveBeenCalledWith('bundle', ['install'], {
        cwd: path.project.resolve('ios'),
      });
      expect(mockExeca).toHaveBeenCalledWith(
        'bundle',
        ['exec', 'pod', 'install'],
        {cwd: path.project.resolve('ios')},
      );
    });

    it('should successfully install for Android', async () => {
      const mockExeca = jest.fn(function* () {
        yield 'Installing...';
        yield 'Done!';
      });
      mockGetExeca.mockResolvedValue(mockExeca);

      await packagerInstallPlugin.android?.({} as any, {} as any);

      expect(mockExeca).toHaveBeenCalledTimes(1);
      expect(mockExeca).toHaveBeenCalledWith('bundle', ['install'], {
        cwd: path.project.resolve('android'),
      });
    });

    it('should handle iOS installation failures', async () => {
      const mockExeca = jest.fn(() => {
        throw new Error('Gem install failed');
      });
      mockGetExeca.mockResolvedValue(mockExeca);

      await expect(
        packagerInstallPlugin.ios?.({} as any, {} as any),
      ).rejects.toThrow(
        'Error: failed to run "bundle exec install" for iOS: Gem install failed',
      );
    });

    it('should handle Android installation failures', async () => {
      const mockExeca = jest.fn(() => {
        throw new Error('Android install failed');
      });
      mockGetExeca.mockResolvedValue(mockExeca);

      await expect(
        packagerInstallPlugin.android?.({} as any, {} as any),
      ).rejects.toThrow(
        'Error: failed to run "bundle exec install" for Android: Android install failed',
      );
    });
  });
});
