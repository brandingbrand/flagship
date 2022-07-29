import { extractRepoId } from './extract-repo-id.util';

describe('extractRepoId', () => {
  it('should extract id from git urls', () => {
    const id = extractRepoId('git@github.com:someName/test.git');

    expect(id).toBe('someName/test');
  });

  it('should extract id from http urls', () => {
    const id = extractRepoId('http://github.com/someName/test.git');

    expect(id).toBe('someName/test');
  });

  it('should extract id from http urls with www', () => {
    const id = extractRepoId('http://www.github.com/someName/test.git');

    expect(id).toBe('someName/test');
  });

  it('should extract id from http urls with passwords', () => {
    const id = extractRepoId('http://username:password@github.com/someName/test.git');

    expect(id).toBe('someName/test');
  });

  it('should extract id from http urls with tokens', () => {
    const id = extractRepoId('http://token@github.com/someName/test.git');

    expect(id).toBe('someName/test');
  });

  it('should extract id from https urls', () => {
    const id = extractRepoId('https://github.com/someName/test.git');

    expect(id).toBe('someName/test');
  });

  it('should extract id from https urls with www', () => {
    const id = extractRepoId('https://www.github.com/someName/test.git');

    expect(id).toBe('someName/test');
  });

  it('should extract id from https urls with passwords', () => {
    const id = extractRepoId('https://username:password@github.com/someName/test.git');

    expect(id).toBe('someName/test');
  });

  it('should extract id from https urls with tokens', () => {
    const id = extractRepoId('https://token@github.com/someName/test.git');

    expect(id).toBe('someName/test');
  });
});
