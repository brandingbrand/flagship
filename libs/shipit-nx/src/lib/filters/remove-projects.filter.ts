import { pipe } from 'fp-ts/lib/function';

import { Commit, Diff } from '../git/commit';
import { ShipConfig } from '../configs/ship.config';
import { findClosedProjectsForRevision } from '../utils/find-closed-projects.util';

const process = (commit: Commit, pattern: RegExp, filter: (diff: Diff) => boolean): Commit => {
  const diffs = new Set<Diff>();
  for (const diff of Array.from(commit.diffs)) {
    if (filter(diff)) {
      diffs.add({
        ...diff,
        body: diff.body
          .split('\n')
          .map((line) => line.replace(pattern, '$1'))
          .join('\n'),
      });
    } else {
      diffs.add(diff);
    }
  }

  return commit.withDiffs(diffs);
};

const removeImports =
  (excludedProjects: readonly string[]) =>
  (commit: Commit): Commit => {
    if (excludedProjects.length === 0) return commit;

    const pattern = new RegExp(
      `^([-+ ]\\s*)(\\S.*) \\["(${excludedProjects.join('|').replace(/\//g, '\\/')}).*"],?$`
    );
    return process(commit, pattern, (diff) => diff.path === 'tsconfig.base.json');
  };

const removeConfigurations =
  (excludedProjects: readonly string[]) =>
  (commit: Commit): Commit => {
    if (excludedProjects.length === 0) return commit;

    const pattern = new RegExp(
      `^([-+ ]\\s*)(\\S.*)"(${excludedProjects.join('|').replace(/\//g, '\\/')})",?$`
    );
    return process(commit, pattern, (diff) => diff.path === 'workspace.json');
  };

const removeDebuggers =
  (excludedProjects: readonly string[]) =>
  (commit: Commit): Commit => {
    if (excludedProjects.length === 0) return commit;

    const pattern = new RegExp(
      `^([-+ ]\\s*)(\\S.*) ".*(${excludedProjects.join('|').replace(/\//g, '\\/')}).*",?$`
    );
    return process(commit, pattern, (diff) => diff.path === '.vscode/launch.json');
  };

const removeDefaultProject = (commit: Commit): Commit => {
  const pattern = /^([ +-]\s*)"defaultProject":\s*".*",?$/;
  return process(commit, pattern, (diff) => diff.path === 'nx.json');
};

export const removeProjects =
  (config: ShipConfig) =>
  (commit: Commit): Commit => {
    const closedPaths = findClosedProjectsForRevision(config, commit.id).map(({ root }) => root);

    return pipe(
      commit,
      removeDebuggers(closedPaths),
      removeImports(closedPaths),
      removeConfigurations(closedPaths),
      removeDefaultProject
    );
  };
