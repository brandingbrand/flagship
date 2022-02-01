import { Commit } from '../git/commit';

export const fixCasingFilter = (commit: Commit) => {
  const diffs = Array.from(commit.diffs);

  const duplicateFiles = diffs
    .map(({ path }) => path)
    .filter(
      (path, i) => diffs.findIndex((diff) => diff.path.toLowerCase() === path.toLowerCase()) !== i
    );

  if (duplicateFiles.length) {
    const originalDiff = diffs.filter(
      ({ body, path }) =>
        !(duplicateFiles.includes(path.toLowerCase()) && body.startsWith('new file mode'))
    );

    const correctionDiff = diffs.filter(
      ({ body, path }) =>
        duplicateFiles.includes(path.toLowerCase()) && body.startsWith('new file mode')
    );

    const originalCommit = commit.withDiffs(new Set(originalDiff));
    const correctionCommit = commit.withDiffs(new Set(correctionDiff));

    return [originalCommit, correctionCommit];
  }

  return [commit];
};
