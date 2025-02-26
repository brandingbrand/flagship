import {isPackage} from '@/utils';

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
