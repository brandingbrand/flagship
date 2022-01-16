import { Commit, Diff } from '../git/commit';

export const replaceText =
  (searchValue?: RegExp | string, replaceValue?: string) =>
  (commit: Commit): Commit => {
    if (searchValue === undefined || replaceValue === undefined) return commit;

    const search =
      typeof searchValue === 'string' ? new RegExp(`${searchValue}`, 'g') : searchValue;

    const diffs = new Set<Diff>();
    for (const diff of Array.from(commit.diffs)) {
      diffs.add({
        ...diff,
        body: diff.body
          .split('\n')
          .map((line) => line.replace(search, replaceValue))
          .join('\n'),
      });
    }

    return commit
      .withDiffs(diffs)
      .withDescription(commit.description.replace(search, replaceValue));
  };
