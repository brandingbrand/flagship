const REPO_URL_REGEX = /(?:git@|ht{2}ps?:\/{2})(?:.*:.*@)?.*@?(?:w{3}.)?\w*\.\w*[/:](.*\/.*).git/;

/**
 * Matches any of the following extracting `someName/test`
 *
 * - git@github.com:someName/test.git
 * - http://github.com/someName/test.git
 * - http://www.github.com/someName/test.git
 * - http://someName:something@github.com/someName/test.git
 * - http://token@github.com/someName/test.git
 * - https://github.com/someName/test.git
 * - https://www.github.com/someName/test.git
 * - https://someName:something@github.com/someName/test.git
 * - https://token@github.com/someName/test.git
 *
 * @param url
 * @return
 */
export const extractRepoId = (url: string): string | undefined => {
  const result = REPO_URL_REGEX.exec(url);

  if (result === null) {
    return undefined;
  }

  return result[1];
};
