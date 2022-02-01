import { Commit, Diff } from '../git/commit';
import { escapeRegex } from '../utils/escape-regex.util';

/**
 * Remove any modifications to paths matching `stripPatterns`.
 *
 * @param excludedPaths a list of projects to exclude
 * @return modified commit
 */
export const mapPaths =
  (pathMap: Record<string, string>) =>
  (commit: Commit): Commit => {
    const rewriteCallback = (oldPath: string) => {
      let newPath = oldPath;
      for (const [src, dest] of Object.entries(pathMap)) {
        let matchFound = false;
        if (new RegExp(`^${escapeRegex(src)}`).test(newPath)) {
          matchFound = true;
        }
        newPath = newPath.replace(new RegExp(`^${escapeRegex(src)}`), dest);
        if (matchFound) {
          break; // only first match in the map
        }
      }
      return newPath;
    };

    const diffs = new Set<Diff>();
    for (const diff of Array.from(commit.diffs)) {
      const oldPath = diff.path;
      const newPath = rewriteCallback(oldPath);
      if (oldPath === newPath) {
        diffs.add(diff);
        continue;
      }

      let body = diff.body;
      body = body.replace(new RegExp(`^--- a/${escapeRegex(oldPath)}`, 'm'), `--- a/${newPath}`);
      body = body.replace(
        new RegExp(`^\\+\\+\\+ b/${escapeRegex(oldPath)}`, 'm'),
        `+++ b/${newPath}`
      );

      diffs.add({
        path: newPath,
        body,
      });
    }

    return commit.withDiffs(diffs);
  };
