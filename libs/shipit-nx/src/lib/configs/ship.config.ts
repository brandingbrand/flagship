import { join } from 'path';
import { readdirSync } from 'fs';
import { pipe } from 'fp-ts/lib/function';

import { Repo, Commit } from '@brandingbrand/git';

import {
  addTrackingData,
  fixCasingFilter,
  mapPaths,
  replaceText,
  stripCommitMessages,
  stripPaths,
  stripProjectPath,
} from '../filters';
import { Project, ProjectFilter } from '../utils/find-closed-projects.util';
import { tmpDir } from '../utils/temp-dir.util';

type CommitFilter = (changes: Commit) => Commit[];
const COMMIT_LINK = /\(\[((?:\d|[a-f]){7})].*\/((?:\d|[a-f]){40})\)\)/;

export interface ShipConfigOptions {
  readonly sourcePath: string;
  readonly destinationRepoURL: string;
  readonly destinationBranch?: string;
}

export interface ShipProjectOptions extends ShipConfigOptions {
  readonly project: string;
  readonly projectRoot: string;
  readonly dependencies: Set<string>;
  readonly dependents: Set<string>;
  readonly workspace: string[];
}

export class ShipConfig {
  constructor(public readonly options: ShipConfigOptions | ShipProjectOptions) {}

  public readonly projectsByCommit = new Map<string, Project[]>();
  private readonly destinationPath = tmpDir('brandingbrand-shipit-');
  public readonly sourceRepo = new Repo(this.options.sourcePath);
  public readonly destinationRepo = new Repo(this.destinationPath, this.options.destinationRepoURL);
  public readonly destinationBranch = this.options.destinationBranch ?? 'main';

  public get ignoredFiles(): string[] {
    /**
     * Post processed files
     */
    const postProcessedFiles = [
      'nx.json',
      'package.json',
      'package-lock.json',
      'tsconfig.base.json',
      'workspace.json',
    ];

    const excludedPaths = ['.env.example', '.github', 'CHANGELOG.md', '.vscode/launch.json'];
    const projectSpecificExcludedPaths =
      'project' in this.options
        ? [join(this.options.projectRoot, 'package.json'), 'README.md']
        : [];

    const unusedPatches = readdirSync('patches')
      .map((fileName) => {
        // `@nstudio+nps-i+1.1.1.patch` OR `css-tree+1.1.3.patch`
        const nameSegments = fileName.split('+');
        // Remove version number and extension, ie `1.1.1.patch`
        nameSegments.pop();
        return { packageName: nameSegments.join('/'), fileName };
      })
      .filter(({ packageName }) => {
        if ('project' in this.options) {
          return !this.options.dependencies.has(packageName);
        }

        return false;
      })
      .map(({ fileName }) => join('patches', fileName));

    return [
      ...postProcessedFiles,
      ...excludedPaths,
      ...projectSpecificExcludedPaths,
      ...unusedPatches,
    ];
  }

  public get pathMap(): Record<string, string> {
    const projectSpecificPathMap: Record<string, string> =
      'project' in this.options
        ? {
            [join(this.options.projectRoot, 'README.md')]: 'README.md',
          }
        : {};

    return {
      ...projectSpecificPathMap,
    };
  }

  public get ignoredFilesAfterMap(): string[] {
    const pathMapDestinations = Object.values(this.pathMap);
    return this.ignoredFiles.filter((file) => !pathMapDestinations.includes(file));
  }

  public getEgressFilter(): CommitFilter {
    return (commit: Commit) =>
      pipe(
        commit,
        stripPaths(this.ignoredFiles),
        mapPaths(this.pathMap),
        stripProjectPath(this),
        stripCommitMessages(this),
        replaceText(this.sourceRepo.id, this.destinationRepo.id),
        replaceText(COMMIT_LINK, '($1)'),
        addTrackingData,
        fixCasingFilter
      );
  }

  public getIngressFilter(): CommitFilter {
    return (commit: Commit) =>
      pipe(commit, replaceText(this.destinationRepo.id, this.sourceRepo.id), fixCasingFilter);
  }

  public excludedProjectsFilter: ProjectFilter = (project) => {
    if (project.name === 'workspace') {
      return false;
    }

    if ('project' in this.options) {
      return !(project.name === this.options.project || this.options.dependents.has(project.name));
    }

    return !project.tags?.includes('open-source');
  };
}
