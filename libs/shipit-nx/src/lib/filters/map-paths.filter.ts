import { Commit, Diff } from '../git/commit';

/**
 * Remove any modifications to paths matching `stripPatterns`.
 *
 * @param excludedPaths a list of projects to exclude
 * @return modified commit
 */
export const mapPaths =
  (pathMap: Record<string, string>) =>
  (commit: Commit): Commit => {
    const diffs = new Set<Diff>();
    for (const diff of Array.from(commit.diffs)) {
      diffs.add({ ...diff, path: pathMap[diff.path] ?? diff.path });
    }

    return commit.withDiffs(diffs);
  };
