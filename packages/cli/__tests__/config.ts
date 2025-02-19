import {program} from 'commander';

import {
  isAlignDepsCommand,
  isGenerateCommand,
  isPackage,
  isPrebuildCommand,
} from '../src/lib/config';

describe('isPackage', () => {
  it('should return true for a valid package name', () => {
    const packageName = 'lodash';
    expect(isPackage(packageName)).toBe(true);
  });

  it('should return true for a valid scoped package name', () => {
    const scopedPackageName = '@types/lodash';
    expect(isPackage(scopedPackageName)).toBe(true);
  });

  it('should return false for a file path', () => {
    const filePath = 'path/to/file';
    expect(isPackage(filePath)).toBe(false);
  });

  it('should return false for a Windows file path', () => {
    const windowsFilePath = 'C:\\path\\to\\file';
    expect(isPackage(windowsFilePath)).toBe(false);
  });

  it('should return false for a file path with extension', () => {
    const filePathWithExtension = 'file.js';
    expect(isPackage(filePathWithExtension)).toBe(true);
  });
});

describe('isCommand', () => {
  it('isGenerateCommand', () => {
    program.args = ['prebuild'];

    expect(isGenerateCommand()).not.toBeTruthy();
    expect(isPrebuildCommand()).toBeTruthy();
  });

  it('isPrebuildCommand', () => {
    program.args = ['plugin'];

    expect(isPrebuildCommand()).not.toBeTruthy();
    expect(isGenerateCommand()).toBeTruthy();
  });

  it('isAlignDepsCommand', () => {
    program.args = ['align-deps'];

    expect(isGenerateCommand()).not.toBeTruthy();
    expect(isAlignDepsCommand()).toBeTruthy();
  });
});
