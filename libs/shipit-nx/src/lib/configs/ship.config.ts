import { pipe } from 'fp-ts/lib/function';

import {
  addTrackingData,
  removeProjects,
  replaceText,
  stripCommitMessages,
  stripPaths,
  stripProjectPath,
} from '../filters';
import { Project } from '../utils/find-closed-projects.util';
import { tmpDir } from '../utils/temp-dir.util';

import { Commit } from '../git/commit';
import { Repo } from '../git/repo';

type CommitFilter = (changes: Commit) => Commit;
const COMMIT_LINK = /\(\[((?:\d|[a-f]){7})].*\/((?:\d|[a-f]){40})\)\)/;

export class ShipConfig {
  constructor(
    private readonly sourcePath: string,
    private readonly destinationRepoURL: string,
    public readonly destinationBranch: string = 'main',
    public readonly projectsByCommit = new Map<string, Project[]>()
  ) {}

  private readonly destinationPath = tmpDir('brandingbrand-shipit-');
  public readonly sourceRepo = new Repo(this.sourcePath);
  public readonly destinationRepo = new Repo(this.destinationPath, this.destinationRepoURL);

  public getEgressFilter(): CommitFilter {
    return (commit: Commit) =>
      pipe(
        commit,
        stripPaths(['.github', '.vscode/launch.json', 'CHANGELOG.md']),
        stripProjectPath(this),
        removeProjects(this),
        stripCommitMessages(this),
        replaceText(this.sourceRepo.id, this.destinationRepo.id),
        replaceText(COMMIT_LINK, '($1)'),
        addTrackingData
      );
  }

  public getIngressFilter(): CommitFilter {
    return (commit: Commit) =>
      pipe(commit, replaceText(this.destinationRepo.id, this.sourceRepo.id));
  }
}
