import { ShipConfig } from '../configs/ship.config';
import { StandaloneWorkspace } from '../models/standalone-workspace';

export type IsOpenCallback = (project: Project) => boolean;

export interface Project {
  name: string;
  root: string;
  tags?: string[];
}

const DEFAULT_IS_OPEN: IsOpenCallback = (project) =>
  ('root' in project && project.name === 'workspace') ||
  (project.tags?.includes('open-source') ?? false);

export const findProjectsForCommit = (config: ShipConfig, commitId: string): Project[] => {
  try {
    const workspaceJson = config.sourceRepo.getJsonFromRevision<StandaloneWorkspace>(
      commitId,
      'workspace.json'
    );

    return Object.entries(workspaceJson.projects)
      .map(([name, path]) => {
        try {
          const project =
            typeof path === 'string'
              ? config.sourceRepo.getJsonFromRevision<Project>(commitId, `${path}/project.json`)
              : path;

          return { name, root: project.root, ...(project.tags ? { tags: project.tags } : {}) };
        } catch {
          return null;
        }
      })
      .filter((project): project is Project => project !== null);
  } catch {
    return [];
  }
};

export const findClosedProjectsForRevision = (
  config: ShipConfig,
  revision: string,
  isOpen: IsOpenCallback = DEFAULT_IS_OPEN
): Project[] => {
  const last10CommitsProjects = Array.from({ length: 10 }, (_, i) => {
    try {
      const augment = i !== 0 ? `~${i}` : '';
      const commitId = config.sourceRepo.getCommitIdFromRevision(`${revision}${augment}`);
      const cached = config.projectsByCommit.get(commitId);
      if (cached) {
        return cached;
      }

      const projects = findProjectsForCommit(config, `${revision}${augment}`);
      config.projectsByCommit.set(commitId, projects);
      return projects;
    } catch {
      return [];
    }
  }).flat();

  return last10CommitsProjects
    .filter(({ name }, index) => {
      const firstIndex = last10CommitsProjects.findIndex((project) => project.name === name);

      return firstIndex === index;
    })
    .filter((project) => !isOpen(project));
};
