import type { Project } from '../utils/find-closed-projects.util';

export interface StandaloneWorkspace {
  projects: Record<string, Project | string>;
}
