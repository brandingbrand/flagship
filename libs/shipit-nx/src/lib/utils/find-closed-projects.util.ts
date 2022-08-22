import type { Commit } from '@brandingbrand/git';

import dedent from 'ts-dedent';

import type { ShipConfig } from '../configs/ship.config';
import type { StandaloneWorkspace } from '../models/standalone-workspace';

export type ProjectFilter = (project: Project) => boolean;

export interface Project {
  name: string;
  root: string;
  tags?: string[];
  isConfigMissing?: boolean;
}

const normalizeProject = (
  name: string,
  { isConfigMissing, root, tags }: Partial<Project> & { root: string }
): Project => ({
  name,
  root,
  ...(isConfigMissing !== undefined ? { isConfigMissing } : {}),
  ...(tags !== undefined ? { tags } : {}),
});

const findProjectsForCommit = (
  config: ShipConfig,
  commitId: string,
  changedFiles: string[]
): Project[] => {
  try {
    const workspaceJson = config.sourceRepo.getJsonFromRevision<StandaloneWorkspace>(
      commitId,
      'workspace.json'
    );

    const workspaceProjects = Object.entries(workspaceJson.projects).map(
      ([name, path]): Project => {
        if (typeof path === 'object') {
          return { name, root: path.root, ...(path.tags ? { tags: path.tags } : {}) };
        }

        const projectJson = `${path}/project.json`;
        if (!changedFiles.includes(projectJson)) {
          const existingConfig = config.projectConfigs.get(name);
          if (existingConfig) {
            return existingConfig;
          }
        }

        try {
          const project = config.sourceRepo.getJsonFromRevision<Omit<Project, 'root'>>(
            commitId,
            projectJson
          );
          return normalizeProject(name, { ...project, root: path });
        } catch {
          return normalizeProject(name, { root: path, isConfigMissing: true });
        }
      }
    );

    const missingProjectConfigs = changedFiles
      .filter((file) => file.endsWith('/project.json'))
      .map((file) => file.replace(/\/project\.json$/, ''))
      .filter(
        (root) =>
          !workspaceProjects.some((project) => typeof project === 'object' && project.root === root)
      )
      .map((root): Project => {
        const name = root.split('/').slice(1).join('-');
        try {
          const projectJson = `${root}/project.json`;
          const project = config.sourceRepo.getJsonFromRevision<Omit<Project, 'root'>>(
            commitId,
            projectJson
          );
          return normalizeProject(name, { ...project, root });
        } catch {
          return normalizeProject(name, { root });
        }
      });

    for (const missingProjectConfig of missingProjectConfigs) {
      config.addWarning(
        dedent`
          \n
          WARNING: ${missingProjectConfig.root} added before workspace.json reference...
          Assuming project name is ${missingProjectConfig.name}
        `
      );
    }

    return [...workspaceProjects, ...missingProjectConfigs];
  } catch {
    return [];
  }
};

const findProjectFromFutureRevision = (
  config: ShipConfig,
  revision: string,
  project: Project
): Project | null => {
  const futureRevisions = config.sourceRepo.getFutureRevisionIds(revision);
  for (const futureRevision of futureRevisions) {
    try {
      const projectJson = `${project.root}/project.json`;
      const futureConfig = config.sourceRepo.getJsonFromRevision<Omit<Project, 'root'>>(
        futureRevision,
        projectJson
      );
      return normalizeProject(project.name, { ...futureConfig, root: project.root });
    } catch {
      continue;
    }
  }

  return null;
};

/**
 * Provides a list of projects to exclude for a given revision
 *
 * Note: This assumes that it will always see commits in order
 *
 * @param config
 * @param commit
 * @return
 * @throws if a project configuration is missing both in past revisions and future revisions
 */
export const findFilteredProjectsForRevision = (config: ShipConfig, commit: Commit): Project[] => {
  const { changedFiles, id } = commit;

  const hasProjectConfigsChanged =
    changedFiles.includes('workspace.json') ||
    changedFiles.some((file) => file.endsWith('project.json'));

  if (config.projectConfigsInitialized && !hasProjectConfigsChanged) {
    return [...config.projectConfigs.values()].filter(config.excludedProjectsFilter);
  }

  const projects = findProjectsForCommit(config, id, changedFiles);
  for (const project of projects) {
    if (project.isConfigMissing === true) {
      if (!config.projectConfigs.has(project.name)) {
        config.addWarning(dedent`
          \n
          WARNING: workspace.json reference added BEFORE ${project.name} configuration...
          Attempting to find project configuration from the future
        `);

        const projectConfig = findProjectFromFutureRevision(config, id, project);

        if (projectConfig === null) {
          throw new Error(`Missing ${project.name} configuration at revision ${id}!`);
        }

        config.projectConfigs.set(project.name, projectConfig);
      }
    } else {
      config.projectConfigs.set(project.name, project);
    }
  }

  config.projectConfigsInitialized = true;

  return [...config.projectConfigs.values()].filter(config.excludedProjectsFilter);
};
