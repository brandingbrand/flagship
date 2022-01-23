import { ShipConfig } from '../configs/ship.config';
import { Repo } from '../git/repo';
import { ShellCommand } from '../git/shell-command';
import { tmpDir } from '../utils/temp-dir.util';

import { Phase } from './phase';

/**
 * This phase verifies integrity of the exported repository. This does so by
 * following these steps:
 *
 * 1) It exports every project from monorepo and filters it. This way we'll get
 *    fresh state of the project.
 * 2) It adds exported remote and compares these two repositories.
 *
 * There should not be any differences if everything goes well. Otherwise it
 * means that either source and destination are out of sync or there is a bug
 * in Shipit project.
 */
export class VerifyRepoPhase implements Phase {
  constructor(private readonly config: ShipConfig) {}

  public readonly readableName = 'Verify integrity of the repository';

  private createNewEmptyRepo(path: string): Repo {
    new ShellCommand(path, 'git', 'init').runSynchronously();
    const repo = new Repo(path);
    repo.configure();
    return repo;
  }

  public run(): void {
    const dirtyExportedRepoPath = tmpDir('brandingbrand-shipit-verify-dirty-');
    const dirtyExportedRepo = this.createNewEmptyRepo(dirtyExportedRepoPath);

    const { destinationRepo, sourceRepo } = this.config;
    sourceRepo.export(dirtyExportedRepoPath);

    new ShellCommand(dirtyExportedRepoPath, 'git', 'add', '.', '--force').runSynchronously();
    new ShellCommand(
      dirtyExportedRepoPath,
      'git',
      'commit',
      '-m',
      'chore(repo): Initial filtered commit'
    ).runSynchronously();

    const dirtyCommit = dirtyExportedRepo.getCommitFromID('HEAD');
    if (dirtyCommit === undefined) throw new Error('Unexpected empty commit');

    const filter = this.config.getEgressFilter();
    const filteredCommit = filter(dirtyCommit).withHeader('chore(repo): Initial filtered commit');

    const filteredRepoPath = tmpDir('brandingbrand-shipit-verify-filtered-');
    const filteredRepo = this.createNewEmptyRepo(filteredRepoPath);
    filteredRepo.commitPatch(filteredCommit);

    new ShellCommand(
      filteredRepoPath,
      'git',
      'remote',
      'add',
      'shipit_destination',
      destinationRepo.path // notice we don't use URL here but locally updated repo instead
    ).runSynchronously();

    new ShellCommand(filteredRepoPath, 'git', 'fetch', 'shipit_destination').runSynchronously();

    const diffStats = new ShellCommand(
      filteredRepoPath,
      'git',
      '--no-pager',
      'diff',
      '--stat',
      'HEAD',
      `shipit_destination/${destinationRepo.getBranch()}`
    )
      .runSynchronously()
      .stdout.trim()
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => !this.config.ignoredFilesAfterMap.some((file) => line.startsWith(file)))
      .join('\n');

    // There will almost always be 1 line for the summary
    if (diffStats.split('\n').length > 1) {
      throw new Error(`❌ Repository is out of SYNC!\n${diffStats}`);
    }
  }
}
