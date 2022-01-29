export const extractRepoId = (url: string): string | undefined => {
  /**
   * Matches any of the following extracting `someName/test`
   *
   * - git@github.com:someName/test.git
   * - http://github.com/someName/some-repo.git
   * - http://www.github.com/someName/some-repo.git
   * - http://someName:something@github.com/someName/some-repo.git
   * - https://github.com/someName/some-repo.git
   * - https://www.github.com/someName/some-repo.git
   * - https://someName:something@github.com/someName/some-repo.git
   */
  const repoUrlMatcher = /(?:git@|ht{2}ps?:\/{2})(?:.*:.*@)?(?:w{3}.)?\w*\.\w*[/:](.*\/.*).git/;
  const result = repoUrlMatcher.exec(url);
  if (result === null) return undefined;

  return result[1];
};
